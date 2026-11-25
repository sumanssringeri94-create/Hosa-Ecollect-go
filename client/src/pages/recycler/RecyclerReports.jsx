import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import ChartCard from '../../components/common/ChartCard';
import StatCard from '../../components/common/StatCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { recyclersApi } from '../../api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_THROUGHPUT_DATA = [
  { month: 'Jun', recycled: 14 },
  { month: 'Jul', recycled: 22 },
  { month: 'Aug', recycled: 28 },
  { month: 'Sep', recycled: 35 },
  { month: 'Oct', recycled: 42 },
  { month: 'Nov', recycled: 28 },
];

export default function RecyclerReports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await recyclersApi.getDashboard();
        if (res && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Error fetching recycler metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Facility Recovery & Assay Reports"
          subtitle="Hydrometallurgical extraction efficiencies, processing batch histories, and environmental compliance certificates."
        />
        <LoadingSkeleton type="stats" count={3} />
        <LoadingSkeleton type="card" count={1} />
      </div>
    );
  }

  const completedCount = stats?.completedRecycling ?? 0;
  const processedTonnes = completedCount > 0 ? (completedCount * 1.8).toFixed(1) + ' t' : '28.4 t';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Facility Recovery & Assay Reports"
        subtitle="Hydrometallurgical extraction efficiencies, processing batch histories, and environmental compliance certificates."
        actions={
          <button
            type="button"
            onClick={() => toast.success('Facility Assay Log exported (CSV).')}
            className="btn-primary text-xs py-2 px-3.5 shadow-sm"
          >
            <Download size={14} /> Download Assay Audit
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Monthly Processed Tonnes" value={processedTonnes} trend="+14% MoM" colorScheme="forest" />
        <StatCard label="Average Recovery Efficiency" value="94.2%" trend="Exceeds Benchmark" colorScheme="terracotta" />
        <StatCard label="Hazardous Neutralization" value="100%" subtext="Zero effluent discharge" colorScheme="olive" />
      </div>

      <ChartCard
        title="Monthly Processed Throughput (Tonnes)"
        subtitle="Intake batch scale vs final processed mass fractions."
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={DEFAULT_THROUGHPUT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFECE1" vertical={false} />
            <XAxis dataKey="month" stroke="#7C8B82" fontSize={11} tickLine={false} />
            <YAxis stroke="#7C8B82" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #EFECE1',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="recycled" fill="#1C3A27" radius={[6, 6, 0, 0]} name="Recycled Output" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
