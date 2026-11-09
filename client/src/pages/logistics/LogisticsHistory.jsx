import React from 'react';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { CheckSquare, Truck, Award, Calendar } from 'lucide-react';

export default function LogisticsHistory() {
  const requests = storageService.getRequests();
  const completedTrips = requests.filter(
    (r) => ['collected', 'in_recycling', 'completed'].includes(r.status)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed Trip History"
        subtitle="Archived log of executed doorstep collections and verified recycler facility deliveries."
        badge={`${completedTrips.length} Completed Missions`}
      />

      <div className="card overflow-hidden bg-white border border-sand-300 shadow-card">
        <div className="overflow-x-auto">
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
              {completedTrips.map((req) => (
                <tr key={req.id} className="hover:bg-sand-50/60 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-forest-900">
                    {req.id}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-earth-950">{req.userName}</div>
                    <div className="text-[11px] text-earth-500">{req.city}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-earth-900">{req.deviceName}</div>
                    <div className="text-[11px] text-earth-500">{req.weight} kg payload</div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <StatusBadge status={req.status} size="xs" />
                  </td>
                  <td className="py-4 px-4 text-earth-700">
                    {req.assignedRecyclerName || 'EcoCycle Technologies'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
