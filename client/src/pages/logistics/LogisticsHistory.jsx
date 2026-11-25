import React, { useState, useEffect } from 'react';
import { logisticsApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { CheckSquare, Truck, Award, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LogisticsHistory() {
  const [completedTrips, setCompletedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const res = await logisticsApi.getPickups();
        const list = res.pickups || [];
        const completed = list.filter((r) =>
          ['collected', 'in_recycling', 'recycling_in_progress', 'completed'].includes(r.status) ||
          r.logisticsStatus === 'delivered'
        );
        setCompletedTrips(completed);
      } catch (err) {
        toast.error(err.message || 'Failed to load trip history');
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed Trip History"
        subtitle="Archived log of executed doorstep collections and verified recycler facility deliveries."
        badge={`${completedTrips.length} Completed Missions`}
      />

      <div className="card overflow-hidden bg-white border border-sand-300 shadow-card">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4">
              <LoadingSkeleton type="table" count={4} />
            </div>
          ) : completedTrips.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={CheckSquare}
                title="No completed trips recorded yet"
                description="Completed doorstep collections and facility deliveries will appear in this ledger."
              />
            </div>
          ) : (
            <table className="w-full text-left text-xs text-earth-800">
              <thead className="bg-sand-50 border-b border-sand-200 text-earth-900 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Trip ID</th>
                  <th className="py-3.5 px-4">Customer & Location</th>
                  <th className="py-3.5 px-4">Equipment & Payload</th>
                  <th className="py-3.5 px-4">Completion Status</th>
                  <th className="py-3.5 px-4">Delivered To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200/80">
                {completedTrips.map((req) => {
                  const reqId = req._id || req.id;
                  const shortId = reqId ? reqId.toString().slice(-6).toUpperCase() : 'TRIP';
                  const userName = req.user?.name || req.userName || 'Citizen User';
                  const city = req.city || req.user?.city || 'Bengaluru';
                  const devName = req.deviceName || req.items?.[0]?.itemName || req.category || 'Electronic Item';
                  const weight = req.weight || req.estimatedWeight || '1.0';
                  const recycler = req.recycler?.companyName || req.recycler?.name || req.assignedRecyclerName || 'EcoCycle Technologies';

                  return (
                    <tr key={reqId} className="hover:bg-sand-50/60 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-forest-900">
                        #{shortId}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-earth-950">{userName}</div>
                        <div className="text-[11px] text-earth-500">{city}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-earth-900">{devName}</div>
                        <div className="text-[11px] text-earth-500">{weight} kg payload</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={req.status} size="xs" />
                      </td>
                      <td className="py-4 px-4 text-earth-700">
                        {recycler}
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
  );
}
