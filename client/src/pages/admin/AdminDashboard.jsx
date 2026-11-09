import React from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import {
  MONTHLY_COLLECTION_DATA,
  CATEGORY_DISTRIBUTION,
} from '../../data/mockData';
import StatCard from '../../components/common/StatCard';
import ChartCard from '../../components/common/ChartCard';
import StatusBadge from '../../components/common/StatusBadge';
import PageHeader from '../../components/common/PageHeader';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  Users,
  Factory,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function AdminDashboard() {
  const requests = storageService.getRequests();
  const users = storageService.getUsers();
  const recyclers = storageService.getRecyclers();
  const logistics = storageService.getLogistics();
  const auditLogs = storageService.getAuditLogs();

  const pendingVerification = requests.filter((r) => r.status === 'submitted');
  const activeCollections = requests.filter((r) => ['verified', 'assigned', 'scheduled', 'collected'].includes(r.status));
  const completedRecycling = requests.filter((r) => r.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Admin Control Tower"
        subtitle="Platform governance, custody verifications, fleet logistics, and recycling operations oversight."
        badge="Governance Tower"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/assignments" className="btn-primary text-xs py-2 px-3.5 shadow-sm">
              <ShieldCheck size={14} /> Assign Pending ({pendingVerification.length})
            </Link>
          </div>
        }
      />

      {/* 7 Key Admin Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatCard
          icon={Package}
          label="Total Requests"
          value={requests.length}
          trend="+12%"
          colorScheme="forest"
          className="col-span-2 sm:col-span-1"
        />
        <StatCard
          icon={Clock}
          label="Pending Verification"
          value={pendingVerification.length}
          trend="Action required"
          trendPositive={false}
          colorScheme="terracotta"
        />
        <StatCard
          icon={Truck}
          label="Active Collections"
          value={activeCollections.length}
          subtext="In transit"
          colorScheme="olive"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={completedRecycling.length}
          subtext="100% certified"
          colorScheme="forest"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={users.length}
          trend="Active"
          colorScheme="sand"
        />
        <StatCard
          icon={Factory}
          label="Recyclers"
          value={recyclers.length}
          subtext="Certified labs"
          colorScheme="sand"
        />
        <StatCard
          icon={Truck}
          label="Logistics"
          value={logistics.length}
          subtext="EV Fleets"
          colorScheme="sand"
        />
      </div>

      {/* 2 Recharts: Trends & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Collection & Recycling Trends */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Pickup & Recycling Trajectory (Tonnes)"
            subtitle="Monthly collection volume vs processed secondary raw materials."
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={MONTHLY_COLLECTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1C3A27" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1C3A27" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRecycled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97746" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D97746" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
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
                <Area type="monotone" dataKey="collected" stroke="#1C3A27" strokeWidth={2} fillOpacity={1} fill="url(#colorCollected)" name="Collected (Tonnes)" />
                <Area type="monotone" dataKey="recycled" stroke="#D97746" strokeWidth={2} fillOpacity={1} fill="url(#colorRecycled)" name="Recycled (Tonnes)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Right: Waste Category Distribution */}
        <div className="lg:col-span-5">
          <ChartCard
            title="E-Waste Stream Breakdown"
            subtitle="Percentage share of incoming electronics by equipment category."
          >
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
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
                  formatter={(value) => <span className="text-xs text-earth-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Two Columns: Recent Pickup Requests & Live Audit Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Requests Table with Quick Action Buttons */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-earth-900">
                Incoming Custody Manifests
              </h3>
              <p className="text-xs text-earth-500">
                Live queue of citizen and enterprise collection requests.
              </p>
            </div>
            <Link
              to="/admin/pickups"
              className="text-xs font-semibold text-forest-800 hover:underline flex items-center gap-1"
            >
              All Requests ({requests.length}) <ArrowRight size={13} />
            </Link>
          </div>

          <div className="card overflow-hidden bg-white border border-sand-300 shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-earth-800">
                <thead className="bg-sand-50 border-b border-sand-200 text-earth-900 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">User / Org</th>
                    <th className="py-3 px-4">Device Specification</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200/80">
                  {requests.slice(0, 5).map((req) => (
                    <tr key={req.id} className="hover:bg-sand-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-forest-900">
                        {req.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-earth-900">{req.userName}</div>
                        <div className="text-[11px] text-earth-400">{req.city}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-earth-900 truncate max-w-xs">{req.deviceName}</div>
                        <div className="text-[11px] text-earth-500">{req.category} • {req.weight}kg</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={req.status} size="xs" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/admin/pickups`}
                          className="btn-secondary text-[11px] py-1 px-2.5"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Recent Audit Activities */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-earth-900">
              Audit Activity Stream
            </h3>
            <span className="text-[10px] text-earth-400 font-mono">Live Logs</span>
          </div>

          <div className="card p-5 bg-sand-50/60 border border-sand-300 space-y-3.5">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="pb-3 border-b border-sand-200/80 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-earth-900">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-earth-400 shrink-0 font-mono">
                    {log.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-earth-600">
                  <span className="font-mono text-forest-800 font-semibold">{log.target}</span>
                  <span>•</span>
                  <span>by {log.actor}</span>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link
                to="/admin/settings"
                className="text-xs font-semibold text-forest-800 hover:underline block text-center"
              >
                View Full System Ledger →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
