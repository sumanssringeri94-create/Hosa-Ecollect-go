import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import ChartCard from '../../components/common/ChartCard';
import StatCard from '../../components/common/StatCard';
import {
  MONTHLY_COLLECTION_DATA,
  CATEGORY_DISTRIBUTION,
  SAMPLE_IMPACT_METRICS,
} from '../../data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, Calendar, Filter, Sparkles, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReports() {
  const [timeRange, setTimeRange] = useState('6M');

  const handleExportCSV = () => {
    toast.success('Generated environmental ESG compliance report (CSV).');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Environmental Analytics & Reports"
        subtitle="Statutory compliance metrics, material recovery efficiency, and carbon offset reporting."
        badge="Audit Ready"
        actions={
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input py-1.5 px-3 text-xs w-auto cursor-pointer"
            >
              <option value="1M">Past 30 Days</option>
              <option value="6M">Past 6 Months</option>
              <option value="1Y">Full Year (2026)</option>
            </select>

            <button
              type="button"
              onClick={handleExportCSV}
              className="btn-primary text-xs py-2 px-3.5 shadow-sm"
            >
              <Download size={14} /> Export Report
            </button>
          </div>
        }
      />

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Diverted Waste"
          value="142.8 Tonnes"
          trend="+18.4% YoY"
          colorScheme="forest"
          subtext="Zero landfill redirection"
        />
        <StatCard
          label="Recycling Completion Rate"
          value="89.9%"
          trend="Exceeds 85% target"
          colorScheme="olive"
          subtext="Secondary raw conversion"
        />
        <StatCard
          label="CO₂ Emissions Offset"
          value="341.2 Tonnes"
          trend="Saved"
          colorScheme="terracotta"
          subtext="Avoided virgin ore mining"
        />
        <StatCard
          label="Toxic Toxins Isolated"
          value="12,840 kg"
          subtext="Lead, cadmium & mercury"
          colorScheme="sand"
        />
      </div>

      {/* Two Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Collected vs Recycled Bar Chart */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Monthly Waste Inflow vs Recycled Yield (Tonnes)"
            subtitle="Comparing intake scale weight against finished recycled material fractions."
          >
            <ResponsiveContainer width="100%" height={290}>
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
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="collected" fill="#1C3A27" radius={[6, 6, 0, 0]} name="Intake Collected (Tonnes)" />
                <Bar dataKey="recycled" fill="#D97746" radius={[6, 6, 0, 0]} name="Recycled Output (Tonnes)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Category Share Donut */}
        <div className="lg:col-span-4">
          <ChartCard
            title="Stream Material Breakdown"
            subtitle="Distribution of incoming e-waste by product category."
          >
            <ResponsiveContainer width="100%" height={290}>
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => `${val}%`}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #EFECE1',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-[11px] text-earth-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Recovered Strategic Minerals Ledger Card */}
      <div className="card p-6 sm:p-8 bg-white border border-sand-300 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-earth-950 font-sans">
              Recovered Strategic Secondary Raw Materials Ledger
            </h3>
            <p className="text-xs text-earth-500">
              Verified metric volumes recovered and returned to clean tech manufacturing.
            </p>
          </div>
          <span className="badge badge-forest text-xs font-semibold">
            Lab Certified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-sand-50/80 border border-sand-200">
            <span className="text-[10px] uppercase font-bold text-earth-400 block">Gold (99.9% Pure)</span>
            <span className="text-xl font-bold font-serif text-forest-900">3,840 g</span>
            <span className="text-[10px] text-earth-500 block mt-0.5">Hydrometallurgic yield</span>
          </div>

          <div className="p-4 rounded-2xl bg-sand-50/80 border border-sand-200">
            <span className="text-[10px] uppercase font-bold text-earth-400 block">Pure Copper Ingot</span>
            <span className="text-xl font-bold font-serif text-terracotta-600">28.4 Tonnes</span>
            <span className="text-[10px] text-earth-500 block mt-0.5">Cables & heat exchangers</span>
          </div>

          <div className="p-4 rounded-2xl bg-sand-50/80 border border-sand-200">
            <span className="text-[10px] uppercase font-bold text-earth-400 block">Recycled Aluminum</span>
            <span className="text-xl font-bold font-serif text-earth-900">49.2 Tonnes</span>
            <span className="text-[10px] text-earth-500 block mt-0.5">Chassis & enclosures</span>
          </div>

          <div className="p-4 rounded-2xl bg-sand-50/80 border border-sand-200">
            <span className="text-[10px] uppercase font-bold text-earth-400 block">Lithium & Cobalt</span>
            <span className="text-xl font-bold font-serif text-olive-800">16.1 Tonnes</span>
            <span className="text-[10px] text-earth-500 block mt-0.5">High-energy battery cells</span>
          </div>
        </div>
      </div>
    </div>
  );
}
