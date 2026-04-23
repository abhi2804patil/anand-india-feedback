// Pure reducers for dashboard aggregates. Keeps charts simple.
export const COLORS = {
  navy: '#0A2540',
  navy2: '#12355b',
  gold: '#C9A227',
  goldLight: '#e2c760',
  green: '#2f9e75',
  red: '#c94e4e',
  grey: '#94a3b8',
};

export const CHART_PALETTE = ['#0A2540', '#C9A227', '#12355b', '#e2c760', '#1e3a5f', '#8c6f15'];

export function kpis(rows) {
  const total = rows.length;
  const avgSat = total ? rows.reduce((a, r) => a + (Number(r.satisfactionScore) || 0), 0) / total : 0;
  const yes = rows.filter((r) => r.wouldRecommend === 'Yes').length;
  const retention = rows.filter((r) => r.continuePlan === 'Yes').length;
  return {
    total,
    avgSatisfaction: Number(avgSat.toFixed(2)),
    recommendationRate: total ? Math.round((yes / total) * 100) : 0,
    retentionIntent: total ? Math.round((retention / total) * 100) : 0,
  };
}

export function satisfactionTrend(rows) {
  const buckets = new Map();
  for (const r of rows) {
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!buckets.has(key)) buckets.set(key, { sum: 0, n: 0 });
    const b = buckets.get(key);
    b.sum += Number(r.satisfactionScore) || 0;
    b.n += 1;
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, { sum, n }]) => ({ month: k, score: Number((sum / n).toFixed(2)) }));
}

export function recommendSplit(rows) {
  const yes = rows.filter((r) => r.wouldRecommend === 'Yes').length;
  const no = rows.filter((r) => r.wouldRecommend === 'No').length;
  return [
    { name: 'Yes', value: yes },
    { name: 'No', value: no },
  ];
}

const RATINGS = ['Excellent', 'Good', 'Average', 'Poor'];

export function facilitiesHeatmap(rows) {
  const fields = [
    ['internetQuality', 'Internet'],
    ['powerBackup', 'Power'],
    ['washroom', 'Washroom'],
    ['pantry', 'Pantry'],
  ];
  return fields.map(([key, label]) => {
    const row = { facility: label };
    for (const r of RATINGS) row[r] = 0;
    rows.forEach((x) => {
      const v = x[key];
      if (RATINGS.includes(v)) row[v] = (row[v] || 0) + 1;
    });
    return row;
  });
}

export function maintenanceSpeed(rows) {
  const keys = ['Very Fast', 'Acceptable', 'Slow'];
  return keys.map((k) => ({ name: k, value: rows.filter((r) => r.maintenanceSpeed === k).length }));
}

export function noiseSourcesBreakdown(rows) {
  const levels = ['Never', 'Sometimes', 'Frequently'];
  const sources = ['Traffic', 'Nearby shops', 'Construction', 'Other'];
  return sources.map((src) => {
    const o = { source: src };
    for (const lvl of levels) o[lvl] = 0;
    rows.forEach((r) => {
      const has = Array.isArray(r.noiseSources) && r.noiseSources.includes(src);
      if (has && r.noiseDisturbance) o[r.noiseDisturbance] = (o[r.noiseDisturbance] || 0) + 1;
    });
    return o;
  });
}

export function rentPerception(rows) {
  return ['High', 'Fair', 'Low'].map((k) => ({
    name: k,
    value: rows.filter((r) => r.rentVsMarket === k).length,
  }));
}

export function futureSpace(rows) {
  return ['Bigger', 'Same', 'Smaller'].map((k) => ({
    name: k,
    value: rows.filter((r) => r.futureSpaceSize === k).length,
  }));
}

export function additionalServicesRank(rows) {
  const counts = {};
  rows.forEach((r) => {
    (r.additionalServices || []).forEach((s) => {
      counts[s] = (counts[s] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function upgradeWillingness(rows) {
  return ['Yes', 'Maybe', 'No'].map((k) => ({
    name: k,
    value: rows.filter((r) => r.upgradeWillingness === k).length,
  }));
}

export function locationChallenges(rows) {
  const keys = ['Parking', 'Accessibility', 'Visibility'];
  return keys.map((k) => ({
    name: k,
    value: rows.filter((r) => (r.locationChallenges || []).includes(k)).length,
  }));
}

export function wordCloudData(rows) {
  const text = rows.flatMap((r) => [r.likeMost, r.dislikeMost]).filter(Boolean).join(' ');
  const stop = new Set([
    'the','a','an','and','or','but','of','to','in','is','it','for','on','with','this','that',
    'we','our','are','was','were','be','as','at','by','from','have','has','had','not','no',
    'i','they','them','their','there','very','too','too','more','some','all','any','just','my',
    'us','you','your','about','also','its',
  ]);
  const freq = new Map();
  text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && w.length > 2 && !stop.has(w))
    .forEach((w) => freq.set(w, (freq.get(w) || 0) + 1));
  return [...freq.entries()]
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 40);
}

export function safetyIncidents(rows) {
  return rows.filter((r) => r.antiSocialBehavior === 'Yes');
}

export function uniqueCompanies(rows) {
  return [...new Set(rows.map((r) => r.companyName).filter(Boolean))].sort();
}
