import React from 'react';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { Clock, Calendar, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LogisticsSchedule() {
  const requests = storageService.getRequests();
  const driverRequests = requests.filter(
    (r) => r.assignedLogisticsId === 'log-1' || r.assignedLogisticsName?.includes('GreenRoute') || !r.assignedLogisticsId
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet Collection Schedule"
        subtitle="Chronological agenda of doorstep pickup windows and transit schedules."
        badge={`${driverRequests.length} Scheduled`}
      />

      <div className="space-y-4">
        {driverRequests.map((req) => (
          <div
            key={req.id}
            className="card p-6 bg-white border border-sand-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-forest-900 bg-sand-100 px-2 py-0.5 rounded">
                  {req.id}
                </span>
                <span className="badge badge-sand text-[11px] font-semibold">
                  {req.preferredDate} • {req.preferredTime}
                </span>
                <StatusBadge status={req.status} size="xs" />
              </div>

              <h4 className="text-base font-bold text-earth-950 font-sans">{req.deviceName}</h4>
              <p className="text-xs text-earth-600">
                Customer: <strong className="text-earth-900">{req.userName}</strong> ({req.userPhone})
              </p>
              <div className="text-xs text-earth-500 flex items-center gap-1.5">
                <MapPin size={13} className="text-terracotta-600 shrink-0" />
                <span>{req.pickupAddress}, {req.city}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/logistics/delivery"
                className="btn-primary text-xs py-2 px-4 shadow-xs"
              >
                Navigate to Waypoint <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
