import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DenoRequest {
  method: string;
  json: () => Promise<any>;
}

serve(async (req: DenoRequest) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get all users who have completed at least one check-in
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, name')
      .eq('role', 'employee');

    if (usersError) throw usersError;
    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const nudgesCreated = [];

    for (const user of users) {
      // Get recent check-ins and mood data
      const { data: recentCheckIns } = await supabase
        .from('check_ins')
        .select('mood, date, content')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(7);

      // Get recent weekly survey
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekStartStr = weekStart.toISOString().split('T')[0];

      const { data: recentSurvey } = await supabase
        .from('weekly_surveys')
        .select('moodmeter_score, mood, wellbeing, risks')
        .eq('user_id', user.id)
        .gte('week_start', weekStartStr)
        .order('week_start', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Get existing unread nudges count
      const { count: unreadCount } = await supabase
        .from('nudges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      // Skip if user has too many unread nudges
      if ((unreadCount || 0) >= 5) continue;

      // Analyze data and generate personalized nudge
      const analysis = analyzeUserData(recentCheckIns || [], recentSurvey);
      
      if (!analysis.shouldGenerateNudge) continue;

      // Generate nudge text using AI
      const nudgePrompt = `Generate a brief, supportive coaching message (2-3 sentences max) for an employee based on this analysis:
${JSON.stringify(analysis, null, 2)}

The message should be:
- Encouraging and supportive
- Actionable with a specific suggestion
- Personal but professional
- Focused on wellbeing and growth

Generate only the message text, no explanations.`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'user', content: nudgePrompt }
          ],
        }),
      });

      if (!aiResponse.ok) continue;

      const aiData = await aiResponse.json();
      const nudgeText = aiData.choices[0].message.content.trim();

      // Insert nudge into database
      const { error: insertError } = await supabase
        .from('nudges')
        .insert({
          user_id: user.id,
          nudge_text: nudgeText,
          type: analysis.nudgeType,
          is_read: false,
        });

      if (!insertError) {
        nudgesCreated.push({ userId: user.id, nudgeText });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Generated ${nudgesCreated.length} nudges`,
        nudges: nudgesCreated,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-nudges:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function analyzeUserData(checkIns: any[], survey: any) {
  // Determine if we should generate a nudge
  let shouldGenerateNudge = false;
  let nudgeType = 'general';
  let analysis = '';

  // Check mood trends
  if (checkIns.length >= 3) {
    const recentMoods = checkIns.slice(0, 3).map(c => c.mood);
    const negativeMoods = recentMoods.filter(m => m === 'sad' || m === 'very_sad');
    
    if (negativeMoods.length >= 2) {
      shouldGenerateNudge = true;
      nudgeType = 'mood_support';
      analysis = 'User has been experiencing negative moods recently.';
    } else if (recentMoods.every(m => m === 'very_happy' || m === 'happy')) {
      shouldGenerateNudge = true;
      nudgeType = 'celebration';
      analysis = 'User has been consistently positive. Encourage maintaining this momentum.';
    }
  }

  // Check survey data
  if (survey) {
    if (survey.moodmeter_score && survey.moodmeter_score < 50) {
      shouldGenerateNudge = true;
      nudgeType = 'wellbeing_concern';
      analysis = `User's wellbeing score is low (${survey.moodmeter_score}). They may need support.`;
    }

    if (survey.risks && survey.risks.length > 50) {
      shouldGenerateNudge = true;
      nudgeType = 'risk_awareness';
      analysis = 'User mentioned concerns in their weekly survey.';
    }
  }

  // Check for lack of engagement
  if (checkIns.length === 0) {
    shouldGenerateNudge = true;
    nudgeType = 'engagement';
    analysis = 'User has not been checking in. Encourage regular engagement.';
  }

  return {
    shouldGenerateNudge,
    nudgeType,
    analysis,
    checkInCount: checkIns.length,
    recentMood: checkIns[0]?.mood || 'unknown',
    moodmeterScore: survey?.moodmeter_score || null,
  };
}

// Note: This function should be called via a scheduled job (cron) or manually
// To set up scheduling, use Supabase Cron or an external scheduler

