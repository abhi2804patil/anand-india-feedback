import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const GROUPS = [
  { title: 'Overall', fields: [['satisfactionScore', 'Satisfaction'], ['wouldRecommend', 'Would Recommend'], ['recommendReason', 'Reason']] },
  { title: 'Space & Infra', fields: [['officeSize', 'Office size'], ['furnitureComfort', 'Furniture'], ['infraIssues', 'Issues'], ['improvementSuggestion', 'Suggestion']] },
  { title: 'Maintenance', fields: [['commonAreaCleanliness', 'Cleanliness'], ['maintenanceSpeed', 'Resolution speed'], ['recurringProblems', 'Recurring problems']] },
  { title: 'Facilities', fields: [['internetQuality', 'Internet'], ['powerBackup', 'Power'], ['washroom', 'Washroom'], ['pantry', 'Pantry']] },
  { title: 'Noise', fields: [['noiseDisturbance', 'Disturbance'], ['noiseSources', 'Sources']] },
  { title: 'Safety', fields: [['antiSocialBehavior', 'Anti-social behavior'], ['antiSocialDetails', 'Details'], ['comfortableAllHours', 'Comfortable 24/7']] },
  { title: 'Location', fields: [['locationRating', 'Location'], ['locationChallenges', 'Challenges']] },
  { title: 'Staff', fields: [['staffBehavior', 'Behavior'], ['staffFeedback', 'Feedback']] },
  { title: 'Rent', fields: [['rentJustified', 'Justified'], ['rentVsMarket', 'Vs market'], ['justifyHigherRent', 'Justify higher']] },
  { title: 'Management', fields: [['managementResponsiveness', 'Responsiveness'], ['communicationClarity', 'Communication'], ['managementSuggestions', 'Suggestions']] },
  { title: 'Future', fields: [['continuePlan', 'Continue'], ['futureSpaceSize', 'Future size'], ['additionalServices', 'Additional services']] },
  { title: 'Open', fields: [['likeMost', 'Like'], ['dislikeMost', 'Dislike'], ['ownerChange', 'Owner change']] },
  { title: 'Upgrade', fields: [['upgradeWillingness', 'Willingness']] },
];

function fmt(v) {
  if (Array.isArray(v)) return v.join(', ') || '—';
  if (v === null || v === undefined || v === '') return '—';
  return String(v);
}

export default function ResponseModal({ open, onClose, data }) {
  return (
    <AnimatePresence>
      {open && data && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-navy-700 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="gradient-header text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <div>
                <div className="text-xs opacity-70">Submission {data.submissionId}</div>
                <div className="font-semibold">{data.companyName}</div>
                <div className="text-xs opacity-80">
                  {data.tenantName} • {data.email} • {new Date(data.date).toLocaleString()}
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-6">
              {GROUPS.map((g) => (
                <div key={g.title}>
                  <div className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-2">{g.title}</div>
                  <dl className="space-y-1.5 text-sm">
                    {g.fields.map(([k, label]) => (
                      <div key={k} className="grid grid-cols-[110px_1fr] gap-2">
                        <dt className="opacity-60">{label}</dt>
                        <dd className="font-medium break-words">{fmt(data[k])}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
