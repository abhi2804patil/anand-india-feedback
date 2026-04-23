export function Field({ label, children, hint, error, required }) {
  return (
    <label className="block">
      {label && (
        <span className="label">
          {label}
          {required && <span className="text-gold-500 ml-0.5">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="block text-xs opacity-60 mt-1">{hint}</span>}
      {error && <span className="block text-xs text-red-500 mt-1">{error}</span>}
    </label>
  );
}

export function RadioGroup({ name, options, value, onChange, columns = 'grid-cols-2 sm:grid-cols-4' }) {
  return (
    <div className={`grid gap-2 ${columns}`}>
      {options.map((opt) => {
        const v = typeof opt === 'string' ? opt : opt.value;
        const l = typeof opt === 'string' ? opt : opt.label;
        const active = value === v;
        return (
          <button
            type="button"
            key={v}
            onClick={() => onChange(v)}
            className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition
              ${active
                ? 'bg-navy-900 border-navy-900 text-white shadow-card dark:bg-gold-500 dark:text-navy-900 dark:border-gold-500'
                : 'border-navy-100 hover:border-gold-500 dark:border-navy-500'}`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

export function CheckboxGroup({ options, value = [], onChange }) {
  const toggle = (v) => {
    const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
    onChange(next);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            type="button"
            key={opt}
            onClick={() => toggle(opt)}
            className={`chip ${active ? 'chip-active' : ''}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
