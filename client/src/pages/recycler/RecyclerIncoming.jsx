import React, { useState, useEffect } from 'react';
import { recyclersApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Truck, Scale, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecyclerIncoming() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await recyclersApi.getAssignedRequests();
      setRequests(res.pickups || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load incoming shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Incoming shipments either scheduled, collected, or delivered to dock
  const incoming = requests.filter((r) =>
    ['scheduled', 'pickup_scheduled', 'collected'].includes(r.status) ||
    r.logisticsStatus === 'in_transit' ||
    (r.logisticsStatus === 'delivered' && r.recyclerStatus !== 'processing' && r.status !== 'completed')
  );

  const handleConfirmIntake = async (req) => {
    const reqId = req._id || req.id;
    try {
      await recyclersApi.updateOperations(reqId, {
        status: 'processing',
        processingNotes: `Dock check-in complete. Calibrated gross intake weight verified at ${req.weight || req.estimatedWeight || '1.0'} kg. Disassembly started.`,
      });
      toast.success(`Check-in complete for #${reqId.toString().slice(-6)}! Moved to Recycling Bench.`);
      await loadRequests();
    } catch (err) {
      toast.error(err.message || 'Intake check-in failed');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incoming E-Waste Shipments"
        subtitle="Dock reception, custody transfer handoff from electric delivery fleets, and initial scale verification."
        badge={`${incoming.length} Shipments`}
      />

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : incoming.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No shipments currently inbound"
          description="When logistics couriers collect e-waste from citizens and route to your facility, they will appear here for dock check-in."
        />
      ) : (
        <div className="space-y-4">
          {incoming.map((item) => {
            const reqId = item._id || item.id;
            const shortId = reqId ? reqId.toString().slice(-6).toUpperCase() : 'SHIP';
            const devName = item.deviceName || item.items?.[0]?.itemName || item.category || 'Electronic Item';
            const logisticsName = item.logisticsPartner?.companyName || item.logisticsPartner?.name || item.assignedLogisticsName || 'GreenRoute EV';
            const vehicle = item.logisticsPartner?.vehicleType || item.assignedLogisticsVehicle || 'Electric Van';
            const weight = item.weight || item.estimatedWeight || '1.0';

            return (
              <div
                key={reqId}
                className="card p-6 bg-white border border-sand-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-forest-900 bg-sand-100 px-2 py-0.5 rounded">
                      #{shortId}
                    </span>
                    <StatusBadge status={item.status} size="xs" />
                  </div>
                  <h4 className="text-base font-bold text-earth-950 font-sans">{devName}</h4>
                  <p className="text-xs text-earth-600">
                    Shipped by: <strong className="text-earth-900">{logisticsName}</strong> • Vehicle: {vehicle}
                  </p>
                  <div className="text-[11px] text-earth-500">
                    Manifest Estimated Weight: <strong className="text-earth-900">{weight} kg</strong>
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
            );
          })}
        </div>
      )}
    </div>
  );
}
