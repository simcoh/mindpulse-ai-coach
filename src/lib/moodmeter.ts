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

/**
 * Calculates a moodmeter score (0-100) based on user data
 * Higher scores indicate better wellbeing
 */
export function calculateMoodmeterScore(input: MoodmeterInput): number {
  let score = 50; // Base score

  // 1. Analyze weekly survey responses (40% weight)
  const surveyScore = analyzeSurveyResponses(input.weeklySurvey);
  score += surveyScore * 0.4;

  // 2. Calculate average mood from recent check-ins (30% weight)
  const moodScore = calculateMoodAverage(input.recentMoods);
  score += moodScore * 0.3;

  // 3. Factor in check-in consistency (20% weight)
  const consistencyScore = calculateConsistencyScore(input.checkInStreak);
  score += consistencyScore * 0.2;

  // 4. Consider risk indicators (10% weight, negative impact)
  const riskScore = analyzeRiskIndicators(input.weeklySurvey.risks);
  score -= riskScore * 0.1;

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Analyzes survey text responses for sentiment
 * Returns a score from -25 to +25
 */
function analyzeSurveyResponses(survey: MoodmeterInput['weeklySurvey']): number {
  let sentimentScore = 0;

  // Simple keyword-based sentiment analysis
  const positiveKeywords = ['good', 'great', 'excellent', 'happy', 'energetic', 'productive', 'well', 'positive', 'optimistic', 'confident'];
  const negativeKeywords = ['bad', 'poor', 'tired', 'stressed', 'anxious', 'overwhelmed', 'difficult', 'struggling', 'worried', 'exhausted'];

  const allText = `${survey.mood} ${survey.wellbeing} ${survey.health} ${survey.productivity}`.toLowerCase();

  // Count positive and negative keywords
  const positiveCount = positiveKeywords.filter(keyword => allText.includes(keyword)).length;
  const negativeCount = negativeKeywords.filter(keyword => allText.includes(keyword)).length;

  // Calculate sentiment (positive adds, negative subtracts)
  sentimentScore = (positiveCount * 3) - (negativeCount * 3);

  // Text length bonus (more detailed responses suggest engagement)
  const textLength = allText.length;
  if (textLength > 100) sentimentScore += 5;
  if (textLength > 200) sentimentScore += 5;

  return Math.max(-25, Math.min(25, sentimentScore));
}

/**
 * Calculates average mood from recent check-ins
 * Returns a score from -25 to +25
 */
function calculateMoodAverage(recentMoods: Array<{ mood: string; date: string }>): number {
  if (recentMoods.length === 0) return 0;

  const moodValues: Record<string, number> = {
    very_sad: -20,
    sad: -10,
    neutral: 0,
    happy: 10,
    very_happy: 20,
  };

  const totalScore = recentMoods.reduce((sum, entry) => {
    return sum + (moodValues[entry.mood] || 0);
  }, 0);

  const averageScore = totalScore / recentMoods.length;

  // Bonus for consistency (all positive or improving trend)
  if (recentMoods.length >= 3) {
    const lastThree = recentMoods.slice(-3);
    const isImproving = lastThree.every((m, i) => {
      if (i === 0) return true;
      const prevValue = moodValues[lastThree[i - 1].mood] || 0;
      const currValue = moodValues[m.mood] || 0;
      return currValue >= prevValue;
    });
    if (isImproving) return averageScore + 5;
  }

  return Math.max(-25, Math.min(25, averageScore));
}

/**
 * Calculates consistency score based on check-in streak
 * Returns a score from 0 to +25
 */
function calculateConsistencyScore(checkInStreak: number): number {
  // More check-ins = better consistency
  if (checkInStreak >= 30) return 25;
  if (checkInStreak >= 14) return 20;
  if (checkInStreak >= 7) return 15;
  if (checkInStreak >= 3) return 10;
  if (checkInStreak >= 1) return 5;
  return 0;
}

/**
 * Analyzes risk indicators in survey responses
 * Returns a penalty score from 0 to -25
 */
function analyzeRiskIndicators(risks: string): number {
  if (!risks || risks.trim().length === 0) return 0;

  const riskKeywords = ['burnout', 'conflict', 'difficulty', 'struggling', 'overwhelmed', 'anxious', 'depressed', 'stress', 'exhausted', 'crisis'];
  const riskText = risks.toLowerCase();

  const riskCount = riskKeywords.filter(keyword => riskText.includes(keyword)).length;

  // Higher risk count = higher penalty
  if (riskCount >= 5) return -25;
  if (riskCount >= 3) return -15;
  if (riskCount >= 1) return -10;
  return 0;
}

