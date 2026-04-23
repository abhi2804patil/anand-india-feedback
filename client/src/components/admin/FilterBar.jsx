import { Download, X, Filter } from 'lucide-react';
import { api } from '../../lib/api.js';

export default function FilterBar({ filters, setFilters, companies, activeFilters, clearCross }) {
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));

  function exportCsv() {
    const url = api.exportCsvUrl(filters);
    const token = localStorage.getItem('aibh_token');
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'feedback.csv';
        link.click();
      });
  }

  return (
    <div className="sticky top-0 z-10 bg-offwhite/90 dark:bg-navy-900/90 backdrop-blur border-b border-navy-100 dark:border-navy-500 px-4 lg:px-6 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="opacity-60" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        <input
          type="date"
          className="input !w-auto !py-2 text-sm"
          value={filters.from || ''}
          onChange={(e) => update({ from: e.target.value })}
        />
        <span className="opacity-60 text-sm">to</span>
        <input
          type="date"
          className="input !w-auto !py-2 text-sm"
          value={filters.to || ''}
          onChange={(e) => update({ to: e.target.value })}
        />
        <select
          className="select !w-auto !py-2 text-sm"
          value={filters.company || ''}
          onChange={(e) => update({ company: e.target.value })}
        >
          <option value="">All companies</option>
          {companies.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {activeFilters.length > 0 && (
          <button onClick={clearCross} className="chip chip-active">
            <X size={14} /> Clear {activeFilters.length} chart filter{activeFilters.length > 1 ? 's' : ''}
          </button>
        )}
        <div className="ml-auto flex gap-2">
          <button onClick={exportCsv} className="btn-ghost text-sm !py-2">
            <Download size={16} /> CSV
          </button>
          <button onClick={() => window.print()} className="btn-ghost text-sm !py-2">
            <Download size={16} /> PDF
          </button>
        </div>
      </div>
    </div>
  );
}
