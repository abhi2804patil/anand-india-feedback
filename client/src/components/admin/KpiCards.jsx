import { motion } from 'framer-motion';
import { Users, Star, ThumbsUp, Repeat } from 'lucide-react';

export default function KpiCards({ stats }) {
  const cards = [
    { icon: Users, label: 'Total Responses', value: stats.total },
    { icon: Star, label: 'Avg. Satisfaction', value: `${stats.avgSatisfaction}/10` },
    { icon: ThumbsUp, label: 'Recommendation Rate', value: `${stats.recommendationRate}%` },
    { icon: Repeat, label: 'Retention Intent', value: `${stats.retentionIntent}%` },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs opacity-60 font-medium uppercase tracking-wide">{c.label}</div>
            <div className="h-9 w-9 rounded-xl bg-gold-500/15 text-gold-500 flex items-center justify-center">
              <c.icon size={18} />
            </div>
          </div>
          <div className="kpi-number mt-3">{c.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
