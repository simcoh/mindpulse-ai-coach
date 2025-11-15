# MindPulse AI Coach - API Implementation Guide for Architect

## Executive Summary

This document provides a comprehensive analysis of the MindPulse AI Coach application and a step-by-step guide for making it fully functional using APIs. The application is a React-based mental health coaching platform for employees with admin capabilities, built on Supabase backend.

---

## 1. Application Architecture Overview

### Technology Stack
- **Frontend**: React 18.3.1 + TypeScript + Vite
- **UI Framework**: shadcn/ui components + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **AI Integration**: Lovable AI Gateway (via Supabase Edge Function)
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router v6

### Application Structure
```
mindpulse-ai-coach/
├── src/
│   ├── pages/           # Main application pages
│   ├── components/      # Reusable UI components
│   ├── integrations/    # Supabase client & types
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions
├── supabase/
│   ├── functions/       # Edge functions (chat-coach)
│   └── migrations/      # Database schema migrations
└── public/              # Static assets
```

---

## 2. Current API Integration Status

### ✅ Fully Implemented APIs

#### 2.1 Supabase Database APIs
**Status**: ✅ Configured and functional

**Tables Used**:
- `profiles` - User profile information
- `chat_messages` - Chat conversation history
- `check_ins` - Daily mood check-ins
- `weekly_surveys` - Weekly employee surveys
- `admin_weekly_surveys` - Admin weekly check-ins
- `admin_questions` - Admin questions/responses
- `goals` - User goals tracking
- `nudges` - AI-generated coaching messages
- `user_roles` - Role-based access control

**Implementation Location**:
- `src/integrations/supabase/client.ts` - Supabase client configuration
- `src/integrations/supabase/types.ts` - TypeScript type definitions

**Required Environment Variables**:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

#### 2.2 Supabase Authentication API
**Status**: ✅ Implemented

**Features**:
- Email/password authentication
- Session management
- Role-based access (employee/admin)
- Auto-redirect based on user role

**Implementation Location**:
- `src/pages/Auth.tsx` - Authentication UI and logic

---

### ⚠️ Partially Implemented APIs

#### 2.3 AI Chat Coach API (Supabase Edge Function)
**Status**: ⚠️ Implemented but requires configuration

**Current Implementation**:
- Edge function: `supabase/functions/chat-coach/index.ts`
- Uses Lovable AI Gateway
- Model: `google/gemini-2.5-flash`

**Required Configuration**:
```env
# In Supabase Dashboard > Edge Functions > chat-coach > Secrets
LOVABLE_API_KEY=your_lovable_api_key
```

**API Endpoint**:
- Frontend calls: `supabase.functions.invoke("chat-coach", { body: { message } })`
- Edge function URL: `https://your-project.supabase.co/functions/v1/chat-coach`

**Current Issues**:
1. ❌ `LOVABLE_API_KEY` environment variable not configured
2. ❌ No error handling for API key missing
3. ❌ No fallback mechanism if AI service is unavailable

**Implementation Locations**:
- `supabase/functions/chat-coach/index.ts` - Edge function implementation
- `src/components/EnhancedChatInterface.tsx` - Frontend integration (lines 151-178, 257-284)
- `src/components/ChatInterface.tsx` - Alternative chat interface

---

### ❌ Missing/Incomplete APIs

#### 2.4 Voice Call API
**Status**: ❌ Not implemented

**Current State**:
- UI exists in `src/pages/Coach.tsx`
- Only has mock start/end call functionality
- No actual voice recording or transcription
- No API integration

**Required Implementation**:
1. Voice recording API (Web Speech API or third-party service)
2. Speech-to-text transcription API
3. Text-to-speech for AI responses
4. Real-time audio streaming (optional)

**Recommended Services**:
- **Web Speech API** (browser-native, free)
- **Deepgram** (real-time transcription)
- **AssemblyAI** (transcription)
- **ElevenLabs** (text-to-speech)

#### 2.5 Voice Input for Weekly Survey
**Status**: ❌ Mock implementation only

**Current State**:
- `src/components/WeeklySurvey.tsx` has voice input UI
- Only simulates recording (lines 45-54)
- No actual voice capture or transcription

**Required Implementation**:
- Integrate Web Speech API or third-party transcription service
- Store transcribed text in `weekly_surveys.voice_input` field

#### 2.6 Admin Chat AI Integration
**Status**: ❌ Not implemented

**Current State**:
- `src/pages/AdminChat.tsx` has chat UI
- Only has mock AI responses (lines 109-116)
- No actual AI integration

