import { Building2 } from 'lucide-react';

export function Brand({ compact = false, light = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 text-navy-900 shadow-card">
        <Building2 size={22} strokeWidth={2.2} />
      </div>
      <div className={light ? 'text-white' : ''}>
        <div className="text-sm font-bold tracking-wide leading-none">
          ANAND INDIA <span className="text-gold-500">BUSINESS HUB</span>
        </div>
        {!compact && (
          <div className="text-xs opacity-70 mt-1">Your Growth. Our Space.</div>
        )}
      </div>
    </div>
  );
}
