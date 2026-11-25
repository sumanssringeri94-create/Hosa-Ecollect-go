import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, pickupsApi } from '../../api';
import StatCard from '../../components/common/StatCard';
import ChartCard from '../../components/common/ChartCard';
import StatusBadge from '../../components/common/StatusBadge';
import PageHeader from '../../components/common/PageHeader';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';

const DEFAULT_CATEGORY_DISTRIBUTION = [
  { name: 'Laptop/PC', value: 38, color: '#1C3A27' },
  { name: 'Mobile Phone', value: 27, color: '#D97746' },
  { name: 'TV/Monitor', value: 16, color: '#556B2F' },
  { name: 'Battery', value: 11, color: '#C87D2A' },
  { name: 'Charger/Cable', value: 8, color: '#7C8B82' },
];

const DEFAULT_MONTHLY_STATS = [
  { month: 'Jun', collected: 120, recycled: 110 },
  { month: 'Jul', collected: 190, recycled: 175 },
  { month: 'Aug', collected: 240, recycled: 220 },
  { month: 'Sep', collected: 310, recycled: 290 },
  { month: 'Oct', collected: 380, recycled: 350 },
  { month: 'Nov', collected: 210, recycled: 135 },
];
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
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingVerification: 0,
    verified: 0,
    activeCollections: 0,
    completedRecycling: 0,
    totalUsers: 0,
    registeredRecyclers: 0,
    registeredLogistics: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [monthlyData, setMonthlyData] = useState(DEFAULT_MONTHLY_STATS);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, reportsRes] = await Promise.allSettled([
        adminApi.getDashboard(),
        adminApi.getReports(),
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value?.stats) {
        setStats(dashRes.value.stats);
        setRecentRequests(dashRes.value.recentRequests || []);
      }
      if (reportsRes.status === 'fulfilled' && reportsRes.value?.reports?.monthlyStats) {
        setMonthlyData(reportsRes.value.reports.monthlyStats);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const pendingVerificationCount = stats.pendingVerification || 0;

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
              <ShieldCheck size={14} /> Assign Pending ({pendingVerificationCount})
            </Link>
          </div>
        }
      />

      {/* 7 Key Admin Stat Cards */}
      {loading ? (
        <LoadingSkeleton type="stat" count={7} className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-7" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <StatCard
            icon={Package}
            label="Total Requests"
            value={stats.totalRequests}
            trend="+12%"
            colorScheme="forest"
            className="col-span-2 sm:col-span-1"
          />
          <StatCard
            icon={Clock}
            label="Pending Verification"
            value={stats.pendingVerification}
            trend="Action required"
            trendPositive={false}
            colorScheme="terracotta"
          />
          <StatCard
            icon={Truck}
            label="Active Collections"
            value={stats.activeCollections}
            subtext="In transit"
            colorScheme="olive"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={stats.completedRecycling}
            subtext="100% certified"
            colorScheme="forest"
          />
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers}
            trend="Active"
            colorScheme="sand"
          />
          <StatCard
            icon={Factory}
            label="Recyclers"
            value={stats.registeredRecyclers}
            subtext="Certified labs"
            colorScheme="sand"
          />
          <StatCard
            icon={Truck}
            label="Logistics"
            value={stats.registeredLogistics}
            subtext="EV Fleets"
            colorScheme="sand"
          />
        </div>
      )}

      {/* 2 Recharts: Trends & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Collection & Recycling Trends */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Pickup & Recycling Trajectory (Tonnes)"
            subtitle="Monthly collection volume vs processed secondary raw materials."
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  data={DEFAULT_CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {DEFAULT_CATEGORY_DISTRIBUTION.map((entry, index) => (
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
              All Requests ({stats.totalRequests || recentRequests.length}) <ArrowRight size={13} />
            </Link>
          </div>

          <div className="card overflow-hidden bg-white border border-sand-300 shadow-card">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-4">
                  <LoadingSkeleton type="table" count={5} />
                </div>
              ) : recentRequests.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    title="No manifests in queue"
                    description="Incoming collection requests will appear here once submitted by users."
                  />
                </div>
              ) : (
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
                    {recentRequests.slice(0, 5).map((req) => {
                      const reqId = req._id || req.id;
                      const shortId = reqId ? reqId.toString().slice(-6).toUpperCase() : 'REQ';
                      const userName = req.user?.name || req.userName || 'Citizen User';
                      const city = req.user?.city || req.city || 'Bengaluru';
                      const deviceName = req.deviceName || req.items?.[0]?.itemName || req.category || 'Electronic Item';
                      const category = req.category || req.items?.[0]?.category || 'General E-Waste';
                      const weight = req.weight || req.estimatedWeight || '1.0';

                      return (
                        <tr key={reqId} className="hover:bg-sand-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-forest-900">
                            #{shortId}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-earth-900">{userName}</div>
                            <div className="text-[11px] text-earth-400">{city}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-earth-900 truncate max-w-xs">{deviceName}</div>
                            <div className="text-[11px] text-earth-500">{category} • {weight}kg</div>
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
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Links / Governance Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-earth-900">
              Governance Actions
            </h3>
            <span className="text-[10px] text-earth-400 font-mono">Active</span>
          </div>

          <div className="card p-5 bg-sand-50/60 border border-sand-300 space-y-3.5">
            <div className="pb-3 border-b border-sand-200/80">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-earth-900">Custody Assignments</span>
                <span className="badge badge-sand text-[10px]">{stats.pendingVerification} pending</span>
              </div>
              <p className="text-[11px] text-earth-600 mt-1">Pair unallocated manifests with verified recycling labs and green courier fleets.</p>
              <Link to="/admin/assignments" className="text-xs font-semibold text-forest-800 hover:underline block mt-2">
                Open Assignment Matrix →
              </Link>
            </div>

            <div className="pb-3 border-b border-sand-200/80">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-earth-900">Partner Facility Audits</span>
                <span className="badge badge-sand text-[10px]">{stats.registeredRecyclers} labs</span>
              </div>
              <p className="text-[11px] text-earth-600 mt-1">Review state pollution control compliance certifications and process capacities.</p>
              <Link to="/admin/recyclers" className="text-xs font-semibold text-forest-800 hover:underline block mt-2">
                Manage Recycler Facilities →
              </Link>
            </div>

            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-earth-900">Zero-Emission Fleet Logistics</span>
                <span className="badge badge-sand text-[10px]">{stats.registeredLogistics} fleets</span>
              </div>
              <p className="text-[11px] text-earth-600 mt-1">Monitor EV courier availability, service zones, and route payloads.</p>
              <Link to="/admin/logistics" className="text-xs font-semibold text-forest-800 hover:underline block mt-2">
                Manage Logistics Directory →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