**Required Implementation**:
- Connect to same `chat-coach` edge function or create admin-specific function
- Add context about team management and admin responsibilities

#### 2.7 Moodmeter Score Calculation
**Status**: ❌ Mock implementation

**Current State**:
- `src/components/EnhancedChatInterface.tsx` line 196: `Math.floor(Math.random() * 40) + 60`
- No actual algorithm for calculating wellbeing score

**Required Implementation**:
- Create algorithm based on:
  - Weekly survey responses
  - Daily mood check-ins
  - Chat sentiment analysis
  - Historical trends

#### 2.8 Nudges Generation API
**Status**: ❌ Database exists but no generation logic

**Current State**:
- `nudges` table exists in database
- No API or logic to generate nudges
- No UI to display nudges

**Required Implementation**:
- Create edge function or scheduled job to generate nudges
- Analyze user data (mood trends, goals, check-ins)
- Generate personalized coaching messages
- Store in `nudges` table
- Create UI component to display nudges

#### 2.9 Goals Tracking API
**Status**: ⚠️ Database exists but limited functionality

**Current State**:
- `goals` table exists
- No UI for creating/updating goals
- No progress tracking interface

**Required Implementation**:
- Create goals management UI
- API endpoints for CRUD operations
- Progress tracking visualization

---

## 3. Environment Variables Required

### Frontend (.env file in root)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Supabase Edge Functions (Set in Supabase Dashboard)
```env
LOVABLE_API_KEY=your_lovable_api_key
```

### Optional (for future voice features)
```env
DEEPGRAM_API_KEY=your_deepgram_key
ELEVENLABS_API_KEY=your_elevenlabs_key
```

---

## 4. Step-by-Step Implementation Guide

### Phase 1: Core API Configuration (Priority: CRITICAL)

#### Step 1.1: Configure Supabase Project
1. **Create/Verify Supabase Project**
   - Go to https://supabase.com
   - Create new project or use existing
   - Note project URL and anon key

2. **Set Environment Variables**
   - Create `.env` file in `mindpulse-ai-coach/` directory
   - Add:
     ```env
     VITE_SUPABASE_URL=your_project_url
     VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
     ```

3. **Run Database Migrations**
   ```bash
   # Install Supabase CLI if not already installed
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Run migrations
   supabase db push
   ```

4. **Verify Database Schema**
   - Check all tables exist in Supabase Dashboard
   - Verify RLS policies are enabled
   - Test basic queries

#### Step 1.2: Configure AI Chat API
1. **Get Lovable API Key**
   - Sign up at https://lovable.dev
   - Navigate to API settings
   - Generate API key

2. **Deploy Edge Function**
   ```bash
   # Deploy chat-coach function
   supabase functions deploy chat-coach
   ```

3. **Set Edge Function Secret**
   - Go to Supabase Dashboard > Edge Functions > chat-coach
   - Add secret: `LOVABLE_API_KEY` = your_api_key

4. **Test Edge Function**
   ```bash
   # Test locally
   supabase functions serve chat-coach
   
   # Or test via Supabase Dashboard
   # Edge Functions > chat-coach > Test
   ```

5. **Update Error Handling**
   - Add better error messages in `supabase/functions/chat-coach/index.ts`
   - Handle missing API key gracefully
   - Add retry logic for rate limits

---

### Phase 2: Complete Missing Core Features (Priority: HIGH)

#### Step 2.1: Implement Moodmeter Score Calculation
**File**: Create `src/lib/moodmeter.ts`

```typescript
export interface MoodmeterInput {
  weeklySurvey: {
    mood: string;
    wellbeing: string;
    health: string;
    productivity: string;
    risks: string;
  };
  recentMoods: Array<{ mood: string; date: string }>;
  checkInStreak: number;
}

export function calculateMoodmeterScore(input: MoodmeterInput): number {
  // Implementation:
  // 1. Analyze weekly survey responses (sentiment analysis)
  // 2. Calculate average mood from recent check-ins
  // 3. Factor in check-in consistency
  // 4. Consider risk indicators
  // 5. Return score 0-100
}
```

**Update**: `src/components/EnhancedChatInterface.tsx` line 196
- Replace random score with actual calculation
- Call `calculateMoodmeterScore()` with survey data

#### Step 2.2: Implement Nudges Generation
**File**: Create `supabase/functions/generate-nudges/index.ts`

