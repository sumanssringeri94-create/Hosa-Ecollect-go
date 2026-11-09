import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { CheckSquare, ShieldCheck, Factory, Truck, Calendar, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAssignments() {
  const [requests, setRequests] = useState(storageService.getRequests());
  const recyclers = storageService.getRecyclers();
  const logistics = storageService.getLogistics();

  // Requests that need partner assignment
  const unassignedRequests = requests.filter((r) => ['submitted', 'verified'].includes(r.status));

  const [assignments, setAssignments] = useState({});

  const handleSelectPartner = (reqId, field, value) => {
    setAssignments({
      ...assignments,
      [reqId]: {
        ...assignments[reqId],
        [field]: value,
      },
    });
  };

  const handleExecuteAssignment = (req) => {
    const assignedData = assignments[req.id] || {};
    const chosenRecyclerId = assignedData.recyclerId || recyclers[0]?.id;
    const chosenLogisticsId = assignedData.logisticsId || logistics[0]?.id;

    const chosenRecycler = recyclers.find((r) => r.id === chosenRecyclerId);
    const chosenLogistics = logistics.find((l) => l.id === chosenLogisticsId);

    storageService.assignPartners(req.id, {
      recyclerId: chosenRecycler?.id,
      recyclerName: chosenRecycler?.companyName || chosenRecycler?.name,
      logisticsId: chosenLogistics?.id,
      logisticsName: chosenLogistics?.name + ' (' + chosenLogistics?.company + ')',
      pickupDate: req.preferredDate,
      timeSlot: req.preferredTime,
      notes: 'Quick-assigned via Admin Workbench Matrix.',
    });

    toast.success(`Allocated ${req.id} to ${chosenRecycler?.companyName} & ${chosenLogistics?.name}!`);
    setRequests(storageService.getRequests());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Custody Assignment Matrix"
        subtitle="Quick-match unallocated pickup requests with verified processing labs and available zero-emission couriers."
        badge={`${unassignedRequests.length} Pending Allocation`}
      />

      {unassignedRequests.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="All collection requests are assigned"
          description="Every incoming e-waste request currently has an authorized recycler and designated courier paired."
        />
      ) : (
        <div className="space-y-4">
          {unassignedRequests.map((req) => {
            const currentAssignment = assignments[req.id] || {};
            return (
              <div
                key={req.id}
                className="card p-6 bg-white border border-sand-300 space-y-4 hover:border-sand-400 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-sand-200">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-forest-900 bg-sand-100 px-2.5 py-1 rounded-lg">
                      {req.id}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-earth-950 font-sans">{req.deviceName}</h4>
                      <p className="text-xs text-earth-500">
                        {req.userName} • {req.city} ({req.pickupAddress})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-earth-500">
                      Weight: <strong className="text-earth-900">{req.weight} kg</strong>
                    </span>
                    <StatusBadge status={req.status} size="xs" />
                  </div>
                </div>

                {/* Assignment Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5">
                    <label className="label text-[11px] mb-1">Pair with Recycler Facility *</label>
                    <select
                      value={currentAssignment.recyclerId || ''}
                      onChange={(e) => handleSelectPartner(req.id, 'recyclerId', e.target.value)}
                      className="input py-2 text-xs cursor-pointer"
                    >
                      <option value="">Choose Recycler Facility...</option>
                      {recyclers.map((rec) => (
                        <option key={rec.id} value={rec.id}>
                          {rec.companyName} ({rec.location}) • {rec.verified ? 'Verified' : 'Pending'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="label text-[11px] mb-1">Assign Green Courier *</label>
                    <select
                      value={currentAssignment.logisticsId || ''}
                      onChange={(e) => handleSelectPartner(req.id, 'logisticsId', e.target.value)}
                      className="input py-2 text-xs cursor-pointer"
                    >
                      <option value="">Choose Logistics Fleet...</option>
                      {logistics.map((log) => (
                        <option key={log.id} value={log.id}>
                          {log.name} — {log.company} ({log.vehicleType})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 pt-5">
                    <button
                      type="button"
                      onClick={() => handleExecuteAssignment(req)}
                      className="btn-primary w-full text-xs py-2 px-3 justify-center shadow-xs"
                    >
                      Allocate <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
