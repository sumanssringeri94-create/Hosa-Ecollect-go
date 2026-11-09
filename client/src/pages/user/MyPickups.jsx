import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Modal from '../../components/common/Modal';
import TrackingTimeline from '../../components/common/TrackingTimeline';
import EmptyState from '../../components/common/EmptyState';
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
  ExternalLink,
} from 'lucide-react';

export default function MyPickups() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const allRequests = storageService.getRequests();
  const userRequests = allRequests.filter(
    (r) => r.userId === user?.id || r.userEmail === user?.email || user?.role === 'user'
  );

  const filteredRequests = userRequests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Pickup Requests"
        subtitle="Manage and review all your electronic equipment collections."
        badge={`${userRequests.length} Total`}
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
              { value: 'submitted', label: 'Submitted' },
              { value: 'verified', label: 'Verified' },
              { value: 'assigned', label: 'Partners Assigned' },
              { value: 'scheduled', label: 'Pickup Scheduled' },
              { value: 'collected', label: 'Collected' },
              { value: 'in_recycling', label: 'In Recycling' },
              { value: 'completed', label: 'Completed' },
            ]}
            className="w-full sm:w-48"
          />
        </div>
      </div>

      {/* Table / Responsive Card List */}
      {filteredRequests.length === 0 ? (
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
                  <th className="py-3.5 px-4">Preferred Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Recycler</th>
                  <th className="py-3.5 px-4">Assigned Courier</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-sand-50/60 transition-colors">
                    {/* Request ID */}
                    <td className="py-4 px-4 font-mono font-bold text-forest-900">
                      {req.id}
                    </td>

                    {/* Device & Category */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-earth-950 truncate max-w-xs">
                        {req.deviceName}
                      </div>
                      <div className="text-[11px] text-earth-500 mt-0.5">
                        {req.category} • {req.weight} kg ({req.condition})
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-earth-600">
                      <div>{req.preferredDate}</div>
                      <div className="text-[10px] text-earth-400">{req.preferredTime}</div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={req.status} size="xs" />
                    </td>

                    {/* Recycler */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {req.assignedRecyclerName ? (
                        <div className="flex items-center gap-1.5 text-earth-800">
                          <Factory size={13} className="text-forest-700 shrink-0" />
                          <span className="truncate max-w-[140px]">{req.assignedRecyclerName}</span>
                        </div>
                      ) : (
                        <span className="text-earth-400 italic text-[11px]">Pending assignment</span>
                      )}
                    </td>

                    {/* Logistics */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {req.assignedLogisticsName ? (
                        <div className="flex items-center gap-1.5 text-earth-800">
                          <Truck size={13} className="text-olive-700 shrink-0" />
                          <span className="truncate max-w-[140px]">{req.assignedLogisticsName}</span>
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

      {/* View Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Manifest Details: ${selectedRequest.id}`}
          subtitle={`Submitted on ${new Date(selectedRequest.createdAt).toLocaleDateString()}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Top overview banner */}
            <div className="p-4 rounded-2xl bg-sand-100/70 border border-sand-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-earth-500 uppercase tracking-wider block">
                  Current Status
                </span>
                <div className="mt-1">
                  <StatusBadge status={selectedRequest.status} size="sm" />
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-earth-500 uppercase tracking-wider block">
                  Equipment Category
                </span>
                <span className="text-sm font-semibold text-earth-900">
                  {selectedRequest.category}
                </span>
              </div>
            </div>

            {/* Device Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Quantity</span>
                <span className="font-bold text-earth-900 text-sm">{selectedRequest.quantity} Unit(s)</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Weight</span>
                <span className="font-bold text-earth-900 text-sm">{selectedRequest.weight} kg</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Condition</span>
                <span className="font-bold text-earth-900 text-sm">{selectedRequest.condition}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-earth-400 block text-[10px] uppercase font-bold">City</span>
                <span className="font-bold text-earth-900 text-sm">{selectedRequest.city}</span>
              </div>
            </div>

            {/* Photo preview if present */}
            {selectedRequest.imageUrl && (
              <div>
                <span className="label mb-2 block">Attached Equipment Proof</span>
                <div className="rounded-2xl overflow-hidden border border-sand-200 h-44 bg-sand-100">
                  <img
                    src={selectedRequest.imageUrl}
                    alt={selectedRequest.deviceName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Address & Logistics Details */}
            <div className="p-4 bg-white rounded-2xl border border-sand-200 space-y-3 text-xs">
              <div>
                <span className="font-bold text-earth-900 block mb-0.5">Pickup Location</span>
                <p className="text-earth-600">{selectedRequest.pickupAddress}, {selectedRequest.city} - {selectedRequest.pincode}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-sand-100">
                <div>
                  <span className="text-earth-400 text-[10px] uppercase font-bold block">Assigned Recycler</span>
                  <span className="font-semibold text-earth-900">
                    {selectedRequest.assignedRecyclerName || 'Awaiting Allocation'}
                  </span>
                </div>
                <div>
                  <span className="text-earth-400 text-[10px] uppercase font-bold block">Logistics Driver</span>
                  <span className="font-semibold text-earth-900">
                    {selectedRequest.assignedLogisticsName || 'Awaiting Dispatch'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking timeline */}
            <div>
              <span className="label mb-3 block">Custody Timeline</span>
              <TrackingTimeline timeline={selectedRequest.timeline} />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="btn-secondary text-xs py-2 px-5"
              >
                Close Manifest
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
