import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import ChartCard from '../../components/common/ChartCard';
import StatCard from '../../components/common/StatCard';
import { MONTHLY_COLLECTION_DATA } from '../../data/mockData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecyclerReports() {
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
        <StatCard label="Monthly Processed Tonnes" value="28.4 t" trend="+14% MoM" colorScheme="forest" />
        <StatCard label="Average Recovery Efficiency" value="94.2%" trend="Exceeds Benchmark" colorScheme="terracotta" />
        <StatCard label="Hazardous Neutralization" value="100%" subtext="Zero effluent discharge" colorScheme="olive" />
      </div>

      <ChartCard
        title="Monthly Processed Throughput (Tonnes)"
        subtitle="Intake batch scale vs final processed mass fractions."
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={MONTHLY_COLLECTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