```typescript
// Edge function to generate personalized nudges
// Analyze user data and create coaching messages
// Store in nudges table
```

**Schedule**: Set up Supabase cron job or scheduled function
- Run daily or weekly
- Analyze user patterns
- Generate personalized nudges

**UI Component**: Create `src/components/NudgesList.tsx`
- Display unread nudges
- Mark as read functionality
- Link to relevant actions

#### Step 2.3: Implement Goals Management
**Files**:
- Create `src/pages/Goals.tsx` - Goals management page
- Create `src/components/GoalsList.tsx` - Display goals
- Create `src/components/GoalForm.tsx` - Create/edit goals

**API Integration**:
- Use existing `goals` table
- Implement CRUD operations via Supabase client
- Add progress tracking UI

---

### Phase 3: Voice Features (Priority: MEDIUM)

#### Step 3.1: Implement Voice Recording for Weekly Survey
**File**: Update `src/components/WeeklySurvey.tsx`

**Implementation**:
```typescript
// Use Web Speech API (browser-native)
const recognition = new (window as any).webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event: any) => {
  const transcript = event.results[0][0].transcript;
  setVoiceInput(transcript);
};
```

**Alternative**: Use third-party service (Deepgram, AssemblyAI)
- More accurate transcription
- Better language support
- Requires API key and cost

#### Step 3.2: Implement Voice Call Feature
**File**: Update `src/pages/Coach.tsx`

**Implementation Options**:

**Option A: Web Speech API (Simple)**
- Use browser's built-in speech recognition
- Text-to-speech for AI responses
- No external API needed
- Limited accuracy

**Option B: Third-party Service (Recommended)**
- **Deepgram** for real-time transcription
- **ElevenLabs** for text-to-speech
- Better accuracy and features
- Requires API keys and subscription

**Implementation Steps**:
1. Set up voice recording
2. Stream audio to transcription service
3. Send transcribed text to chat-coach API
4. Convert AI response to speech
5. Play audio response

---

### Phase 4: Admin Features Enhancement (Priority: MEDIUM)

#### Step 4.1: Implement Admin Chat AI
**File**: Update `src/pages/AdminChat.tsx`

**Options**:
1. **Reuse chat-coach function** with admin context
2. **Create admin-specific function** (`supabase/functions/admin-coach/index.ts`)

**Recommended**: Create separate function with admin-focused prompts

**Implementation**:
```typescript
// In admin-coach edge function
const systemPrompt = `You are MindPulse Admin Assistant. Help managers:
1. Understand team wellbeing trends
2. Identify at-risk employees
3. Provide management coaching
4. Suggest team interventions`;
```

#### Step 4.2: Enhanced Admin Dashboard
**File**: Update `src/pages/AdminDashboard.tsx`

**Add Features**:
- Team mood trends visualization
- Risk alerts for low moodmeter scores
- Team comparison charts
- Export functionality

---

### Phase 5: Advanced Features (Priority: LOW)

#### Step 5.1: Real-time Updates
- Implement Supabase Realtime subscriptions
- Live chat updates
- Real-time mood tracking

#### Step 5.2: Analytics & Reporting
- Create analytics dashboard
- Generate reports
- Export data functionality

#### Step 5.3: Notifications
- Email notifications for nudges
- Push notifications (if mobile app)
- Weekly survey reminders

---

## 5. API Endpoints Summary

### Supabase Database APIs (Auto-generated)
| Table | Operations | Status |
|-------|-----------|--------|
| `profiles` | SELECT, UPDATE | ✅ |
| `chat_messages` | SELECT, INSERT | ✅ |
| `check_ins` | SELECT, INSERT | ✅ |
| `weekly_surveys` | SELECT, INSERT | ✅ |
| `admin_weekly_surveys` | SELECT, INSERT | ✅ |
| `goals` | SELECT, INSERT, UPDATE | ⚠️ (needs UI) |
| `nudges` | SELECT, UPDATE | ⚠️ (needs generation) |

### Supabase Edge Functions
| Function | Endpoint | Status | Required Config |
|----------|----------|--------|----------------|
| `chat-coach` | `/functions/v1/chat-coach` | ⚠️ | `LOVABLE_API_KEY` |
| `generate-nudges` | `/functions/v1/generate-nudges` | ❌ | To be created |
| `admin-coach` | `/functions/v1/admin-coach` | ❌ | To be created |

