import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { recyclersApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  Factory,
  Package,
  Truck,
  RotateCw,
  Award,
  Boxes,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecyclerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assignedRequests: 0,
    incomingCollections: 0,
    awaitingProcessing: 0,
    recyclingInProgress: 0,
    completedRecycling: 0,
  });
  const [recyclerRequests, setRecyclerRequests] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashRes, assignedRes] = await Promise.all([
        recyclersApi.getDashboard().catch(() => ({ stats: {} })),
        recyclersApi.getAssignedRequests().catch(() => ({ pickups: [] })),
      ]);

      if (dashRes && dashRes.stats) {
        setStats(dashRes.stats);
      }
      setRecyclerRequests(assignedRes.pickups || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load recycler dashboard');
    } finally {
      setLoading(false);
    }
  };

  const inProgressList = recyclerRequests.filter((r) =>
    r.status === 'recycling_in_progress' || r.status === 'in_recycling' || r.recyclerStatus === 'processing'
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Facility Operations — ${user?.companyName || user?.name || 'Recycling Center'}`}
        subtitle="Intake logs, precision disassembly tracking, and recovered material assays."
        badge="Accredited Facility"
        actions={
          <Link to="/recycler/operations" className="btn-accent text-xs py-2 px-3.5 shadow-sm">
            <RotateCw size={14} /> Open Operations Floor
          </Link>
        }
      />

      {/* 5 Operational Metric Cards */}
      {loading ? (
        <LoadingSkeleton type="stat" count={5} className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <StatCard
            icon={Package}
            label="Assigned Requests"
            value={stats.assignedRequests || recyclerRequests.length}
            trend="Active"
            colorScheme="terracotta"
          />
          <StatCard
            icon={Truck}
            label="Incoming In Transit"
            value={stats.incomingCollections || 0}
            subtext="En route by fleet"
            colorScheme="olive"
          />
          <StatCard
            icon={Scale}
            label="Awaiting Processing"
            value={stats.awaitingProcessing || 0}
            subtext="Dock check-in"
            colorScheme="sand"
          />
          <StatCard
            icon={RotateCw}
            label="In Dismantling"
            value={stats.recyclingInProgress || inProgressList.length}
            subtext="Active bench jobs"
            colorScheme="forest"
          />
          <StatCard
            icon={Award}
            label="Completed Yields"
            value={stats.completedRecycling || 0}
            subtext="Assayed & certified"
            colorScheme="forest"
          />
        </div>
      )}

      {/* Active Work In Progress Alert Banner */}
      {inProgressList.length > 0 && (
        <div className="card p-6 bg-terracotta-50/60 border border-terracotta-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shrink-0">
              <RotateCw size={20} className="animate-spin-slow" />
            </div>
            <div>
              <span className="text-xs font-bold text-terracotta-800 uppercase tracking-wider block">
                Active Processing Bench
              </span>
              <h4 className="text-sm font-bold text-earth-950 font-sans mt-0.5">
                #{(inProgressList[0]._id || inProgressList[0].id || '').toString().slice(-6).toUpperCase()}: {inProgressList[0].deviceName || inProgressList[0].items?.[0]?.itemName || inProgressList[0].category}
              </h4>
              <p className="text-xs text-earth-600 mt-0.5">
                Current stage: Dismantling & precious component hydrometallurgy
              </p>
            </div>
          </div>

          <Link
            to="/recycler/operations"
            className="btn-accent text-xs py-2 px-4 shrink-0 shadow-sm"
          >
            Log Recovered Assay <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Two Columns: Intake Queue & Materials Yield */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Assigned Queue */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-earth-950 font-sans">
              Assigned Facility Manifests
            </h3>
            <Link
              to="/recycler/assigned"
              className="text-xs font-semibold text-forest-800 hover:underline flex items-center gap-1"
            >
              View Full Queue <ArrowRight size={13} />
            </Link>
          </div>

          <div className="card overflow-hidden bg-white border border-sand-300 shadow-card">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-4">
                  <LoadingSkeleton type="table" count={4} />
                </div>
              ) : recyclerRequests.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    title="No manifests currently assigned"
                    description="When administrators allocate collections to your facility, they will appear here."
                  />
                </div>
              ) : (
                <table className="w-full text-left text-xs text-earth-800">
                  <thead className="bg-sand-50 border-b border-sand-200 text-earth-900 uppercase font-semibold text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Manifest ID</th>
                      <th className="py-3.5 px-4">Equipment Specs</th>
                      <th className="py-3.5 px-4">Gross Weight</th>
                      <th className="py-3.5 px-4">Stage</th>
                      <th className="py-3.5 px-4 text-right">Floor Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-200/80">
                    {recyclerRequests.slice(0, 5).map((req) => {
                      const reqId = req._id || req.id;
                      const shortId = reqId ? reqId.toString().slice(-6).toUpperCase() : 'MAN';
                      const devName = req.deviceName || req.items?.[0]?.itemName || req.category || 'Electronic Item';
                      const category = req.category || req.items?.[0]?.category || 'E-Waste';
                      const weight = req.weight || req.estimatedWeight || '1.0';
                      const condition = req.condition || req.items?.[0]?.condition || 'Standard';

                      return (
                        <tr key={reqId} className="hover:bg-sand-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-forest-900">
                            #{shortId}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-earth-950">{devName}</div>
                            <div className="text-[11px] text-earth-500">{category} ({condition})</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-earth-900">
                            {weight} kg
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <StatusBadge status={req.status} size="xs" />
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <Link
                              to="/recycler/operations"
                              className="btn-secondary text-[11px] py-1 px-2.5"
                            >
                              Process
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

        {/* Right: Quick Inventory Assays */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-base font-bold text-earth-950 font-sans">
            Recovered Stock Snapshot
          </h3>

          <div className="card p-5 bg-sand-50/70 border border-sand-300 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-sand-200">
              <span className="text-xs text-earth-600">Gold Ingot (99.9%)</span>
              <span className="font-bold text-forest-900 font-serif text-sm">4.28 g</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-sand-200">
              <span className="text-xs text-earth-600">Electrolytic Copper</span>
              <span className="font-bold text-terracotta-700 font-serif text-sm">18.4 kg</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-sand-200">
              <span className="text-xs text-earth-600">Pure Aluminum Scrap</span>
              <span className="font-bold text-earth-900 font-serif text-sm">34.1 kg</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-sand-200">
              <span className="text-xs text-earth-600">ABS Polymer Flake</span>
              <span className="font-bold text-earth-900 font-serif text-sm">22.0 kg</span>
            </div>

            <div className="pt-2">
              <Link
                to="/recycler/inventory"
                className="btn-primary w-full text-xs py-2 justify-center shadow-xs"
              >
                <Boxes size={14} /> Full Inventory Ledger
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
