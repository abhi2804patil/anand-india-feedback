import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/admin/Sidebar.jsx';
import FilterBar from '../components/admin/FilterBar.jsx';
import KpiCards from '../components/admin/KpiCards.jsx';
import ResponseTable from '../components/admin/ResponseTable.jsx';
import ResponseModal from '../components/admin/ResponseModal.jsx';
import {
  ChartCard, SatisfactionTrendChart, DonutChart, FacilitiesHeatmap,
  HorizontalBar, VerticalBar, StackedNoiseChart, UpgradeGauge, WordCloud, SafetyTable,
} from '../components/admin/Charts.jsx';
import {
  kpis, satisfactionTrend, recommendSplit, facilitiesHeatmap, maintenanceSpeed,
  noiseSourcesBreakdown, rentPerception, futureSpace, additionalServicesRank,
  upgradeWillingness, locationChallenges, wordCloudData, safetyIncidents, uniqueCompanies,
} from '../components/admin/analytics.js';
import { api } from '../lib/api.js';
import { Loader2 } from 'lucide-react';

function SkeletonCard() {
  return <div className="card"><div className="skeleton h-52 w-full" /></div>;
}

export default function Dashboard() {
  const [view, setView] = useState('overview');
  const [rawRows, setRawRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ from: '', to: '', company: '' });
  // Cross-filter state from chart clicks. Each chart sets its own key.
  const [cross, setCross] = useState({});
  const [modalRow, setModalRow] = useState(null);

  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    let on = true;
    setLoading(true);
    api.listResponses(filters)
      .then((d) => { if (on) setRawRows(Array.isArray(d) ? d : []); })
      .catch((e) => { console.error(e); if (on) setRawRows([]); })
      .finally(() => on && setLoading(false));
    return () => { on = false; };
  }, [filters, reloadKey]);

  // Apply cross-filters client-side.
  const rows = useMemo(() => {
    return rawRows.filter((r) => {
      if (cross.wouldRecommend && r.wouldRecommend !== cross.wouldRecommend) return false;
      if (cross.maintenanceSpeed && r.maintenanceSpeed !== cross.maintenanceSpeed) return false;
      if (cross.rentVsMarket && r.rentVsMarket !== cross.rentVsMarket) return false;
      if (cross.futureSpaceSize && r.futureSpaceSize !== cross.futureSpaceSize) return false;
      if (cross.upgradeWillingness && r.upgradeWillingness !== cross.upgradeWillingness) return false;
      if (cross.additionalServices && !(r.additionalServices || []).includes(cross.additionalServices)) return false;
      if (cross.locationChallenges && !(r.locationChallenges || []).includes(cross.locationChallenges)) return false;
      return true;
    });
  }, [rawRows, cross]);

  const stats = useMemo(() => kpis(rows), [rows]);
  const companies = useMemo(() => uniqueCompanies(rawRows), [rawRows]);

  const activeFilters = Object.entries(cross).filter(([, v]) => v);
  const clearCross = () => setCross({});
  const toggle = (key) => (val) => setCross((c) => ({ ...c, [key]: c[key] === val ? '' : val }));

  return (
    <div className="flex min-h-full">
      <Sidebar view={view} setView={setView} onCleared={() => setReloadKey((k) => k + 1)} />
      <div className="flex-1 min-w-0">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          companies={companies}
          activeFilters={activeFilters}
          clearCross={clearCross}
        />
        {loading ? (
          <div className="p-6 flex items-center gap-3 opacity-70">
            <Loader2 className="animate-spin" size={18} /> Loading dashboard…
          </div>
        ) : view === 'overview' ? (
          <Overview
            rows={rows}
            stats={stats}
            cross={cross}
            toggle={toggle}
            setModalRow={setModalRow}
          />
        ) : (
          <section className="p-4 lg:p-6">
            <ResponseTable rows={rows} onRowClick={setModalRow} />
          </section>
        )}
        <ResponseModal open={!!modalRow} data={modalRow} onClose={() => setModalRow(null)} />
      </div>
    </div>
  );
}

function Overview({ rows, stats, cross, toggle, setModalRow }) {
  return (
    <section className="p-4 lg:p-6 space-y-5">
      <KpiCards stats={stats} />

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Satisfaction Trend" className="lg:col-span-2">
          <SatisfactionTrendChart data={satisfactionTrend(rows)} />
        </ChartCard>
        <ChartCard
          title="Recommendation Split"
          activeFilter={cross.wouldRecommend}
          onClear={() => toggle('wouldRecommend')(cross.wouldRecommend)}
        >
          <DonutChart
            data={recommendSplit(rows)}
            activeValue={cross.wouldRecommend}
            onClick={toggle('wouldRecommend')}
          />
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Facilities Ratings" className="lg:col-span-2">
          <FacilitiesHeatmap data={facilitiesHeatmap(rows)} />
        </ChartCard>
        <ChartCard
          title="Maintenance Resolution Speed"
          activeFilter={cross.maintenanceSpeed}
          onClear={() => toggle('maintenanceSpeed')(cross.maintenanceSpeed)}
        >
          <HorizontalBar
            data={maintenanceSpeed(rows)}
            activeValue={cross.maintenanceSpeed}
            onClick={toggle('maintenanceSpeed')}
          />
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Noise Sources" className="lg:col-span-2">
          <StackedNoiseChart data={noiseSourcesBreakdown(rows)} />
        </ChartCard>
        <ChartCard
          title="Rent Perception"
          activeFilter={cross.rentVsMarket}
          onClear={() => toggle('rentVsMarket')(cross.rentVsMarket)}
        >
          <DonutChart
            data={rentPerception(rows)}
            activeValue={cross.rentVsMarket}
            onClick={toggle('rentVsMarket')}
            innerRadius={0}
          />
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard
          title="Future Space Needs"
          activeFilter={cross.futureSpaceSize}
          onClear={() => toggle('futureSpaceSize')(cross.futureSpaceSize)}
        >
          <VerticalBar
            data={futureSpace(rows)}
            activeValue={cross.futureSpaceSize}
            onClick={toggle('futureSpaceSize')}
          />
        </ChartCard>
        <ChartCard
          title="Requested Additional Services"
          className="lg:col-span-2"
          activeFilter={cross.additionalServices}
          onClear={() => toggle('additionalServices')(cross.additionalServices)}
        >
          <HorizontalBar
            data={additionalServicesRank(rows)}
            activeValue={cross.additionalServices}
            onClick={toggle('additionalServices')}
          />
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard
          title="Upgrade Willingness"
          activeFilter={cross.upgradeWillingness}
          onClear={() => toggle('upgradeWillingness')(cross.upgradeWillingness)}
        >
          <UpgradeGauge data={upgradeWillingness(rows)} />
        </ChartCard>
        <ChartCard
          title="Location Challenges"
          activeFilter={cross.locationChallenges}
          onClear={() => toggle('locationChallenges')(cross.locationChallenges)}
        >
          <VerticalBar
            data={locationChallenges(rows)}
            activeValue={cross.locationChallenges}
            onClick={toggle('locationChallenges')}
          />
        </ChartCard>
        <ChartCard title="Top Words (Likes / Dislikes)">
          <WordCloud data={wordCloudData(rows)} />
        </ChartCard>
      </div>

      <ChartCard title="Safety Incidents Log">
        <SafetyTable rows={safetyIncidents(rows)} onRowClick={setModalRow} />
      </ChartCard>

      <ResponseTable rows={rows} onRowClick={setModalRow} />
    </section>
  );
}
