import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, BarChart, Bar, RadialBarChart, RadialBar,
} from 'recharts';
import { motion } from 'framer-motion';
import { COLORS, CHART_PALETTE } from './analytics.js';

export function ChartCard({ title, children, onClear, activeFilter, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className={`card ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        {activeFilter && (
          <button onClick={onClear} className="chip chip-active">
            {activeFilter} ✕
          </button>
        )}
      </div>
      <div className="h-64">{children}</div>
    </motion.div>
  );
}

export function SatisfactionTrendChart({ data }) {
  return (
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -20 }}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke={COLORS.gold} strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data, onClick, activeValue, innerRadius = 55, outerRadius = 85 }) {
  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data} dataKey="value" nameKey="name" innerRadius={innerRadius} outerRadius={outerRadius}
          paddingAngle={2} onClick={(d) => onClick && onClick(d.name)}
        >
          {data.map((entry, i) => (
            <Cell
              key={entry.name}
              fill={CHART_PALETTE[i % CHART_PALETTE.length]}
              opacity={activeValue && activeValue !== entry.name ? 0.3 : 1}
              style={{ cursor: onClick ? 'pointer' : 'default' }}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function FacilitiesHeatmap({ data }) {
  const ratings = ['Excellent', 'Good', 'Average', 'Poor'];
  const max = Math.max(1, ...data.flatMap((row) => ratings.map((r) => row[r] || 0)));
  const colorFor = (v) => {
    const t = v / max;
    const alpha = 0.1 + t * 0.9;
    return `rgba(201,162,39,${alpha})`;
  };
  return (
    <div className="h-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left font-medium opacity-70 pb-2">Facility</th>
            {ratings.map((r) => (
              <th key={r} className="font-medium opacity-70 pb-2">{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.facility}>
              <td className="py-1.5 font-medium">{row.facility}</td>
              {ratings.map((r) => (
                <td key={r} className="p-1">
                  <div
                    className="h-10 rounded-lg flex items-center justify-center text-sm font-semibold text-navy-900"
                    style={{ background: colorFor(row[r] || 0) }}
                  >
                    {row[r] || 0}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function HorizontalBar({ data, onClick, activeValue }) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={110} />
        <Tooltip />
        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={CHART_PALETTE[i % CHART_PALETTE.length]}
              opacity={activeValue && activeValue !== entry.name ? 0.3 : 1}
              style={{ cursor: onClick ? 'pointer' : 'default' }}
              onClick={() => onClick && onClick(entry.name)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function VerticalBar({ data, onClick, activeValue }) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -20 }}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={CHART_PALETTE[i % CHART_PALETTE.length]}
              opacity={activeValue && activeValue !== entry.name ? 0.3 : 1}
              style={{ cursor: onClick ? 'pointer' : 'default' }}
              onClick={() => onClick && onClick(entry.name)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StackedNoiseChart({ data }) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -20 }}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="source" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Never" stackId="a" fill={COLORS.grey} />
        <Bar dataKey="Sometimes" stackId="a" fill={COLORS.goldLight} />
        <Bar dataKey="Frequently" stackId="a" fill={COLORS.gold} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function UpgradeGauge({ data }) {
  const total = data.reduce((a, r) => a + r.value, 0) || 1;
  const withPct = data.map((d) => ({ ...d, pct: Math.round((d.value / total) * 100), fill: COLORS.gold }));
  return (
    <ResponsiveContainer>
      <RadialBarChart
        innerRadius="30%" outerRadius="90%" data={withPct} startAngle={180} endAngle={-180}
      >
        <RadialBar dataKey="pct" cornerRadius={12}>
          {withPct.map((entry, i) => (
            <Cell key={entry.name} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
          ))}
        </RadialBar>
        <Legend iconSize={8} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 12 }} />
        <Tooltip />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

export function WordCloud({ data }) {
  if (!data.length) return <div className="h-full flex items-center justify-center text-sm opacity-60">Not enough text yet.</div>;
  const max = data[0].value;
  return (
    <div className="h-full overflow-hidden flex flex-wrap gap-x-3 gap-y-2 items-center justify-center content-center p-2">
      {data.map((w) => {
        const scale = 0.75 + (w.value / max) * 1.6;
        const isGold = w.value / max > 0.6;
        return (
          <span
            key={w.text}
            className={`font-semibold ${isGold ? 'text-gold-500' : 'text-navy-900 dark:text-offwhite'}`}
            style={{ fontSize: `${scale}rem`, opacity: 0.55 + (w.value / max) * 0.45 }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
}

export function SafetyTable({ rows, onRowClick }) {
  if (rows.length === 0) {
    return <div className="h-full flex items-center justify-center text-sm opacity-60">No safety incidents reported.</div>;
  }
  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-xs opacity-60 uppercase tracking-wide">
          <tr>
            <th className="text-left py-1.5">Date</th>
            <th className="text-left">Company</th>
            <th className="text-left">Tenant</th>
            <th className="text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.submissionId}
              className="border-t border-navy-100 dark:border-navy-500 hover:bg-navy-50 dark:hover:bg-navy-500 cursor-pointer"
              onClick={() => onRowClick && onRowClick(r)}
            >
              <td className="py-1.5 whitespace-nowrap">{new Date(r.date).toLocaleDateString()}</td>
              <td className="truncate max-w-[140px]">{r.companyName}</td>
              <td className="truncate max-w-[120px]">{r.tenantName}</td>
              <td className="truncate max-w-[200px] opacity-80">{r.antiSocialDetails || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
