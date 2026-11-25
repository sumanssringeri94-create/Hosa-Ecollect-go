import React, { useState, useEffect } from 'react';
import { logisticsApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Clock, Calendar, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function LogisticsSchedule() {
  const [driverRequests, setDriverRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setLoading(true);
        const res = await logisticsApi.getPickups();
        setDriverRequests(res.pickups || []);
      } catch (err) {
        toast.error(err.message || 'Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };
    loadSchedule();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet Collection Schedule"
        subtitle="Chronological agenda of doorstep pickup windows and transit schedules."
        badge={`${driverRequests.length} Scheduled`}
      />

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : driverRequests.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No scheduled collections"
          description="Upcoming pickups assigned to your fleet will appear on this schedule."
        />
      ) : (
        <div className="space-y-4">
          {driverRequests.map((req) => {
            const reqId = req._id || req.id;
            const shortId = reqId ? reqId.toString().slice(-6).toUpperCase() : 'REQ';
            const devName = req.deviceName || req.items?.[0]?.itemName || req.category || 'Electronic Item';
            const userName = req.user?.name || req.userName || 'Citizen User';
            const userPhone = req.user?.phone || req.userPhone || '—';
            const address = req.address || req.pickupAddress || 'Address on file';
            const city = req.city || req.user?.city || 'Bengaluru';
            const schedDate = req.scheduledDate ? new Date(req.scheduledDate).toLocaleDateString() : (req.preferredDate || 'Scheduled');
            const timeSlot = req.timeSlot || req.preferredTime || '10:00 AM - 01:00 PM';

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
                    <span className="badge badge-sand text-[11px] font-semibold">
                      {schedDate} • {timeSlot}
                    </span>
                    <StatusBadge status={req.status} size="xs" />
                  </div>

                  <h4 className="text-base font-bold text-earth-950 font-sans">{devName}</h4>
                  <p className="text-xs text-earth-600">
                    Customer: <strong className="text-earth-900">{userName}</strong> ({userPhone})
                  </p>
                  <div className="text-xs text-earth-500 flex items-center gap-1.5">
                    <MapPin size={13} className="text-terracotta-600 shrink-0" />
                    <span>{address}, {city}</span>
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
            );
          })}
        </div>
      )}
    </div>
  );
}
