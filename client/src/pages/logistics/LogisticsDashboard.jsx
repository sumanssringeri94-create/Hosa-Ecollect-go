import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logisticsApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  Truck,
  Calendar,
  CheckSquare,
  Clock,
  MapPin,
  ArrowRight,
  Package,
  Zap,
  Phone,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LogisticsDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todaysPickups: 0,
    upcomingCollections: 0,
    completedPickups: 0,
    pendingDeliveries: 0,
  });
  const [driverRequests, setDriverRequests] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashRes, pickupsRes] = await Promise.all([
        logisticsApi.getDashboard().catch(() => ({ stats: {} })),
        logisticsApi.getPickups().catch(() => ({ pickups: [] })),
      ]);

      if (dashRes && dashRes.stats) {
        setStats(dashRes.stats);
      }
      setDriverRequests(pickupsRes.pickups || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load fleet dashboard');
    } finally {
      setLoading(false);
    }
  };

  const activePickup = driverRequests.find((r) =>
    ['pickup_scheduled', 'scheduled', 'collected'].includes(r.status) || r.logisticsStatus === 'in_transit'
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Fleet Dispatch — ${user?.name || 'Logistics Fleet'}`}
        subtitle={`Zero-emission electric collection unit • ${user?.vehicleType || 'Tata Ace EV (KA-03-EV-1029)'}`}
        badge="Zero-Emission Fleet"
        actions={
          <Link to="/logistics/delivery" className="btn-primary text-xs py-2 px-3.5 shadow-sm">
            <MapPin size={14} /> Open Route Map
          </Link>
        }
      />

      {/* 4 Stat Cards */}
      {loading ? (
        <LoadingSkeleton type="stat" count={4} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            icon={Calendar}
            label="Today's Assigned Pickups"
            value={stats.todaysPickups || 0}
            trend="Indiranagar Corridor"
            colorScheme="olive"
          />
          <StatCard
            icon={Clock}
            label="Upcoming Collections"
            value={stats.upcomingCollections || driverRequests.length}
            subtext="Next 48 hours"
            colorScheme="sand"
          />
          <StatCard
            icon={CheckSquare}
            label="Completed Pickups"
            value={stats.completedPickups || 0}
            trend="Certified Deliveries"
            colorScheme="forest"
          />
          <StatCard
            icon={Truck}
            label="Pending Deliveries"
            value={stats.pendingDeliveries || 0}
            subtext="Dock handoffs queued"
            colorScheme="terracotta"
          />
        </div>
      )}

      {/* Active Trip Banner */}
      {activePickup && (
        <div className="card p-6 bg-gradient-to-r from-olive-900 to-forest-950 text-sand-50 relative overflow-hidden shadow-elevated">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="badge badge-terracotta text-[10px] font-bold">
                  Active Collection Waypoint
                </span>
                <span className="font-mono text-xs text-sand-300">
                  #{(activePickup._id || activePickup.id || '').toString().slice(-6).toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold font-sans text-white">
                {activePickup.deviceName || activePickup.items?.[0]?.itemName || activePickup.category} ({activePickup.weight || activePickup.estimatedWeight || '1.0'} kg)
              </h3>
              <p className="text-xs text-sand-300 leading-relaxed">
                Customer: <strong className="text-white">{activePickup.user?.name || activePickup.userName || 'Citizen'}</strong> ({activePickup.user?.phone || activePickup.userPhone || '—'}) <br />
                Address: {activePickup.address || activePickup.pickupAddress}, {activePickup.city || activePickup.user?.city} - {activePickup.pincode || '560001'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/logistics/delivery"
                className="btn-accent text-xs py-2.5 px-5 shadow-sm"
              >
                <MapPin size={14} /> Navigate & Update Status
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Today's Collection Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-earth-950 font-sans">
            Doorstep Collection Schedule
          </h3>
          <Link
            to="/logistics/pickups"
            className="text-xs font-semibold text-forest-800 hover:underline flex items-center gap-1"
          >
            All Assigned ({driverRequests.length}) <ArrowRight size={13} />
          </Link>
        </div>

        <div className="card overflow-hidden bg-white border border-sand-300 shadow-card">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-4">
                <LoadingSkeleton type="table" count={4} />
              </div>
            ) : driverRequests.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No assigned pickups in your queue"
                  description="When an administrator assigns doorstep collection requests to your fleet, they will appear here."
                />
              </div>
            ) : (
              <table className="w-full text-left text-xs text-earth-800">
                <thead className="bg-sand-50 border-b border-sand-200 text-earth-900 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Request ID</th>
                    <th className="py-3.5 px-4">Customer & Address</th>
                    <th className="py-3.5 px-4">Device Items</th>
                    <th className="py-3.5 px-4">Time Window</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Dispatch Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200/80">
                  {driverRequests.map((req) => {
                    const reqId = req._id || req.id;
                    const shortId = reqId ? reqId.toString().slice(-6).toUpperCase() : 'REQ';
                    const userName = req.user?.name || req.userName || 'Citizen';
                    const address = req.address || req.pickupAddress || 'Address on file';
                    const deviceName = req.deviceName || req.items?.[0]?.itemName || req.category || 'Electronic Item';
                    const weight = req.weight || req.estimatedWeight || '1.0';
                    const condition = req.condition || req.items?.[0]?.condition || 'Standard';
                    const schedDate = req.scheduledDate ? new Date(req.scheduledDate).toLocaleDateString() : (req.preferredDate || 'Scheduled');
                    const slot = req.timeSlot || req.preferredTime || '10:00 AM - 01:00 PM';

                    return (
                      <tr key={reqId} className="hover:bg-sand-50/60 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-forest-900">
                          #{shortId}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-earth-950">{userName}</div>
                          <div className="text-[11px] text-earth-500 truncate max-w-xs">{address}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-earth-900 truncate max-w-xs">{deviceName}</div>
                          <div className="text-[11px] text-earth-500">{weight} kg • {condition}</div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-earth-600">
                          {schedDate} ({slot})
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <StatusBadge status={req.status} size="xs" />
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <Link
                            to="/logistics/delivery"
                            className="btn-secondary text-[11px] py-1 px-3"
                          >
                            Navigate
                          </Link>
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
    </div>
  );
}
