import User from '../models/User';
import Swipe from '../models/Swipe';

interface CompatibilityScore {
  personality: number;
  communication: number;
  values: number;
  interests: number;
  lifestyle: number;
  overall: number;
}

export const generateRecommendations = async (
  userId: string,
  limit: number = 50
): Promise<any[]> => {
  const user = await User.findById(userId);
  if (!user) return [];

  // Get already swiped users
  const swipedUsers = await Swipe.find({ swiperId: userId }).distinct('swipedId');

  // Apply basic filters
  const candidates = await User.find({
    _id: { $nin: [...swipedUsers, userId] },
    isActive: true,
    'profile.age': {
      $gte: user.profile.preferences.ageRange[0],
      $lte: user.profile.preferences.ageRange[1],
    },
  }).limit(limit * 2); // Get more to filter

  // Calculate compatibility scores
  const scoredCandidates = await Promise.all(
    candidates.map(async (candidate) => {
      const score = await calculateCompatibility(user, candidate);
      return { candidate, score };
    })
  );

  // Sort by score and apply boosters
  const boosted = scoredCandidates
    .map(({ candidate, score }) => {
      let boostedScore = score.overall;

      // Premium boost
      if (candidate.subscription.tier !== 'free') {
        boostedScore *= 1.1;
      }

      // Recency boost
      const daysSinceActive = (Date.now() - candidate.lastActive.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceActive < 1) boostedScore *= 1.15;
      else if (daysSinceActive < 7) boostedScore *= 1.1;

      // Profile completeness
      const completeness = calculateCompleteness(candidate);
      boostedScore *= 1 + completeness * 0.1;

      // Voice intro boost
      if (candidate.profile.voiceIntro) {
        boostedScore *= 1.05;
      }

      return { candidate, score: { ...score, overall: boostedScore } };
    })
    .sort((a, b) => b.score.overall - a.score.overall);

  return boosted.slice(0, limit).map((item) => ({
    ...item.candidate.toObject(),
    soulDensityScore: item.score.overall,
  }));
};

const calculateCompatibility = async (
  user1: any,
  user2: any
): Promise<CompatibilityScore> => {
  // Personality similarity (Big Five)
  const personality = calculatePersonalitySimilarity(
    user1.profile.personalityProfile.bigFive,
    user2.profile.personalityProfile.bigFive
  );

  // Communication compatibility
  const communication = analyzeCommunicationCompatibility(
    user1.profile.personalityProfile.communicationStyle,
    user2.profile.personalityProfile.communicationStyle
  );

  // Shared values
  const values = calculateValuesOverlap(
    user1.profile.personalityProfile.values,
    user2.profile.personalityProfile.values
  );

  // Interest overlap
  const interests = calculateInterestOverlap(
    user1.profile.interests,
    user2.profile.interests
  );

  // Lifestyle match
  const lifestyle = calculateLifestyleMatch(user1.profile, user2.profile);

  // Weighted average
  const overall =
    personality * 0.3 +
    communication * 0.25 +
    values * 0.2 +
    interests * 0.15 +
    lifestyle * 0.1;

  return { personality, communication, values, interests, lifestyle, overall };
};

const calculatePersonalitySimilarity = (bigFive1: any, bigFive2: any): number => {
  const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
  let totalDiff = 0;

  traits.forEach((trait) => {
    totalDiff += Math.abs(bigFive1[trait] - bigFive2[trait]);
  });

  // Convert difference to similarity (0-100)
  const avgDiff = totalDiff / traits.length;
  return Math.max(0, 100 - avgDiff);
};

const analyzeCommunicationCompatibility = (style1: string, style2: string): number => {
  // Simplified compatibility logic
  if (style1 === style2) return 90;
  if (!style1 || !style2) return 50;
  return 70;
};

const calculateValuesOverlap = (values1: string[], values2: string[]): number => {
  if (values1.length === 0 || values2.length === 0) return 50;
  const intersection = values1.filter((v) => values2.includes(v));
  return (intersection.length / Math.max(values1.length, values2.length)) * 100;
};

const calculateInterestOverlap = (interests1: string[], interests2: string[]): number => {
  if (interests1.length === 0 || interests2.length === 0) return 0;
  const intersection = interests1.filter((i) => interests2.includes(i));
  return (intersection.length / Math.max(interests1.length, interests2.length)) * 100;
};

const calculateLifestyleMatch = (profile1: any, profile2: any): number => {
  // Simplified lifestyle matching
  const ageDiff = Math.abs(profile1.age - profile2.age);
  const ageScore = Math.max(0, 100 - ageDiff * 2);

  // Location proximity (simplified)
  const locationScore = 80; // Would calculate based on coordinates

  return (ageScore + locationScore) / 2;
};

const calculateCompleteness = (user: any): number => {
  let score = 0;
  const profile = user.profile;

  if (profile.photos.length > 0) score += 20;
  if (profile.bio) score += 15;
  if (profile.voiceIntro) score += 15;
  if (profile.interests.length > 0) score += 20;
  if (Object.values(profile.personalityProfile.bigFive).some((v) => v !== 50)) score += 30;

  return Math.min(100, score) / 100;
};

