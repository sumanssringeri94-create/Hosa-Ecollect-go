import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { Truck, Scale, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecyclerIncoming() {
  const [requests, setRequests] = useState(storageService.getRequests());

  // Incoming shipments either scheduled or in collection
  const incoming = requests.filter((r) => ['scheduled', 'collected'].includes(r.status));

  const handleConfirmIntake = (req) => {
    storageService.updateRequestStatus(
      req.id,
      'in_recycling',
      `Dock check-in complete. Calibrated gross intake weight verified at ${req.weight} kg. Disassembly started.`,
      'EcoCycle Dock Team'
    );
    toast.success(`Check-in complete for ${req.id}! Moved to Recycling Bench.`);
    setRequests(storageService.getRequests());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incoming E-Waste Shipments"
        subtitle="Dock reception, custody transfer handoff from electric delivery fleets, and initial scale verification."
        badge={`${incoming.length} Shipments`}
      />

      {incoming.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No shipments currently inbound"
          description="When logistics couriers collect e-waste from citizens and route to your facility, they will appear here for dock check-in."
        />
      ) : (
        <div className="space-y-4">
          {incoming.map((item) => (
            <div
              key={item.id}
              className="card p-6 bg-white border border-sand-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-forest-900 bg-sand-100 px-2 py-0.5 rounded">
                    {item.id}
                  </span>
                  <StatusBadge status={item.status} size="xs" />
                </div>
                <h4 className="text-base font-bold text-earth-950 font-sans">{item.deviceName}</h4>
                <p className="text-xs text-earth-600">
                  Shipped by: <strong className="text-earth-900">{item.assignedLogisticsName || 'GreenRoute EV'}</strong> • Vehicle: {item.assignedLogisticsVehicle || 'Electric Van'}
                </p>
                <div className="text-[11px] text-earth-500">
                  Manifest Estimated Weight: <strong className="text-earth-900">{item.weight} kg</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleConfirmIntake(item)}
                  className="btn-primary text-xs py-2 px-4 shadow-sm"
                >
                  <Scale size={14} /> Verify Weight & Check-In
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
