import { useMemo, useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';

export default function ResponseTable({ rows, onRowClick }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' });
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let r = rows;
    if (needle) {
      r = rows.filter((x) =>
        [x.companyName, x.tenantName, x.email, x.submissionId]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(needle))
      );
    }
    r = [...r].sort((a, b) => {
      const av = a[sort.key]; const bv = b[sort.key];
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = sort.key === 'date'
        ? new Date(av) - new Date(bv)
        : String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return r;
  }, [rows, q, sort]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const view = filtered.slice(page * pageSize, page * pageSize + pageSize);

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="font-semibold">All Responses</h3>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            className="input !py-2 !pl-9 text-sm !w-60"
            placeholder="Search company, tenant…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0); }}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wide opacity-60">
            <tr>
              {[
                ['date', 'Date'],
                ['companyName', 'Company'],
                ['tenantName', 'Tenant'],
                ['satisfactionScore', 'Score'],
                ['wouldRecommend', 'Recommend'],
                ['status', 'Status'],
              ].map(([key, label]) => (
                <th key={key} className="text-left py-2">
                  <button className="inline-flex items-center gap-1" onClick={() => toggleSort(key)}>
                    {label} <ArrowUpDown size={12} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr
                key={r.submissionId}
                onClick={() => onRowClick(r)}
                className="border-t border-navy-100 dark:border-navy-500 hover:bg-navy-50 dark:hover:bg-navy-500 cursor-pointer"
              >
                <td className="py-2 whitespace-nowrap">{new Date(r.date).toLocaleDateString()}</td>
                <td className="truncate max-w-[220px]">{r.companyName}</td>
                <td className="truncate max-w-[160px]">{r.tenantName}</td>
                <td>
                  <span className="inline-block rounded-full bg-gold-500/15 text-gold-700 dark:text-gold-300 px-2 py-0.5 text-xs font-semibold">
                    {r.satisfactionScore}/10
                  </span>
                </td>
                <td>
                  <span className={`chip ${r.wouldRecommend === 'Yes' ? 'chip-active' : ''}`}>
                    {r.wouldRecommend || '—'}
                  </span>
                </td>
                <td>
                  <span className="chip capitalize">{r.status || 'new'}</span>
                </td>
              </tr>
            ))}
            {view.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center opacity-60">No results.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 text-xs opacity-70">
        <span>Showing {view.length} of {total}</span>
        <div className="flex gap-1">
          <button className="btn-ghost !py-1 !px-3 text-xs" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span className="px-2 py-1">{page + 1} / {pages}</span>
          <button className="btn-ghost !py-1 !px-3 text-xs" disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}
