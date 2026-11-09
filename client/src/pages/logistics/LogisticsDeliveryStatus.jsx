import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import TrackingTimeline from '../../components/common/TrackingTimeline';
import StatusBadge from '../../components/common/StatusBadge';
import {
  MapPin,
  Truck,
  Navigation,
  Clock,
  CheckCircle,
  Factory,
  Compass,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LogisticsDeliveryStatus() {
  const requests = storageService.getRequests();
  const driverRequests = requests.filter(
    (r) => r.assignedLogisticsId === 'log-1' || r.assignedLogisticsName?.includes('GreenRoute') || !r.assignedLogisticsId
  );

  const [selectedReq, setSelectedReq] = useState(driverRequests[0] || null);

  const handleAdvanceStatus = (req, next) => {
    storageService.updateRequestStatus(
      req.id,
      next,
      `Driver status progressed to ${next} along Indiranagar Sector 4 route.`,
      'Ravi Kumar (GreenRoute EV)'
    );
    toast.success(`Trip status advanced to ${next.toUpperCase()}!`);
    setSelectedReq(storageService.getRequestById(req.id));
  };

  if (!selectedReq) {
    return (
      <div className="p-8 text-center text-earth-500">
        No active dispatches found.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="Delivery Route & Custody Handoff"
        subtitle="Electric fleet navigation preview, collection waypoint milestones, and dropoff handoffs."
        badge="Active Dispatch"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Map Placeholder & Waypoints */}
        <div className="lg:col-span-7 space-y-6">
          {/* Map Placeholder Card (As instructed by prompt: Map placeholder only, no external Google Maps API key required) */}
          <div className="card p-6 bg-white border border-sand-300 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation size={18} className="text-forest-800" />
                <h3 className="text-sm font-bold text-earth-950 uppercase tracking-wider">
                  Live Dispatch Navigation Route
                </h3>
              </div>
              <span className="badge badge-forest text-[11px]">EV Route Active</span>
            </div>

            {/* Stylized Vector Map Graphic */}
            <div className="h-72 rounded-3xl bg-[#ECE7DC] border border-sand-300 relative overflow-hidden flex flex-col justify-between p-6">
              {/* Grid texture */}
              <div className="absolute inset-0 bg-[radial-gradient(#B5AB94_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-60" />

              {/* Waypoint 1 (Customer address) */}
              <div className="relative z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-sand-200 shadow-md max-w-xs">
                <div className="w-8 h-8 rounded-full bg-forest-900 text-white flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-earth-900 block truncate">Waypoint 1: Doorstep</span>
                  <span className="text-[11px] text-earth-500 truncate block">{selectedReq.pickupAddress}</span>
                </div>
              </div>

              {/* Waypoint 2 (Facility Dropoff) */}
              <div className="relative z-10 self-end flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-sand-200 shadow-md max-w-xs">
                <div className="w-8 h-8 rounded-full bg-terracotta-500 text-white flex items-center justify-center shrink-0">
                  <Factory size={16} />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-earth-900 block truncate">Destination: Facility Dock</span>
                  <span className="text-[11px] text-earth-500 truncate block">Peenya Industrial Hub</span>
                </div>
              </div>

              {/* Route status bar */}
              <div className="relative z-10 bg-forest-950/80 backdrop-blur-md text-white p-3 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-terracotta-400" />
                  <span>Tata Ace EV • Battery 78%</span>
                </div>
                <span className="font-semibold text-terracotta-300">Est. Distance: 6.4 km (ETA 18 mins)</span>
              </div>
            </div>
          </div>

          {/* Quick Action Progression Controls */}
          <div className="card p-6 bg-sand-50/70 border border-sand-300 space-y-4">
            <h4 className="text-xs font-bold text-earth-900 uppercase tracking-wider">
              Advance Pickup Progress
            </h4>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => handleAdvanceStatus(selectedReq, 'collected')}
                className="btn-primary text-xs py-2 px-4 shadow-sm"
              >
                Mark Item Collected at Doorstep
              </button>

              <button
                type="button"
                onClick={() => handleAdvanceStatus(selectedReq, 'in_recycling')}
                className="btn-accent text-xs py-2 px-4 shadow-sm"
              >
                Confirm Recycler Facility Dock Dropoff
              </button>
            </div>
          </div>
        </div>

        {/* Right: Waypoint Details & Custody Timeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card p-6 bg-white border border-sand-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <div>
                <span className="font-mono text-xs font-bold text-forest-900">
                  {selectedReq.id}
                </span>
                <h4 className="text-base font-bold text-earth-950 font-sans mt-0.5">
                  {selectedReq.deviceName}
                </h4>
              </div>
              <StatusBadge status={selectedReq.status} size="xs" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-sand-50 rounded-xl border border-sand-200">
                <span className="text-[10px] uppercase font-bold text-earth-400 block">Customer Contact</span>
                <span className="font-semibold text-earth-900 block text-sm">{selectedReq.userName}</span>
                <span className="text-earth-600">{selectedReq.userPhone}</span>
              </div>

              <div className="p-3 bg-sand-50 rounded-xl border border-sand-200">
                <span className="text-[10px] uppercase font-bold text-earth-400 block">Doorstep Address</span>
                <span className="font-medium text-earth-900">{selectedReq.pickupAddress}, {selectedReq.city} - {selectedReq.pincode}</span>
              </div>

              <div className="p-3 bg-sand-50 rounded-xl border border-sand-200">
                <span className="text-[10px] uppercase font-bold text-earth-400 block">Designated Recycler</span>
                <span className="font-medium text-earth-900">{selectedReq.assignedRecyclerName || 'EcoCycle Technologies Hub'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-sand-200">
              <span className="label mb-3 block">Milestone History</span>
              <TrackingTimeline timeline={selectedReq.timeline} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
