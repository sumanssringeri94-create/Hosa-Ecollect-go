import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import TrackingTimeline from '../../components/common/TrackingTimeline';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import {
  Compass,
  Package,
  Truck,
  Factory,
  Award,
  Calendar,
  MapPin,
  Clock,
  Download,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TrackCollection() {
  const { user } = useAuth();
  const allRequests = storageService.getRequests();
  const userRequests = allRequests.filter(
    (r) => r.userId === user?.id || r.userEmail === user?.email || user?.role === 'user'
  );

  const [selectedId, setSelectedId] = useState(userRequests[0]?.id || '');

  const activeRequest = userRequests.find((r) => r.id === selectedId) || userRequests[0];

  const handleDownloadCertificate = (certId) => {
    toast.success(`Downloading Green Recycling Certificate (${certId || 'ECG-CERT-4412'})`);
  };

  if (!activeRequest) {
    return (
      <EmptyState
        title="No active requests to track"
        description="You do not have any pickup requests logged yet. Schedule a collection to start tracking."
        actionLabel="Schedule a Pickup"
        onAction={() => (window.location.href = '/user/schedule')}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader
        title="Live Collection Tracking"
        subtitle="End-to-end custody provenance and processing milestones for your e-waste items."
        badge="Real-Time Custody"
      />

      {/* Request Switcher Bar */}
      <div className="card p-4 bg-white border border-sand-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Package size={18} className="text-forest-800" />
          <span className="text-xs font-bold uppercase tracking-wider text-earth-800">
            Select Request to Track:
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {userRequests.map((r) => {
            const isSelected = r.id === activeRequest.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedId(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-forest-900 text-sand-50 shadow-sm'
                    : 'bg-sand-100 hover:bg-sand-200 text-earth-700 border border-sand-200'
                }`}
              >
                {r.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tracking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Timeline & Milestones */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card p-6 sm:p-8 bg-white border border-sand-300 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-sand-200">
              <div>
                <span className="text-[11px] font-mono font-bold text-forest-800 uppercase block">
                  Manifest {activeRequest.id}
                </span>
                <h3 className="text-xl font-bold text-earth-950 font-sans mt-0.5">
                  {activeRequest.deviceName}
                </h3>
                <p className="text-xs text-earth-500 mt-1">
                  {activeRequest.category} • {activeRequest.weight} kg • {activeRequest.condition}
                </p>
              </div>

              <div className="shrink-0">
                <StatusBadge status={activeRequest.status} size="sm" />
              </div>
            </div>

            {/* Visual Tracking Stepper */}
            <div>
              <span className="text-xs font-bold text-earth-800 uppercase tracking-wider block mb-5">
                Custody Milestone Progress
              </span>
              <TrackingTimeline
                timeline={activeRequest.timeline}
                currentStatus={activeRequest.status}
                orientation="vertical"
              />
            </div>
          </div>
        </div>

        {/* Right: Partner Details & Certificate */}
        <div className="lg:col-span-4 space-y-6">
          {/* Driver & Courier Card */}
          <div className="card p-5 bg-sand-50/70 border border-sand-300 space-y-3">
            <div className="flex items-center gap-2 text-olive-900">
              <Truck size={18} />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Logistics Courier
              </h4>
            </div>

            {activeRequest.assignedLogisticsName ? (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-earth-950 text-sm">
                  {activeRequest.assignedLogisticsName}
                </div>
                <div className="text-earth-600">
                  Vehicle: {activeRequest.assignedLogisticsVehicle || 'Electric Cargo Van'}
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-sand-200 text-earth-600 text-[11px] leading-relaxed">
                  Scheduled collection window: <br />
                  <span className="font-semibold text-earth-900">
                    {activeRequest.preferredDate} ({activeRequest.preferredTime})
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-earth-400 italic">
                Awaiting logistics driver dispatch confirmation.
              </p>
            )}
          </div>

          {/* Recycler Facility Card */}
          <div className="card p-5 bg-sand-50/70 border border-sand-300 space-y-3">
            <div className="flex items-center gap-2 text-forest-900">
              <Factory size={18} />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Authorized Recycler
              </h4>
            </div>

            {activeRequest.assignedRecyclerName ? (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-earth-950 text-sm">
                  {activeRequest.assignedRecyclerName}
                </div>
                <div className="text-earth-500 text-[11px]">
                  Accredited ISO 14001 / R2v3 Certified Facility
                </div>

                {activeRequest.recyclingData && (
                  <div className="p-2.5 rounded-xl bg-forest-50 border border-forest-200 text-forest-900 text-[11px] space-y-1">
                    <span className="font-bold block">Recovered Yield Ledger:</span>
                    <div>• Copper recovered: {activeRequest.recyclingData.recoveredMaterials?.copperKg || 0.95} kg</div>
                    <div>• Gold recovered: {activeRequest.recyclingData.recoveredMaterials?.goldGrams || 0.28} g</div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-earth-400 italic">
                Awaiting recycler facility pairing.
              </p>
            )}
          </div>

          {/* Certificate Download Card (if completed) */}
          {activeRequest.status === 'completed' && (
            <div className="card p-5 bg-forest-900 text-sand-50 border border-forest-800 space-y-3">
              <div className="flex items-center gap-2 text-terracotta-300">
                <Award size={20} />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Recycling Certificate Issued
                </h4>
              </div>
              <p className="text-xs text-sand-200 leading-relaxed">
                Official proof of zero-landfill destruction and hazardous neutralization.
              </p>
              <button
                type="button"
                onClick={() => handleDownloadCertificate(activeRequest.recyclingData?.certificateId)}
                className="btn-accent w-full text-xs py-2 justify-center"
              >
                <Download size={14} /> Download Certificate (PDF)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
