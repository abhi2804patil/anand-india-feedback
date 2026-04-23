import { z } from 'zod';

const rating = z.enum(['Excellent', 'Good', 'Average', 'Poor']);
const ratingNA = z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable']);

export const feedbackSchema = z.object({
  date: z.string().optional(),
  companyName: z.string().min(1, 'Company name is required'),
  tenantName: z.string().optional(),
  phone: z.string().optional(),

  satisfactionScore: z.number().min(1).max(10),
  wouldRecommend: z.enum(['Yes', 'No']),
  recommendReason: z.string().optional(),

  officeSize: rating.optional(),
  furnitureComfort: rating.optional(),
  infraIssues: z.string().optional(),
  improvementSuggestion: z.string().optional(),

  commonAreaCleanliness: rating.optional(),
  maintenanceSpeed: z.enum(['Very Fast', 'Acceptable', 'Slow']).optional(),
  recurringProblems: z.string().optional(),

  internetQuality: ratingNA.optional(),
  powerBackup: rating.optional(),
  washroom: rating.optional(),
  pantry: rating.optional(),

  noiseDisturbance: z.enum(['Never', 'Sometimes', 'Frequently']).optional(),
  noiseSources: z.array(z.string()).optional(),
  noiseSourceOther: z.string().optional(),

  antiSocialBehavior: z.enum(['Yes', 'No']).optional(),
  antiSocialDetails: z.string().optional(),
  comfortableAllHours: z.enum(['Yes', 'No']).optional(),

  locationRating: rating.optional(),
  locationChallenges: z.array(z.string()).optional(),
  locationChallengeOther: z.string().optional(),

  staffBehavior: rating.optional(),
  staffFeedback: z.string().optional(),

  rentJustified: z.enum(['Yes', 'No']).optional(),
  rentVsMarket: z.enum(['High', 'Fair', 'Low']).optional(),
  justifyHigherRent: z.string().optional(),

  managementResponsiveness: rating.optional(),
  communicationClarity: rating.optional(),
  managementSuggestions: z.string().optional(),

  continuePlan: z.enum(['Yes', 'No', 'Not Sure']).optional(),
  futureSpaceSize: z.enum(['Bigger', 'Same', 'Smaller']).optional(),
  additionalServices: z.array(z.string()).optional(),
  additionalServicesOther: z.string().optional(),

  likeMost: z.string().optional(),
  dislikeMost: z.string().optional(),
  ownerChange: z.string().optional(),

  upgradeWillingness: z.enum(['Yes', 'Maybe', 'No']).optional(),
});

export const defaultValues = {
  date: new Date().toISOString().slice(0, 10),
  companyName: '',
  tenantName: '',
  phone: '',
  satisfactionScore: 7,
  wouldRecommend: 'Yes',
  recommendReason: '',
  noiseSources: [],
  locationChallenges: [],
  additionalServices: [],
};

export const RATINGS = ['Excellent', 'Good', 'Average', 'Poor'];
export const RATINGS_NA = [...RATINGS, 'Not Applicable'];
