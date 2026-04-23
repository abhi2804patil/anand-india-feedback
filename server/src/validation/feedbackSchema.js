import { z } from 'zod';

const rating = z.enum(['Excellent', 'Good', 'Average', 'Poor']);
const ratingNA = z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable']);
const pickMany = z.array(z.string()).min(1);

export const feedbackSchema = z.object({
  date: z.string().optional(),
  companyName: z.string().min(1),
  tenantName: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),

  satisfactionScore: z.number().min(1).max(10),
  wouldRecommend: z.enum(['Yes', 'No']),
  recommendReason: z.string().optional(),

  officeSize: rating,
  furnitureComfort: rating,
  infraIssues: z.string().optional(),
  improvementSuggestion: z.string().optional(),

  commonAreaCleanliness: rating,
  maintenanceSpeed: z.enum(['Very Fast', 'Acceptable', 'Slow']),
  recurringProblems: z.string().optional(),

  internetQuality: ratingNA,
  powerBackup: rating,
  washroom: rating,
  pantry: rating,

  noiseDisturbance: z.enum(['Never', 'Sometimes', 'Frequently']),
  noiseSources: pickMany,
  noiseSourceOther: z.string().optional(),

  antiSocialBehavior: z.enum(['Yes', 'No']),
  antiSocialDetails: z.string().optional(),
  comfortableAllHours: z.enum(['Yes', 'No']),

  locationRating: rating,
  locationChallenges: pickMany,
  locationChallengeOther: z.string().optional(),

  staffBehavior: rating,
  staffFeedback: z.string().optional(),

  rentJustified: z.enum(['Yes', 'No']),
  rentVsMarket: z.enum(['High', 'Fair', 'Low']),
  justifyHigherRent: z.string().optional(),

  managementResponsiveness: rating,
  communicationClarity: rating,
  managementSuggestions: z.string().optional(),

  continuePlan: z.enum(['Yes', 'No', 'Not Sure']),
  futureSpaceSize: z.enum(['Bigger', 'Same', 'Smaller']),
  additionalServices: pickMany,
  additionalServicesOther: z.string().optional(),

  likeMost: z.string().optional(),
  dislikeMost: z.string().optional(),
  ownerChange: z.string().optional(),

  upgradeWillingness: z.enum(['Yes', 'Maybe', 'No']),
});
