import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
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

export default function RecyclerDashboard() {
  const { user } = useAuth();
  const allRequests = storageService.getRequests();

  // Requests assigned to this recycler facility (EcoCycle or user)
  const recyclerRequests = allRequests.filter(
    (r) => r.assignedRecyclerId === 'rec-1' || r.assignedRecyclerName?.includes('EcoCycle') || !r.assignedRecyclerId
  );

  const assigned = recyclerRequests.filter((r) => r.status === 'assigned');
  const incoming = recyclerRequests.filter((r) => r.status === 'scheduled');
  const awaitingProcessing = recyclerRequests.filter((r) => r.status === 'collected');
  const inProgress = recyclerRequests.filter((r) => r.status === 'in_recycling');
  const completed = recyclerRequests.filter((r) => r.status === 'completed');

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Facility Operations — ${user?.organization || 'EcoCycle Technologies'}`}
        subtitle="Intake logs, precision disassembly tracking, and recovered material assays."
        badge="Accredited Facility"
        actions={
          <Link to="/recycler/operations" className="btn-accent text-xs py-2 px-3.5 shadow-sm">
            <RotateCw size={14} /> Open Operations Floor
          </Link>
        }
      />

      {/* 5 Operational Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard
          icon={Package}
          label="Assigned Requests"
          value={assigned.length + inProgress.length}
          trend="Active"
          colorScheme="terracotta"
        />
        <StatCard
          icon={Truck}
          label="Incoming In Transit"
          value={incoming.length}
          subtext="En route by fleet"
          colorScheme="olive"
        />
        <StatCard
          icon={Scale}
          label="Awaiting Processing"
          value={awaitingProcessing.length}
          subtext="Dock check-in"
          colorScheme="sand"
        />
        <StatCard
          icon={RotateCw}
          label="In Dismantling"
          value={inProgress.length}
          subtext="Active bench jobs"
          colorScheme="forest"
        />
        <StatCard
          icon={Award}
          label="Completed Yields"
          value={completed.length}
          subtext="Assayed & certified"
          colorScheme="forest"
        />
      </div>

      {/* Active Work In Progress Alert Banner */}
      {inProgress.length > 0 && (
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
                {inProgress[0].id}: {inProgress[0].deviceName}
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
                  {recyclerRequests.slice(0, 5).map((req) => (
                    <tr key={req.id} className="hover:bg-sand-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-forest-900">
                        {req.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-earth-950">{req.deviceName}</div>
                        <div className="text-[11px] text-earth-500">{req.category} ({req.condition})</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-earth-900">
                        {req.weight} kg
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
                  ))}
                </tbody>
              </table>
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
