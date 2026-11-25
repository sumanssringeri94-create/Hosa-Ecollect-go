import React, { useState, useEffect } from 'react';
import { pickupsApi, adminApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Modal from '../../components/common/Modal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import TrackingTimeline from '../../components/common/TrackingTimeline';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Factory,
  Calendar,
  Clock,
  UserCheck,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPickups() {
  const [requests, setRequests] = useState([]);
  const [recyclers, setRecyclers] = useState([]);
  const [logistics, setLogistics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignModalReq, setAssignModalReq] = useState(null);
  const [rejectDialogReq, setRejectDialogReq] = useState(null);
  const [rejectReason, setRejectReason] = useState('Non-qualifying hazardous waste without containment');

  // Assignment form state
  const [assignForm, setAssignForm] = useState({
    recyclerId: '',
    logisticsId: '',
    pickupDate: '',
    timeSlot: '10:00 AM - 01:00 PM',
    notes: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [pickupsRes, recyclersRes, logisticsRes] = await Promise.all([
        pickupsApi.getAllPickups(),
        adminApi.getRecyclers().catch(() => ({ recyclers: [] })),
        adminApi.getLogistics().catch(() => ({ partners: [] })),
      ]);

      const pickupsList = pickupsRes.pickups || [];
      const recyclersList = recyclersRes.recyclers || [];
      const logisticsList = logisticsRes.partners || [];

      setRequests(pickupsList);
      setRecyclers(recyclersList);
      setLogistics(logisticsList);
    } catch (err) {
      toast.error(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (req) => {
    const id = req._id || req.id;
    try {
      await pickupsApi.verifyPickup(id, 'Approved by administrator. Ready for partner assignment.');
      toast.success(`Request #${id.toString().slice(-6)} marked as Verified!`);
      await loadData();
      if (selectedRequest) {
        setSelectedRequest((prev) => prev ? { ...prev, status: 'verified' } : null);
      }
    } catch (err) {
      toast.error(err.message || 'Verification failed');
    }
  };

  const handleOpenAssignModal = (req) => {
    setAssignModalReq(req);
    const verifiedRecyclers = recyclers.filter((r) => r.isVerified || r.verified);
    const availableLogistics = logistics.filter((l) => l.isAvailable !== false && l.available !== false);
    setAssignForm({
      recyclerId: verifiedRecyclers[0]?._id || verifiedRecyclers[0]?.id || recyclers[0]?._id || recyclers[0]?.id || '',
      logisticsId: availableLogistics[0]?._id || availableLogistics[0]?.id || logistics[0]?._id || logistics[0]?.id || '',
      pickupDate: req.preferredDate ? new Date(req.preferredDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      timeSlot: req.preferredTime || req.timeSlot || '10:00 AM - 01:00 PM',
      notes: `Dispatch order created. Verified items: ${req.deviceName || req.items?.[0]?.itemName || req.category}`,
    });
  };

  const handleConfirmAssignment = async (e) => {
    e.preventDefault();
    if (!assignModalReq) return;
    const reqId = assignModalReq._id || assignModalReq.id;

    try {
      if (assignForm.recyclerId) {
        await pickupsApi.assignRecycler(reqId, assignForm.recyclerId);
      }
      if (assignForm.logisticsId) {
        await pickupsApi.assignLogistics(reqId, {
          logisticsId: assignForm.logisticsId,
          scheduledDate: assignForm.pickupDate,
          timeSlot: assignForm.timeSlot,
        });
      }

      toast.success(`Partners successfully assigned to #${reqId.toString().slice(-6)}!`);
      setAssignModalReq(null);
      await loadData();
      if (selectedRequest) setSelectedRequest(null);
    } catch (err) {
      toast.error(err.message || 'Assignment failed');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectDialogReq) return;
    const reqId = rejectDialogReq._id || rejectDialogReq.id;
    try {
      await pickupsApi.rejectPickup(reqId, rejectReason || 'Rejected due to regulatory non-compliance.');
      toast.success(`Request #${reqId.toString().slice(-6)} marked as Rejected.`);
      setRejectDialogReq(null);
      setRejectReason('Non-qualifying hazardous waste without containment');
      await loadData();
      if (selectedRequest) setSelectedRequest(null);
    } catch (err) {
      toast.error(err.message || 'Rejection failed');
    }
  };

  const handleUpdateStatusDirect = async (id, newStatus) => {
    try {
      await pickupsApi.updateStatus(id, { status: newStatus, adminNote: `Admin override to ${newStatus}` });
      toast.success(`Status updated to ${newStatus}`);
      await loadData();
      if (selectedRequest) {
        setSelectedRequest((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  const filtered = requests.filter((r) => {
    const rId = (r._id || r.id || '').toString().toLowerCase();
    const devName = (r.deviceName || r.items?.[0]?.itemName || '').toLowerCase();
    const uName = (r.user?.name || r.userName || '').toLowerCase();
    const city = (r.user?.city || r.city || '').toLowerCase();

    const matchesSearch =
      rId.includes(searchTerm.toLowerCase()) ||
      devName.includes(searchTerm.toLowerCase()) ||
      uName.includes(searchTerm.toLowerCase()) ||
      city.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      r.status === statusFilter ||
      (statusFilter === 'submitted' && r.status === 'pending') ||
      (statusFilter === 'scheduled' && r.status === 'pickup_scheduled') ||
      (statusFilter === 'in_recycling' && r.status === 'recycling_in_progress');

    const matchesCategory =
      categoryFilter === 'all' ||
      r.category === categoryFilter ||
      r.items?.[0]?.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pickup Request Management"
        subtitle="Review, verify, assign certified recyclers, and schedule logistics for all platform collection manifests."
        badge={`${requests.length} Requests`}
      />

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white border border-sand-300 flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by ID, user, city, or equipment..."
          className="w-full sm:w-80"
        />

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto">
          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            allLabel="All Statuses"
            options={[
              { value: 'pending', label: 'Submitted (Needs Review)' },
              { value: 'verified', label: 'Verified (Ready for Partner)' },
              { value: 'assigned', label: 'Partners Assigned' },
              { value: 'pickup_scheduled', label: 'Pickup Scheduled' },
              { value: 'collected', label: 'Collected by Fleet' },
              { value: 'recycling_in_progress', label: 'In Facility Recycling' },
              { value: 'completed', label: 'Completed & Certified' },
              { value: 'rejected', label: 'Rejected' },
            ]}
            className="w-full sm:w-48"
          />

          <FilterDropdown
            value={categoryFilter}
            onChange={setCategoryFilter}
            allLabel="All Categories"
            options={[
              { value: 'Laptops & Computers', label: 'Laptops & Computers' },
              { value: 'Mobiles & Tablets', label: 'Mobiles & Tablets' },
              { value: 'Displays & Monitors', label: 'Displays & Monitors' },
              { value: 'Batteries & Power Units', label: 'Batteries & Power' },
              { value: 'Chargers, Adapters & Cables', label: 'Cables & Adapters' },
              { value: 'Keyboards, Mice & Peripherals', label: 'Peripherals' },
            ]}
            className="w-full sm:w-44"
          />
        </div>
      </div>

      {/* Requests Table */}
      {loading ? (
        <div className="card p-6 bg-white border border-sand-300">
          <LoadingSkeleton type="table" count={6} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No requests match your criteria"
          description="Adjust your search filters or status parameters to view records."
        />
      ) : (
        <div className="card overflow-hidden bg-white border border-sand-300 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-earth-800">
              <thead className="bg-sand-50 border-b border-sand-200 text-earth-900 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Request ID</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Equipment & Weight</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Recycler</th>
                  <th className="py-3.5 px-4">Logistics Fleet</th>
                  <th className="py-3.5 px-4 text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200/80">
                {filtered.map((req) => {
                  const reqId = req._id || req.id;
                  const shortId = reqId ? reqId.toString().slice(-6).toUpperCase() : 'REQ';
                  const userName = req.user?.name || req.userName || 'Citizen User';
                  const userPhone = req.user?.phone || req.userPhone || '—';
                  const city = req.user?.city || req.city || 'Bengaluru';
                  const deviceName = req.deviceName || req.items?.[0]?.itemName || req.category || 'Electronic Item';
                  const category = req.category || req.items?.[0]?.category || 'E-Waste';
                  const weight = req.weight || req.estimatedWeight || '1.0';
                  const condition = req.condition || req.items?.[0]?.condition || 'Standard';

                  const recyclerName = req.recycler?.companyName || req.recycler?.name || req.assignedRecyclerName;
                  const logisticsName = req.logisticsPartner?.companyName || req.logisticsPartner?.name || req.assignedLogisticsName;

                  return (
                    <tr key={reqId} className="hover:bg-sand-50/60 transition-colors">
                      {/* ID */}
                      <td className="py-4 px-4 font-mono font-bold text-forest-900">
                        #{shortId}
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-earth-950">{userName}</div>
                        <div className="text-[11px] text-earth-500">{city} • {userPhone}</div>
                      </td>

                      {/* Device */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-earth-900 truncate max-w-xs">{deviceName}</div>
                        <div className="text-[11px] text-earth-500">{category} • {weight}kg ({condition})</div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={req.status} size="xs" />
                      </td>

                      {/* Recycler */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {recyclerName ? (
                          <div className="flex items-center gap-1.5 text-earth-800 font-medium">
                            <Factory size={13} className="text-forest-700 shrink-0" />
                            <span className="truncate max-w-[120px]">{recyclerName}</span>
                          </div>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-semibold border border-amber-200">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Logistics */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {logisticsName ? (
                          <div className="flex items-center gap-1.5 text-earth-800 font-medium">
                            <Truck size={13} className="text-olive-700 shrink-0" />
                            <span className="truncate max-w-[120px]">{logisticsName}</span>
                          </div>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-semibold border border-amber-200">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Workflow Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(req)}
                            className="btn-secondary text-[11px] py-1 px-2.5"
                            title="Inspect Request"
                          >
                            <Eye size={13} /> View
                          </button>

                          {(req.status === 'pending' || req.status === 'submitted') && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleVerify(req)}
                                className="px-2.5 py-1 rounded-xl bg-forest-100 hover:bg-forest-200 text-forest-900 border border-forest-300 text-[11px] font-semibold transition-colors"
                                title="Verify Request"
                              >
                                Verify
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejectDialogReq(req)}
                                className="px-2 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-medium transition-colors"
                                title="Reject Request"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {['pending', 'submitted', 'verified'].includes(req.status) && (
                            <button
                              type="button"
                              onClick={() => handleOpenAssignModal(req)}
                              className="btn-primary text-[11px] py-1 px-3 shadow-xs"
                            >
                              Assign Partners
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: VIEW FULL DETAILS & DIRECT STATUS OVERRIDE ─── */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Manifest Audit: #${(selectedRequest._id || selectedRequest.id || '').toString().slice(-6).toUpperCase()}`}
          subtitle={`Submitted by ${selectedRequest.user?.name || selectedRequest.userName || 'Citizen'} (${selectedRequest.user?.email || selectedRequest.userEmail || ''})`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-sand-100/70 border border-sand-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 block">Current Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedRequest.status} size="sm" />
                </div>
              </div>

              {/* Status Override Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-earth-700">Quick Override:</span>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => handleUpdateStatusDirect(selectedRequest._id || selectedRequest.id, e.target.value)}
                  className="input py-1 px-2.5 text-xs w-auto cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="assigned">Assigned</option>
                  <option value="pickup_scheduled">Pickup Scheduled</option>
                  <option value="collected">Collected</option>
                  <option value="recycling_in_progress">In Recycling</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Device specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-bold text-earth-900 text-sm truncate block">
                  {selectedRequest.category || selectedRequest.items?.[0]?.category || 'General'}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Quantity</span>
                <span className="font-bold text-earth-900 text-sm">
                  {selectedRequest.quantity || selectedRequest.items?.[0]?.quantity || 1} Units
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Weight</span>
                <span className="font-bold text-earth-900 text-sm">
                  {selectedRequest.weight || selectedRequest.estimatedWeight || '1.0'} kg
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Condition</span>
                <span className="font-bold text-earth-900 text-sm">
                  {selectedRequest.condition || selectedRequest.items?.[0]?.condition || 'Used'}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="p-4 bg-white rounded-2xl border border-sand-200 space-y-2 text-xs">
              <span className="font-bold text-earth-900 block">Pickup Location & Customer Contact</span>
              <p className="text-earth-600">
                {selectedRequest.address || selectedRequest.pickupAddress || 'Address on file'}, {selectedRequest.city || selectedRequest.user?.city} - {selectedRequest.pincode || '560001'}
              </p>
              <div className="flex items-center gap-4 text-earth-500 pt-1 border-t border-sand-100">
                <span>Phone: <strong className="text-earth-900">{selectedRequest.user?.phone || selectedRequest.userPhone || '—'}</strong></span>
                <span>Scheduled: <strong className="text-earth-900">
                  {selectedRequest.preferredDate ? new Date(selectedRequest.preferredDate).toLocaleDateString() : 'Flexible'} ({selectedRequest.preferredTime || selectedRequest.timeSlot || 'Anytime'})
                </strong></span>
              </div>
            </div>

            {selectedRequest.imageUrl && (
              <div>
                <span className="label mb-2 block">Customer Attached Photo</span>
                <div className="rounded-2xl overflow-hidden border border-sand-200 h-44 bg-sand-100">
                  <img
                    src={selectedRequest.imageUrl}
                    alt={selectedRequest.deviceName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Custody Timeline */}
            {selectedRequest.timeline && (
              <div>
                <span className="label mb-3 block">Chain of Custody Stages</span>
                <TrackingTimeline timeline={selectedRequest.timeline} />
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-sand-200">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close
              </button>

              {['pending', 'submitted', 'verified'].includes(selectedRequest.status) && (
                <button
                  type="button"
                  onClick={() => {
                    handleOpenAssignModal(selectedRequest);
                  }}
                  className="btn-primary text-xs py-2 px-5"
                >
                  Assign Recycler & Courier
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ─── MODAL 2: ASSIGN RECYCLER & LOGISTICS PARTNERS ────────── */}
      {assignModalReq && (
        <Modal
          isOpen={!!assignModalReq}
          onClose={() => setAssignModalReq(null)}
          title={`Assign Partners: #${(assignModalReq._id || assignModalReq.id || '').toString().slice(-6).toUpperCase()}`}
          subtitle={`Allocate verified recycling laboratory and electric logistics fleet for ${assignModalReq.deviceName || assignModalReq.category}.`}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleConfirmAssignment} className="space-y-4">
            <div>
              <label className="label">Select Authorized Recycler *</label>
              <select
                required
                value={assignForm.recyclerId}
                onChange={(e) => setAssignForm({ ...assignForm, recyclerId: e.target.value })}
                className="input cursor-pointer"
              >
                <option value="">Choose Recycler Facility...</option>
                {recyclers.map((rec) => {
                  const recId = rec._id || rec.id;
                  const cName = rec.companyName || rec.name;
                  const loc = rec.location || rec.city || 'Bengaluru';
                  const isVer = rec.isVerified || rec.verified;
                  return (
                    <option key={recId} value={recId}>
                      {cName} ({loc}) • {isVer ? '✓ Verified' : '⚠ Pending'}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="label">Select Green Logistics Courier *</label>
              <select
                required
                value={assignForm.logisticsId}
                onChange={(e) => setAssignForm({ ...assignForm, logisticsId: e.target.value })}
                className="input cursor-pointer"
              >
                <option value="">Choose Logistics Partner...</option>
                {logistics.map((log) => {
                  const logId = log._id || log.id;
                  const lName = log.name;
                  const cName = log.companyName || log.company;
                  const vType = log.vehicleType || 'EV';
                  const isAvail = log.isAvailable !== false && log.available !== false;
                  return (
                    <option key={logId} value={logId}>
                      {lName} — {cName} ({vType}) • {isAvail ? 'Available' : 'Busy'}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Confirmed Collection Date *</label>
                <input
                  type="date"
                  required
                  value={assignForm.pickupDate}
                  onChange={(e) => setAssignForm({ ...assignForm, pickupDate: e.target.value })}
                  className="input cursor-pointer"
                />
              </div>

              <div>
                <label className="label">Pickup Window *</label>
                <select
                  value={assignForm.timeSlot}
                  onChange={(e) => setAssignForm({ ...assignForm, timeSlot: e.target.value })}
                  className="input cursor-pointer"
                >
                  <option>10:00 AM - 01:00 PM</option>
                  <option>02:00 PM - 05:00 PM</option>
                  <option>05:00 PM - 08:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Dispatch Notes for Driver & Facility</label>
              <textarea
                rows={3}
                value={assignForm.notes}
                onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                className="input resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-sand-200">
              <button
                type="button"
                onClick={() => setAssignModalReq(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-6 shadow-sm"
              >
                Confirm Allocation & Notify Partners
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ─── MODAL 3: REJECTION CONFIRMATION ─────────────────────── */}
      {rejectDialogReq && (
        <Modal
          isOpen={!!rejectDialogReq}
          onClose={() => setRejectDialogReq(null)}
          title={`Reject Pickup Request: #${(rejectDialogReq._id || rejectDialogReq.id || '').toString().slice(-6).toUpperCase()}`}
          subtitle="Please specify the reason for rejecting this collection request."
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div>
              <label className="label">Rejection Reason *</label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="input mb-2"
              >
                <option value="Non-qualifying hazardous waste without containment">Hazardous / Leaking material without safety containment</option>
                <option value="Outside active municipal logistics service boundary">Outside active municipal fleet boundary</option>
                <option value="Incorrect category specification / Bio-medical device">Bio-medical diagnostic item (restricted)</option>
                <option value="Duplicate request logged">Duplicate request logged</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectDialogReq(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="bg-red-600 hover:bg-red-700 text-white font-medium text-xs py-2 px-5 rounded-xl shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
