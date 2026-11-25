import React, { useState, useEffect } from 'react';
import { pickupsApi, adminApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { CheckSquare, ShieldCheck, Factory, Truck, Calendar, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAssignments() {
  const [requests, setRequests] = useState([]);
  const [recyclers, setRecyclers] = useState([]);
  const [logistics, setLogistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      const [pickupsRes, recyclersRes, logisticsRes] = await Promise.all([
        pickupsApi.getAllPickups(),
        adminApi.getRecyclers().catch(() => ({ recyclers: [] })),
        adminApi.getLogistics().catch(() => ({ partners: [] })),
      ]);

      const allPickups = pickupsRes.pickups || [];
      setRequests(allPickups);
      setRecyclers(recyclersRes.recyclers || []);
      setLogistics(logisticsRes.partners || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load assignment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter requests that need partner assignment (pending or verified)
  const unassignedRequests = requests.filter(
    (r) => r.status === 'pending' || r.status === 'submitted' || r.status === 'verified'
  );

  const handleSelectPartner = (reqId, field, value) => {
    setAssignments((prev) => ({
      ...prev,
      [reqId]: {
        ...prev[reqId],
        [field]: value,
      },
    }));
  };

  const handleExecuteAssignment = async (req) => {
    const reqId = req._id || req.id;
    const assignedData = assignments[reqId] || {};
    const chosenRecyclerId = assignedData.recyclerId || recyclers[0]?._id || recyclers[0]?.id;
    const chosenLogisticsId = assignedData.logisticsId || logistics[0]?._id || logistics[0]?.id;

    if (!chosenRecyclerId || !chosenLogisticsId) {
      toast.error('Please ensure both a recycler and a logistics partner are selected.');
      return;
    }

    try {
      await pickupsApi.assignRecycler(reqId, chosenRecyclerId);
      await pickupsApi.assignLogistics(reqId, {
        logisticsId: chosenLogisticsId,
        scheduledDate: req.preferredDate || new Date().toISOString().split('T')[0],
        timeSlot: req.preferredTime || '10:00 AM - 01:00 PM',
      });

      toast.success(`Allocated #${reqId.toString().slice(-6)} to partners!`);
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Allocation failed');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Custody Assignment Matrix"
        subtitle="Quick-match unallocated pickup requests with verified processing labs and available zero-emission couriers."
        badge={`${unassignedRequests.length} Pending Allocation`}
      />

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : unassignedRequests.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="All collection requests are assigned"
          description="Every incoming e-waste request currently has an authorized recycler and designated courier paired."
        />
      ) : (
        <div className="space-y-4">
          {unassignedRequests.map((req) => {
            const reqId = req._id || req.id;
            const currentAssignment = assignments[reqId] || {};
            const devName = req.deviceName || req.items?.[0]?.itemName || req.category || 'Electronic Item';
            const userName = req.user?.name || req.userName || 'Citizen User';
            const city = req.user?.city || req.city || 'Bengaluru';
            const address = req.address || req.pickupAddress || 'Address on file';
            const weight = req.weight || req.estimatedWeight || '1.0';

            return (
              <div
                key={reqId}
                className="card p-6 bg-white border border-sand-300 space-y-4 hover:border-sand-400 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-sand-200">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-forest-900 bg-sand-100 px-2.5 py-1 rounded-lg">
                      #{reqId.toString().slice(-6).toUpperCase()}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-earth-950 font-sans">{devName}</h4>
                      <p className="text-xs text-earth-500">
                        {userName} • {city} ({address})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-earth-500">
                      Weight: <strong className="text-earth-900">{weight} kg</strong>
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
                      onChange={(e) => handleSelectPartner(reqId, 'recyclerId', e.target.value)}
                      className="input py-2 text-xs cursor-pointer"
                    >
                      <option value="">Choose Recycler Facility...</option>
                      {recyclers.map((rec) => {
                        const recId = rec._id || rec.id;
                        const cName = rec.companyName || rec.name;
                        const loc = rec.location || rec.city || 'Bengaluru';
                        const isVer = rec.isVerified || rec.verified;
                        return (
                          <option key={recId} value={recId}>
                            {cName} ({loc}) • {isVer ? 'Verified' : 'Pending'}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="label text-[11px] mb-1">Assign Green Courier *</label>
                    <select
                      value={currentAssignment.logisticsId || ''}
                      onChange={(e) => handleSelectPartner(reqId, 'logisticsId', e.target.value)}
                      className="input py-2 text-xs cursor-pointer"
                    >
                      <option value="">Choose Logistics Fleet...</option>
                      {logistics.map((log) => {
                        const logId = log._id || log.id;
                        const lName = log.name;
                        const cName = log.companyName || log.company;
                        const vType = log.vehicleType || 'EV';
                        return (
                          <option key={logId} value={logId}>
                            {lName} — {cName} ({vType})
                          </option>
                        );
                      })}
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
