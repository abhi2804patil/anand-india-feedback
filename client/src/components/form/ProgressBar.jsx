import { SECTION_TITLES } from './sections.jsx';

export default function ProgressBar({ step, total }) {
  const pct = Math.round(((step + 1) / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs opacity-70 mb-2">
        <span>Section {step + 1} of {total}</span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-2 w-full rounded-full bg-navy-100 dark:bg-navy-500 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 text-sm font-medium">{SECTION_TITLES[step]}</div>
    </div>
  );
}
