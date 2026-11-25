import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { pickupsApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Modal from '../../components/common/Modal';
import TrackingTimeline from '../../components/common/TrackingTimeline';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Package,
  CalendarPlus,
  Eye,
  Calendar,
  MapPin,
  Truck,
  Factory,
  Compass,
  FileText,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyPickups() {
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const res = await pickupsApi.getMyPickups();
      if (res.success) {
        setPickups(res.pickups || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load pickups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleCancelPickup = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this pickup request?')) return;
    try {
      setIsCancelling(true);
      const res = await pickupsApi.cancelPickup(id);
      if (res.success) {
        toast.success('Pickup cancelled successfully');
        setSelectedRequest(null);
        fetchPickups();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel pickup');
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredRequests = pickups.filter((r) => {
    const idStr = (r._id || r.id || '').toLowerCase();
    const devName = (r.deviceName || '').toLowerCase();
    const cat = (r.category || '').toLowerCase();
    const q = searchTerm.toLowerCase();

    const matchesSearch = idStr.includes(q) || devName.includes(q) || cat.includes(q);
    const matchesStatus =
      statusFilter === 'all' ||
      r.status === statusFilter ||
      (statusFilter === 'submitted' && r.status === 'pending') ||
      (statusFilter === 'scheduled' && r.status === 'pickup_scheduled') ||
      (statusFilter === 'in_recycling' && r.status === 'recycling_in_progress');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Pickup Requests"
        subtitle="Manage and review all your electronic equipment collections."
        badge={`${pickups.length} Total`}
        actions={
          <Link to="/user/schedule" className="btn-primary text-xs py-2.5 px-4 shadow-sm">
            <CalendarPlus size={15} /> Book New Pickup
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white border border-sand-300 flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by Request ID or device name..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            allLabel="All Statuses"
            options={[
              { value: 'pending', label: 'Submitted / Pending' },
              { value: 'verified', label: 'Verified' },
              { value: 'assigned', label: 'Partners Assigned' },
              { value: 'pickup_scheduled', label: 'Pickup Scheduled' },
              { value: 'collected', label: 'Collected' },
              { value: 'recycling_in_progress', label: 'In Recycling' },
              { value: 'completed', label: 'Completed' },
            ]}
            className="w-full sm:w-48"
          />
        </div>
      </div>

      {/* Table / Responsive Card List */}
      {loading ? (
        <LoadingSkeleton type="table" count={4} />
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          title="No pickup requests found"
          description="You don't have any requests matching your filters. Book a free doorstep collection today!"
          actionLabel="Schedule a Pickup"
          onAction={() => (window.location.href = '/user/schedule')}
        />
      ) : (
        <div className="card overflow-hidden bg-white border border-sand-300 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-earth-800">
              <thead className="bg-sand-50 border-b border-sand-200 text-earth-900 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Request ID</th>
                  <th className="py-3.5 px-4">Device & Category</th>
                  <th className="py-3.5 px-4">Scheduled Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Recycler</th>
                  <th className="py-3.5 px-4">Assigned Courier</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {filteredRequests.map((req) => (
                  <tr key={req._id || req.id} className="hover:bg-sand-50/60 transition-colors">
                    {/* Request ID */}
                    <td className="py-4 px-4 font-mono font-bold text-forest-900">
                      #{req._id ? req._id.slice(-6) : req.id}
                    </td>

                    {/* Device & Category */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-earth-950 truncate max-w-xs">
                        {req.deviceName}
                      </div>
                      <div className="text-[11px] text-earth-500 mt-0.5">
                        {req.category} • {req.weight || '1.5 kg'} ({req.condition || 'Used'})
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-earth-600">
                      <div>{new Date(req.scheduledDate || req.createdAt || Date.now()).toLocaleDateString()}</div>
                      <div className="text-[10px] text-earth-400">{req.timeSlot}</div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={req.status} size="xs" />
                    </td>

                    {/* Recycler */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {req.recycler ? (
                        <div className="flex items-center gap-1.5 text-earth-800">
                          <Factory size={13} className="text-forest-700 shrink-0" />
                          <span className="truncate max-w-[140px] font-medium">
                            {req.recycler.companyName || req.recycler.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-earth-400 italic text-[11px]">Pending assignment</span>
                      )}
                    </td>

                    {/* Logistics */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {req.logisticsPartner ? (
                        <div className="flex items-center gap-1.5 text-earth-800">
                          <Truck size={13} className="text-olive-700 shrink-0" />
                          <span className="truncate max-w-[140px] font-medium">
                            {req.logisticsPartner.companyName || req.logisticsPartner.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-earth-400 italic text-[11px]">Pending assignment</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(req)}
                          className="btn-secondary text-[11px] py-1.5 px-3"
                          title="View Full Details"
                        >
                          <Eye size={13} /> View Details
                        </button>

                        <Link
                          to="/user/track"
                          className="btn-ghost text-[11px] py-1.5 px-2.5 text-forest-800 hover:text-forest-950"
                          title="Track Timeline"
                        >
                          <Compass size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Request #${selectedRequest._id ? selectedRequest._id.slice(-6) : selectedRequest.id} Details`}
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-sand-200">
              <div>
                <h3 className="font-bold text-lg text-earth-900">{selectedRequest.deviceName}</h3>
                <p className="text-xs text-earth-500">{selectedRequest.category}</p>
              </div>
              <StatusBadge status={selectedRequest.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-sand-50 rounded-xl space-y-1">
                <span className="text-earth-400 font-semibold uppercase text-[10px]">Pickup Location</span>
                <p className="font-medium text-earth-900">{selectedRequest.address}, {selectedRequest.city}</p>
              </div>

              <div className="p-3 bg-sand-50 rounded-xl space-y-1">
                <span className="text-earth-400 font-semibold uppercase text-[10px]">Date & Time Slot</span>
                <p className="font-medium text-earth-900">
                  {new Date(selectedRequest.scheduledDate || Date.now()).toLocaleDateString()} • {selectedRequest.timeSlot}
                </p>
              </div>

              <div className="p-3 bg-sand-50 rounded-xl space-y-1">
                <span className="text-earth-400 font-semibold uppercase text-[10px]">Assigned Recycler</span>
                <p className="font-medium text-earth-900">
                  {selectedRequest.recycler?.companyName || selectedRequest.recycler?.name || 'Awaiting assignment'}
                </p>
              </div>

              <div className="p-3 bg-sand-50 rounded-xl space-y-1">
                <span className="text-earth-400 font-semibold uppercase text-[10px]">Assigned Logistics</span>
                <p className="font-medium text-earth-900">
                  {selectedRequest.logisticsPartner?.companyName || selectedRequest.logisticsPartner?.name || 'Awaiting assignment'}
                </p>
              </div>
            </div>

            {selectedRequest.notes && (
              <div className="p-3 bg-sand-50 rounded-xl text-xs space-y-1">
                <span className="text-earth-400 font-semibold uppercase text-[10px]">Customer Notes</span>
                <p className="text-earth-700 italic">"{selectedRequest.notes}"</p>
              </div>
            )}

            {/* Cancel Action if pending/verified */}
            {['pending', 'verified', 'assigned'].includes(selectedRequest.status) && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={() => handleCancelPickup(selectedRequest._id || selectedRequest.id)}
                  className="btn-outline text-red-600 border-red-200 hover:bg-red-50 text-xs py-2 px-4"
                >
                  <XCircle size={14} /> {isCancelling ? 'Cancelling...' : 'Cancel Pickup Request'}
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
