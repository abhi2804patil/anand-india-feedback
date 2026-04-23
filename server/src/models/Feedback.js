import mongoose from 'mongoose';

const RATING_SCALE = ['Excellent', 'Good', 'Average', 'Poor'];
const RATING_SCALE_NA = [...RATING_SCALE, 'Not Applicable'];

const FeedbackSchema = new mongoose.Schema(
  {
    submissionId: { type: String, required: true, unique: true, index: true },
    date: { type: Date, default: Date.now },

    companyName: { type: String, required: true, trim: true },
    tenantName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },

    // 1. Overall
    satisfactionScore: { type: Number, min: 1, max: 10, required: true },
    wouldRecommend: { type: String, enum: ['Yes', 'No'], required: true },
    recommendReason: String,

    // 2. Space & Infrastructure
    officeSize: { type: String, enum: RATING_SCALE },
    furnitureComfort: { type: String, enum: RATING_SCALE },
    infraIssues: String,
    improvementSuggestion: String,

    // 3. Maintenance & Cleanliness
    commonAreaCleanliness: { type: String, enum: RATING_SCALE },
    maintenanceSpeed: { type: String, enum: ['Very Fast', 'Acceptable', 'Slow'] },
    recurringProblems: String,

    // 4. Facilities & Utilities
    internetQuality: { type: String, enum: RATING_SCALE_NA },
    powerBackup: { type: String, enum: RATING_SCALE },
    washroom: { type: String, enum: RATING_SCALE },
    pantry: { type: String, enum: RATING_SCALE },

    // 5. Noise & Environment
    noiseDisturbance: { type: String, enum: ['Never', 'Sometimes', 'Frequently'] },
    noiseSources: [String],
    noiseSourceOther: String,

    // 6. Safety & Behavior
    antiSocialBehavior: { type: String, enum: ['Yes', 'No'] },
    antiSocialDetails: String,
    comfortableAllHours: { type: String, enum: ['Yes', 'No'] },

    // 7. Location
    locationRating: { type: String, enum: RATING_SCALE },
    locationChallenges: [String],
    locationChallengeOther: String,

    // 8. Staff
    staffBehavior: { type: String, enum: RATING_SCALE },
    staffFeedback: String,

    // 9. Rent & Value
    rentJustified: { type: String, enum: ['Yes', 'No'] },
    rentVsMarket: { type: String, enum: ['High', 'Fair', 'Low'] },
    justifyHigherRent: String,

    // 10. Management & Support
    managementResponsiveness: { type: String, enum: RATING_SCALE },
    communicationClarity: { type: String, enum: RATING_SCALE },
    managementSuggestions: String,

    // 11. Future Needs
    continuePlan: { type: String, enum: ['Yes', 'No', 'Not Sure'] },
    futureSpaceSize: { type: String, enum: ['Bigger', 'Same', 'Smaller'] },
    additionalServices: [String],
    additionalServicesOther: String,

    // 12. Open feedback
    likeMost: String,
    dislikeMost: String,
    ownerChange: String,

    // 13. Upgrade interest
    upgradeWillingness: { type: String, enum: ['Yes', 'Maybe', 'No'] },

    status: { type: String, enum: ['new', 'reviewed', 'archived'], default: 'new' },
  },
  { timestamps: true }
);

export const FeedbackModel = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
export { RATING_SCALE, RATING_SCALE_NA };