### External APIs
| Service | Purpose | Status | Required |
|---------|---------|--------|----------|
| Lovable AI Gateway | AI chat responses | ⚠️ | API Key |
| Web Speech API | Voice transcription | ❌ | None (browser) |
| Deepgram (optional) | Better transcription | ❌ | API Key |
| ElevenLabs (optional) | Text-to-speech | ❌ | API Key |

---

## 6. Testing Checklist

### Phase 1 Testing
- [ ] Supabase connection works
- [ ] Authentication (sign up, sign in) works
- [ ] Role-based routing works
- [ ] Database queries return data
- [ ] Edge function `chat-coach` responds correctly
- [ ] AI chat messages are generated

### Phase 2 Testing
- [ ] Moodmeter score calculates correctly
- [ ] Nudges are generated and displayed
- [ ] Goals can be created/updated
- [ ] Weekly survey saves all data

### Phase 3 Testing
- [ ] Voice recording works
- [ ] Transcription is accurate
- [ ] Voice call feature functions
- [ ] Text-to-speech plays correctly

### Phase 4 Testing
- [ ] Admin chat has AI responses
- [ ] Admin dashboard shows team data
- [ ] Admin weekly survey works

---

## 7. Security Considerations

### Current Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ User can only access their own data
- ✅ Authentication required for all routes

### Recommendations
1. **API Key Security**
   - Never expose `LOVABLE_API_KEY` in frontend
   - Store only in Supabase Edge Function secrets
   - Use environment variables properly

2. **Rate Limiting**
   - Implement rate limiting on edge functions
   - Prevent abuse of AI API
   - Add request throttling

3. **Input Validation**
   - Validate all user inputs
   - Sanitize chat messages
   - Prevent SQL injection (Supabase handles this)

4. **Admin Access Control**
   - Verify admin role before allowing access
   - Use Supabase RLS policies for admin tables
   - Audit admin actions

---

## 8. Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Edge functions deployed
- [ ] API keys set in Supabase secrets
- [ ] Error handling implemented
- [ ] Loading states added

### Deployment Steps
1. **Build Frontend**
   ```bash
   npm run build
   ```

2. **Deploy to Hosting**
   - Vercel, Netlify, or similar
   - Set environment variables in hosting platform
   - Deploy build folder

3. **Verify Supabase**
   - Test all edge functions
   - Verify database connections
   - Check RLS policies

4. **Post-Deployment Testing**
   - Test authentication flow
   - Test chat functionality
   - Test all user roles
   - Monitor error logs

---

## 9. Troubleshooting Guide

### Common Issues

#### Issue: "LOVABLE_API_KEY is not configured"
**Solution**: 
- Go to Supabase Dashboard > Edge Functions > chat-coach
- Add secret `LOVABLE_API_KEY` with your API key
- Redeploy function if needed

#### Issue: "Failed to get response" in chat
**Solution**:
- Check edge function logs in Supabase Dashboard
- Verify API key is correct
- Check rate limits on Lovable API
- Verify network connectivity

#### Issue: Database queries return empty
**Solution**:
- Verify RLS policies allow user access
- Check user is authenticated
- Verify table names match exactly
- Check Supabase project connection

#### Issue: Environment variables not loading
**Solution**:
- Ensure `.env` file is in root directory
- Variables must start with `VITE_`
- Restart dev server after adding variables
- Check for typos in variable names

---

## 10. Next Steps for Architect

### Immediate Actions (Week 1)
1. ✅ Set up Supabase project and configure environment variables
2. ✅ Deploy and configure `chat-coach` edge function
3. ✅ Test all existing database operations
4. ✅ Verify authentication flow works end-to-end

### Short-term (Weeks 2-3)
1. Implement moodmeter score calculation
2. Create nudges generation system
3. Build goals management UI
4. Enhance error handling

### Medium-term (Weeks 4-6)
1. Implement voice features
2. Enhance admin chat with AI
3. Add analytics and reporting
4. Improve UI/UX based on testing

### Long-term (Weeks 7+)
1. Add real-time features
2. Implement notifications
3. Mobile app considerations
4. Advanced analytics

---

## 11. Resources & Documentation

### Supabase
- [Supabase Documentation](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Lovable AI
- [Lovable AI Gateway](https://docs.lovable.dev)
- API documentation for chat completions

### Web APIs
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

### React & TypeScript
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 12. Contact & Support

For questions or issues during implementation:
1. Check Supabase Dashboard logs
2. Review browser console for frontend errors
3. Check edge function logs in Supabase
4. Review this document for troubleshooting

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Prepared For**: Architect/Development Team  
**Status**: Ready for Implementation

