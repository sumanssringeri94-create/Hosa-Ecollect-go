import React, { useState, useEffect } from 'react';
import { logisticsApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Truck, MapPin, Phone, Eye, CheckCircle2, Clock, Navigation, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LogisticsPickups() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusUpdateModalReq, setStatusUpdateModalReq] = useState(null);
  const [newStatus, setNewStatus] = useState('collected');
  const [pickupNote, setPickupNote] = useState('');

  const loadPickups = async () => {
    try {
      setLoading(true);
      const res = await logisticsApi.getPickups();
      setRequests(res.pickups || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load assigned pickups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPickups();
  }, []);

  const handleOpenStatusModal = (req) => {
    setStatusUpdateModalReq(req);
    setNewStatus(req.status === 'collected' ? 'delivered' : 'collected');
    setPickupNote(`Doorstep check verified at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`);
  };

  const handleConfirmStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusUpdateModalReq) return;
    const reqId = statusUpdateModalReq._id || statusUpdateModalReq.id;

    try {
      if (newStatus === 'collected') {
        await logisticsApi.markCollected(reqId, pickupNote);
        toast.success(`Marked #${reqId.toString().slice(-6)} as Collected!`);
      } else if (newStatus === 'delivered' || newStatus === 'in_recycling') {
        await logisticsApi.confirmDelivery(reqId, pickupNote);
        toast.success(`Confirmed delivery to facility for #${reqId.toString().slice(-6)}!`);
      } else {
        await logisticsApi.markCollected(reqId, pickupNote);
        toast.success(`Status updated for #${reqId.toString().slice(-6)}`);
      }

      setStatusUpdateModalReq(null);
      await loadPickups();
    } catch (err) {
      toast.error(err.message || 'Failed to update pickup status');
    }
  };

  const filtered = requests.filter((r) => {
    const rId = (r._id || r.id || '').toString().toLowerCase();
    const uName = (r.user?.name || r.userName || '').toLowerCase();
    const addr = (r.address || r.pickupAddress || '').toLowerCase();
    const devName = (r.deviceName || r.items?.[0]?.itemName || r.category || '').toLowerCase();
    const q = searchTerm.toLowerCase();

    return rId.includes(q) || uName.includes(q) || addr.includes(q) || devName.includes(q);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned Doorstep Pickups"
        subtitle="Manage customer collection waypoints, navigation notes, and delivery handoffs."
        badge={`${requests.length} Dispatches`}
      />

      <div className="card p-4 bg-white border border-sand-300 flex items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by customer, address, or item..."
          className="w-full sm:w-80"
        />
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No assigned pickups match your search"
          description="Adjust your search query or check back later for new dispatches."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((req) => {
            const reqId = req._id || req.id;
            const shortId = reqId ? reqId.toString().slice(-6).toUpperCase() : 'REQ';
            const devName = req.deviceName || req.items?.[0]?.itemName || req.category || 'Electronic Item';
            const category = req.category || req.items?.[0]?.category || 'E-Waste';
            const quantity = req.quantity || req.items?.[0]?.quantity || 1;
            const weight = req.weight || req.estimatedWeight || '1.0';
            const userName = req.user?.name || req.userName || 'Citizen User';
            const userPhone = req.user?.phone || req.userPhone || '—';
            const address = req.address || req.pickupAddress || 'Address on file';
            const city = req.city || req.user?.city || 'Bengaluru';
            const pincode = req.pincode || '560001';
            const schedDate = req.scheduledDate ? new Date(req.scheduledDate).toLocaleDateString() : (req.preferredDate || 'Scheduled');
            const timeSlot = req.timeSlot || req.preferredTime || '10:00 AM - 01:00 PM';

            return (
              <div
                key={reqId}
                className="card p-6 bg-white border border-sand-300 flex flex-col justify-between space-y-4 hover:border-sand-400 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-forest-900 bg-sand-100 px-2 py-0.5 rounded">
                      #{shortId}
                    </span>
                    <StatusBadge status={req.status} size="xs" />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-earth-950 font-sans">{devName}</h4>
                    <div className="text-xs text-earth-500">{category} • {quantity} Unit(s) • {weight} kg</div>
                  </div>

                  <div className="p-3 bg-sand-50/70 rounded-xl border border-sand-200 text-xs space-y-1.5">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-terracotta-600 shrink-0 mt-0.5" />
                      <span className="text-earth-800 font-medium">{address}, {city} - {pincode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-earth-600">
                      <Phone size={14} className="text-earth-400 shrink-0" />
                      <span>{userName} ({userPhone})</span>
                    </div>
                    <div className="flex items-center gap-2 text-earth-500">
                      <Clock size={14} className="text-earth-400 shrink-0" />
                      <span>Scheduled: {schedDate} • {timeSlot}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-sand-200 flex items-center justify-between">
                  <span className="text-[11px] text-earth-500">
                    Route: Electric Corridor
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
            );
          })}
        </div>
      )}

      {/* Update Status Modal */}
      {statusUpdateModalReq && (
        <Modal
          isOpen={!!statusUpdateModalReq}
          onClose={() => setStatusUpdateModalReq(null)}
          title={`Update Route Status: #${(statusUpdateModalReq._id || statusUpdateModalReq.id || '').toString().slice(-6).toUpperCase()}`}
          subtitle={`Customer: ${statusUpdateModalReq.user?.name || statusUpdateModalReq.userName || 'Citizen'} • ${statusUpdateModalReq.deviceName || statusUpdateModalReq.category}`}
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
                <option value="collected">Collected from Doorstep</option>
                <option value="delivered">Delivered to Recycler Dock</option>
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
