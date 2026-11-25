import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { pickupsApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import TrackingTimeline from '../../components/common/TrackingTimeline';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Compass,
  Package,
  Truck,
  Factory,
  Award,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TrackCollection() {
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function fetchPickups() {
      try {
        setLoading(true);
        const res = await pickupsApi.getMyPickups();
        if (isMounted && res.success) {
          const list = res.pickups || [];
          setPickups(list);
          if (list.length > 0 && !selectedId) {
            setSelectedId(list[0]._id || list[0].id);
          }
        }
      } catch (err) {
        if (isMounted) toast.error(err.message || 'Failed to fetch tracking data');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchPickups();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeRequest = pickups.find((r) => (r._id || r.id) === selectedId) || pickups[0];

  const handleDownloadCertificate = (certId) => {
    toast.success(`Downloading Green Recycling Certificate (${certId || 'ECG-CERT-4412'})`);
  };

  if (loading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <PageHeader
          title="Live Collection Tracking"
          subtitle="Loading real-time milestones for your e-waste items..."
          badge="Real-Time Custody"
        />
        <LoadingSkeleton type="card" count={2} />
      </div>
    );
  }

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

  // Generate milestone timeline from activeRequest status
  const statusLevels = {
    pending: 1,
    submitted: 1,
    verified: 2,
    assigned: 3,
    scheduled: 4,
    pickup_scheduled: 4,
    collected: 5,
    in_recycling: 6,
    recycling_in_progress: 6,
    completed: 7,
  };

  const currentLevel = statusLevels[activeRequest.status] || 1;

  const dynamicTimeline = [
    {
      stage: 'Request Submitted',
      date: new Date(activeRequest.createdAt || Date.now()).toLocaleDateString(),
      status: currentLevel > 1 ? 'completed' : currentLevel === 1 ? 'current' : 'upcoming',
      detail: 'Electronic waste manifests registered in database.',
    },
    {
      stage: 'Admin Verified',
      date: currentLevel >= 2 ? 'Completed' : 'Pending Review',
      status: currentLevel > 2 ? 'completed' : currentLevel === 2 ? 'current' : 'upcoming',
      detail: activeRequest.adminNote || 'Verified compliance & safety categorisation.',
    },
    {
      stage: 'Recycler Assigned',
      date: activeRequest.recycler ? (activeRequest.recycler.companyName || activeRequest.recycler.name) : 'Pending Pairing',
      status: currentLevel > 3 ? 'completed' : currentLevel === 3 ? 'current' : 'upcoming',
      detail: activeRequest.recycler ? `Facility: ${activeRequest.recycler.city || 'Regional Hub'}` : 'Matching regional R2 certified facility.',
    },
    {
      stage: 'Pickup Scheduled',
      date: new Date(activeRequest.scheduledDate || Date.now()).toLocaleDateString(),
      status: currentLevel > 4 ? 'completed' : currentLevel === 4 ? 'current' : 'upcoming',
      detail: `Time window: ${activeRequest.timeSlot || 'Standard window'}`,
    },
    {
      stage: 'Collected',
      date: currentLevel >= 5 ? 'Collected' : 'En route to doorstep',
      status: currentLevel > 5 ? 'completed' : currentLevel === 5 ? 'current' : 'upcoming',
      detail: activeRequest.pickupNotes || 'Transferred to zero-emission electric cargo vehicle.',
    },
    {
      stage: 'Recycling in Progress',
      date: currentLevel >= 6 ? 'Processing' : 'Awaiting facility arrival',
      status: currentLevel > 6 ? 'completed' : currentLevel === 6 ? 'current' : 'upcoming',
      detail: activeRequest.processingNotes || 'Disassembly, shredding, and precious metals recovery.',
    },
    {
      stage: 'Completed & Certified',
      date: activeRequest.completedAt ? new Date(activeRequest.completedAt).toLocaleDateString() : 'Awaiting completion',
      status: currentLevel === 7 ? 'completed' : 'upcoming',
      detail: 'NIST 800-88 sanitization certificate & materials ledger published.',
    },
  ];

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
          {pickups.map((r) => {
            const reqId = r._id || r.id;
            const isSelected = reqId === (activeRequest._id || activeRequest.id);
            return (
              <button
                key={reqId}
                type="button"
                onClick={() => setSelectedId(reqId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-forest-900 text-sand-50 shadow-sm'
                    : 'bg-sand-100 hover:bg-sand-200 text-earth-700 border border-sand-200'
                }`}
              >
                #{reqId.slice(-6)}
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
                  Manifest #{activeRequest._id ? activeRequest._id.slice(-6) : activeRequest.id}
                </span>
                <h3 className="text-xl font-bold text-earth-950 font-sans mt-0.5">
                  {activeRequest.deviceName || activeRequest.category}
                </h3>
                <p className="text-xs text-earth-500 mt-1">
                  {activeRequest.category} • {activeRequest.weight || '1.5 kg'} • {activeRequest.condition || 'Used'}
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
                timeline={dynamicTimeline}
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
              <h4 className="text-xs font-bold uppercase tracking-wider">Logistics Courier</h4>
            </div>

            {activeRequest.logisticsPartner ? (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-earth-950 text-sm">
                  {activeRequest.logisticsPartner.companyName || activeRequest.logisticsPartner.name}
                </div>
                <div className="text-earth-600">
                  Vehicle: {activeRequest.logisticsPartner.vehicleType || 'Electric Cargo Van'}
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-sand-200 text-earth-600 text-[11px] leading-relaxed">
                  Scheduled collection window: <br />
                  <span className="font-semibold text-earth-900">
                    {new Date(activeRequest.scheduledDate || Date.now()).toLocaleDateString()} ({activeRequest.timeSlot})
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
              <h4 className="text-xs font-bold uppercase tracking-wider">Authorized Recycler</h4>
            </div>

            {activeRequest.recycler ? (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-earth-950 text-sm">
                  {activeRequest.recycler.companyName || activeRequest.recycler.name}
                </div>
                <div className="text-earth-500 text-[11px]">
                  Accredited ISO 14001 / R2v3 Certified Facility
                </div>

                {activeRequest.recoveredMaterials && (
                  <div className="p-2.5 rounded-xl bg-forest-50 border border-forest-200 text-forest-900 text-[11px] space-y-1">
                    <span className="font-bold block">Recovered Yield Ledger:</span>
                    <div>• {activeRequest.recoveredMaterials}</div>
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
                onClick={() => handleDownloadCertificate(activeRequest._id)}
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
