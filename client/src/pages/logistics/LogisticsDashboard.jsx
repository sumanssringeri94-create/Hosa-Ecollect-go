import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
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

export default function LogisticsDashboard() {
  const { user } = useAuth();
  const allRequests = storageService.getRequests();

  // Pickups assigned to this driver / GreenRoute EV fleet
  const driverRequests = allRequests.filter(
    (r) => r.assignedLogisticsId === 'log-1' || r.assignedLogisticsName?.includes('GreenRoute') || !r.assignedLogisticsId
  );

  const todaysPickups = driverRequests.filter((r) => ['assigned', 'scheduled'].includes(r.status));
  const activePickup = driverRequests.find((r) => ['scheduled', 'collected'].includes(r.status));
  const completedTrips = driverRequests.filter((r) => ['collected', 'in_recycling', 'completed'].includes(r.status));
  const pendingRecyclerDeliveries = driverRequests.filter((r) => r.status === 'collected');

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Fleet Dispatch — ${user?.name || 'Ravi Kumar'}`}
        subtitle={`Zero-emission electric collection unit • ${user?.vehicle || 'Tata Ace EV (KA-03-EV-1029)'}`}
        badge="Zero-Emission Fleet"
        actions={
          <Link to="/logistics/delivery" className="btn-primary text-xs py-2 px-3.5 shadow-sm">
            <MapPin size={14} /> Open Route Map
          </Link>
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Today's Assigned Pickups"
          value={todaysPickups.length}
          trend="Indiranagar Corridor"
          colorScheme="olive"
        />
        <StatCard
          icon={Clock}
          label="Upcoming Collections"
          value={driverRequests.length}
          subtext="Next 48 hours"
          colorScheme="sand"
        />
        <StatCard
          icon={CheckSquare}
          label="Completed Pickups"
          value={completedTrips.length}
          trend="+184 All Time"
          colorScheme="forest"
        />
        <StatCard
          icon={Truck}
          label="Pending Deliveries"
          value={pendingRecyclerDeliveries.length}
          subtext="Dock handoffs queued"
          colorScheme="terracotta"
        />
      </div>

      {/* Active Trip Banner */}
      {activePickup && (
        <div className="card p-6 bg-gradient-to-r from-olive-900 to-forest-950 text-sand-50 relative overflow-hidden shadow-elevated">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="badge badge-terracotta text-[10px] font-bold">
                  Active Collection Waypoint
                </span>
                <span className="font-mono text-xs text-sand-300">{activePickup.id}</span>
              </div>
              <h3 className="text-xl font-bold font-sans text-white">
                {activePickup.deviceName} ({activePickup.weight} kg)
              </h3>
              <p className="text-xs text-sand-300 leading-relaxed">
                Customer: <strong className="text-white">{activePickup.userName}</strong> ({activePickup.userPhone}) <br />
                Address: {activePickup.pickupAddress}, {activePickup.city} - {activePickup.pincode}
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
                {driverRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-sand-50/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-forest-900">
                      {req.id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-earth-950">{req.userName}</div>
                      <div className="text-[11px] text-earth-500 truncate max-w-xs">{req.pickupAddress}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-earth-900 truncate max-w-xs">{req.deviceName}</div>
                      <div className="text-[11px] text-earth-500">{req.weight} kg • {req.condition}</div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-earth-600">
                      {req.preferredDate} ({req.preferredTime})
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
