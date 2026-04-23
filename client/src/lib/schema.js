import { z } from 'zod';

const rating = z.enum(['Excellent', 'Good', 'Average', 'Poor'], {
  required_error: 'Please choose one',
  invalid_type_error: 'Please choose one',
});
const ratingNA = z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'], {
  required_error: 'Please choose one',
  invalid_type_error: 'Please choose one',
});
const choose = (opts) => z.enum(opts, {
  required_error: 'Please choose one',
  invalid_type_error: 'Please choose one',
});
const pickMany = z.array(z.string()).min(1, 'Select at least one option');

export const feedbackSchema = z.object({
  date: z.string().optional(),
  companyName: z.string().min(1, 'Company name is required'),
  tenantName: z.string().optional(),
  phone: z.string().optional(),

  satisfactionScore: z.number().min(1).max(10),
  wouldRecommend: choose(['Yes', 'No']),
  recommendReason: z.string().optional(),

  officeSize: rating,
  furnitureComfort: rating,
  infraIssues: z.string().optional(),
  improvementSuggestion: z.string().optional(),

  commonAreaCleanliness: rating,
  maintenanceSpeed: choose(['Very Fast', 'Acceptable', 'Slow']),
  recurringProblems: z.string().optional(),

  internetQuality: ratingNA,
  powerBackup: rating,
  washroom: rating,
  pantry: rating,

  noiseDisturbance: choose(['Never', 'Sometimes', 'Frequently']),
  noiseSources: pickMany,
  noiseSourceOther: z.string().optional(),

  antiSocialBehavior: choose(['Yes', 'No']),
  antiSocialDetails: z.string().optional(),
  comfortableAllHours: choose(['Yes', 'No']),

  locationRating: rating,
  locationChallenges: pickMany,
  locationChallengeOther: z.string().optional(),

  staffBehavior: rating,
  staffFeedback: z.string().optional(),

  rentJustified: choose(['Yes', 'No']),
  rentVsMarket: choose(['High', 'Fair', 'Low']),
  justifyHigherRent: z.string().optional(),

  managementResponsiveness: rating,
  communicationClarity: rating,
  managementSuggestions: z.string().optional(),

  continuePlan: choose(['Yes', 'No', 'Not Sure']),
  futureSpaceSize: choose(['Bigger', 'Same', 'Smaller']),
  additionalServices: pickMany,
  additionalServicesOther: z.string().optional(),

  likeMost: z.string().optional(),
  dislikeMost: z.string().optional(),
  ownerChange: z.string().optional(),

  upgradeWillingness: choose(['Yes', 'Maybe', 'No']),
});

export const defaultValues = {
  date: new Date().toISOString().slice(0, 10),
  companyName: '',
  tenantName: '',
  phone: '',
  satisfactionScore: 7,
  recommendReason: '',
  noiseSources: [],
  locationChallenges: [],
  additionalServices: [],
};

export const RATINGS = ['Excellent', 'Good', 'Average', 'Poor'];
export const RATINGS_NA = [...RATINGS, 'Not Applicable'];
