import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import { Truck, MapPin, Phone, Eye, CheckCircle2, Clock, Navigation, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LogisticsPickups() {
  const [requests, setRequests] = useState(storageService.getRequests());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusUpdateModalReq, setStatusUpdateModalReq] = useState(null);
  const [newStatus, setNewStatus] = useState('collected');
  const [pickupNote, setPickupNote] = useState('');

  const driverRequests = requests.filter(
    (r) => r.assignedLogisticsId === 'log-1' || r.assignedLogisticsName?.includes('GreenRoute') || !r.assignedLogisticsId
  );

  const handleOpenStatusModal = (req) => {
    setStatusUpdateModalReq(req);
    setNewStatus(req.status === 'scheduled' ? 'collected' : 'completed');
    setPickupNote(`Collected from doorstep at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Verified item condition.`);
  };

  const handleConfirmStatusUpdate = (e) => {
    e.preventDefault();
    if (!statusUpdateModalReq) return;

    storageService.updateRequestStatus(
      statusUpdateModalReq.id,
      newStatus,
      pickupNote || `Status updated to ${newStatus} by GreenRoute driver.`,
      'Ravi Kumar (GreenRoute)'
    );

    toast.success(`Updated status for ${statusUpdateModalReq.id} to ${newStatus.toUpperCase()}`);
    setStatusUpdateModalReq(null);
    setRequests(storageService.getRequests());
  };

  const filtered = driverRequests.filter(
    (r) =>
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.deviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned Doorstep Pickups"
        subtitle="Manage customer collection waypoints, navigation notes, and delivery handoffs."
        badge={`${driverRequests.length} Dispatches`}
      />

      <div className="card p-4 bg-white border border-sand-300 flex items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by customer, address, or item..."
          className="w-full sm:w-80"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="card p-6 bg-white border border-sand-300 flex flex-col justify-between space-y-4 hover:border-sand-400 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-forest-900 bg-sand-100 px-2 py-0.5 rounded">
                  {req.id}
                </span>
                <StatusBadge status={req.status} size="xs" />
              </div>

              <div>
                <h4 className="text-base font-bold text-earth-950 font-sans">{req.deviceName}</h4>
                <div className="text-xs text-earth-500">{req.category} • {req.quantity} Unit(s) • {req.weight} kg</div>
              </div>

              <div className="p-3 bg-sand-50/70 rounded-xl border border-sand-200 text-xs space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-terracotta-600 shrink-0 mt-0.5" />
                  <span className="text-earth-800 font-medium">{req.pickupAddress}, {req.city} - {req.pincode}</span>
                </div>
                <div className="flex items-center gap-2 text-earth-600">
                  <Phone size={14} className="text-earth-400 shrink-0" />
                  <span>{req.userName} ({req.userPhone})</span>
                </div>
                <div className="flex items-center gap-2 text-earth-500">
                  <Clock size={14} className="text-earth-400 shrink-0" />
                  <span>Scheduled: {req.preferredDate} • {req.preferredTime}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-sand-200 flex items-center justify-between">
              <span className="text-[11px] text-earth-500">
                Route: Sector 4 Corridor
              </span>

              <button
                type="button"
                onClick={() => handleOpenStatusModal(req)}
                className="btn-primary text-xs py-1.5 px-4 shadow-xs"
              >
                Update Route Status →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Update Status Modal */}
      {statusUpdateModalReq && (
        <Modal
          isOpen={!!statusUpdateModalReq}
          onClose={() => setStatusUpdateModalReq(null)}
          title={`Update Route Status: ${statusUpdateModalReq.id}`}
          subtitle={`Customer: ${statusUpdateModalReq.userName} • ${statusUpdateModalReq.deviceName}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleConfirmStatusUpdate} className="space-y-4 text-xs">
            <div>
              <label className="label">Next Milestone Status *</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="input cursor-pointer"
              >
                <option value="scheduled">Scheduled (Awaiting Date)</option>
                <option value="collected">Collected from Doorstep</option>
                <option value="in_recycling">Delivered to Recycler Dock</option>
                <option value="completed">Completed Trip</option>
              </select>
            </div>

            <div>
              <label className="label">Driver Log Notes / Proof of Collection</label>
              <textarea
                rows={3}
                value={pickupNote}
                onChange={(e) => setPickupNote(e.target.value)}
                className="input resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-sand-200">
              <button
                type="button"
                onClick={() => setStatusUpdateModalReq(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-5 shadow-sm"
              >
                Save & Update Milestone
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
