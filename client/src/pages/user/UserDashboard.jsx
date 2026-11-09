import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import PageHeader from '../../components/common/PageHeader';
import {
  Package,
  Clock,
  CheckCircle2,
  Leaf,
  CalendarPlus,
  ArrowRight,
  Truck,
  Compass,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const allRequests = storageService.getRequests();

  // Filter requests belonging to this user or Sarah Chen
  const userRequests = allRequests.filter(
    (r) => r.userId === user?.id || r.userEmail === user?.email || user?.role === 'user'
  );

  const pendingRequests = userRequests.filter(
    (r) => ['submitted', 'verified', 'assigned', 'scheduled'].includes(r.status)
  );
  const activeCollection = userRequests.find((r) => ['assigned', 'scheduled', 'in_recycling'].includes(r.status));
  const completedRequests = userRequests.filter((r) => r.status === 'completed');

  const totalWeightKg = userRequests
    .filter((r) => r.status === 'completed' || r.status === 'in_recycling')
    .reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0);

  const estimatedCO2 = (totalWeightKg * 2.4).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title={`Welcome back, ${user?.name || 'Sarah'} 🌱`}
        subtitle="Track your doorstep collections, request new pickups, and monitor your personal recycling impact."
        badge="Citizen Portal"
        actions={
          <Link to="/user/schedule" className="btn-primary text-sm shadow-md">
            <CalendarPlus size={16} /> Schedule a Pickup
          </Link>
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total Pickup Requests"
          value={userRequests.length}
          trend="+2 this month"
          colorScheme="forest"
          isSample={true}
        />
        <StatCard
          icon={Clock}
          label="Pending / In Progress"
          value={pendingRequests.length}
          subtext="Active in custody chain"
          colorScheme="terracotta"
          isSample={true}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Recycling"
          value={completedRequests.length}
          subtext="Certified zero landfill"
          colorScheme="olive"
          isSample={true}
        />
        <StatCard
          icon={Leaf}
          label="CO₂ Prevented"
          value={`${estimatedCO2 || '42.6'} kg`}
          trend="Saved"
          colorScheme="sand"
          isSample={true}
        />
      </div>

      {/* Upcoming Collection Banner / Highlight */}
      {activeCollection && (
        <div className="card p-6 bg-gradient-to-r from-forest-900 to-forest-950 text-sand-50 relative overflow-hidden shadow-elevated border border-forest-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="badge badge-terracotta text-[10px] font-bold">
                  Next Scheduled Pickup
                </span>
                <span className="text-xs text-sand-300 font-mono">
                  {activeCollection.id}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-sans text-white">
                {activeCollection.deviceName}
              </h3>
              <p className="text-xs sm:text-sm text-sand-300 leading-relaxed">
                Collection window: <span className="font-semibold text-white">{activeCollection.preferredDate} ({activeCollection.preferredTime})</span> at {activeCollection.pickupAddress}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/user/track"
                className="btn-accent text-xs py-2.5 px-5 shadow-sm"
              >
                <Compass size={15} /> Track Live Progress
              </Link>
              <Link
                to="/user/pickups"
                className="btn-outline text-xs py-2.5 px-4 text-white border-white/30 hover:bg-white/10"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Two Columns: Recent Pickup Requests & Fast Resource Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Requests Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-earth-900">
                Recent Pickup Requests
              </h3>
              <p className="text-xs text-earth-500">
                Your latest e-waste requests and their current processing stage.
              </p>
            </div>
            <Link
              to="/user/pickups"
              className="text-xs font-semibold text-forest-800 hover:underline flex items-center gap-1"
            >
              View all ({userRequests.length}) <ArrowRight size={13} />
            </Link>
          </div>

          <div className="card overflow-hidden bg-white border border-sand-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-earth-700">
                <thead className="bg-sand-50/80 text-earth-900 border-b border-sand-200 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Device & Category</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200/70">
                  {userRequests.slice(0, 4).map((req) => (
                    <tr key={req.id} className="hover:bg-sand-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-earth-900">
                        {req.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-earth-900 truncate max-w-xs">
                          {req.deviceName}
                        </div>
                        <div className="text-[11px] text-earth-500">{req.category} • {req.weight}kg</div>
                      </td>
                      <td className="py-3.5 px-4 text-earth-600 whitespace-nowrap">
                        {req.preferredDate}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={req.status} size="xs" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to="/user/track"
                          className="text-xs font-semibold text-forest-800 hover:text-forest-950 hover:underline inline-flex items-center gap-1"
                        >
                          Track <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Quick Guides & Sustainability Tips */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-base font-bold text-earth-900">
            Recycling Resources
          </h3>

          <div className="card p-5 bg-sand-50/60 border border-sand-300 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
                <Leaf size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-earth-900">Battery Disposal Warning</h4>
                <p className="text-[11px] text-earth-600 mt-0.5 leading-normal">
                  Always wrap loose lithium-ion battery terminals with insulation tape before handing to our driver.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-sand-200">
              <div className="w-9 h-9 rounded-xl bg-terracotta-100 text-terracotta-800 flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-earth-900">NIST 800-88 Data Shredding</h4>
                <p className="text-[11px] text-earth-600 mt-0.5 leading-normal">
                  Our certified recyclers degauss and shred magnetic & flash media. No private data is ever exposed.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/user/guide" className="btn-secondary w-full text-xs py-2 justify-center">
                Read Full E-Waste Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
