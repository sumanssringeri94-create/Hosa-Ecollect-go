import React, { useState, useEffect } from 'react';
import { recyclersApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Package, CheckCircle, XCircle, Eye, Factory, Scale, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecyclerAssigned() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReq, setSelectedReq] = useState(null);

  const loadAssigned = async () => {
    try {
      setLoading(true);
      const res = await recyclersApi.getAssignedRequests();
      setRequests(res.pickups || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load assigned requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssigned();
  }, []);

  const handleAcceptAssignment = async (req) => {
    const id = req._id || req.id;
    try {
      await recyclersApi.acceptAssignment(id);
      toast.success(`Accepted assignment for manifest #${id.toString().slice(-6)}!`);
      await loadAssigned();
    } catch (err) {
      toast.error(err.message || 'Failed to accept assignment');
    }
  };

  const handleRejectAssignment = async (req) => {
    const id = req._id || req.id;
    try {
      await recyclersApi.rejectAssignment(id, 'Facility capacity reached. Re-allocated for another lab.');
      toast.success(`Declined assignment for #${id.toString().slice(-6)}. Returned to Admin queue.`);
      await loadAssigned();
    } catch (err) {
      toast.error(err.message || 'Failed to decline assignment');
    }
  };

  const filtered = requests.filter((r) => {
    const rId = (r._id || r.id || '').toString().toLowerCase();
    const devName = (r.deviceName || r.items?.[0]?.itemName || r.category || '').toLowerCase();
    const cat = (r.category || r.items?.[0]?.category || '').toLowerCase();
    const q = searchTerm.toLowerCase();

    return rId.includes(q) || devName.includes(q) || cat.includes(q);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned E-Waste Requests"
        subtitle="Review equipment manifests allocated to your processing facility by platform governance."
        badge={`${requests.length} Allocations`}
      />

      <div className="card p-4 bg-white border border-sand-300 flex items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by manifest ID, device or category..."
          className="w-full sm:w-80"
        />
      </div>

      {loading ? (
        <div className="card p-6 bg-white border border-sand-300">
          <LoadingSkeleton type="table" count={5} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No assigned requests match your criteria"
          description="Adjust your search query or check back later for new allocations."
        />
      ) : (
        <div className="card overflow-hidden bg-white border border-sand-300 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-earth-800">
              <thead className="bg-sand-50 border-b border-sand-200 text-earth-900 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Manifest ID</th>
                  <th className="py-3.5 px-4">Equipment Details</th>
                  <th className="py-3.5 px-4">Gross Weight</th>
                  <th className="py-3.5 px-4">Courier Partner</th>
                  <th className="py-3.5 px-4">Custody Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200/80">
                {filtered.map((req) => {
                  const reqId = req._id || req.id;
                  const shortId = reqId ? reqId.toString().slice(-6).toUpperCase() : 'MAN';
                  const devName = req.deviceName || req.items?.[0]?.itemName || req.category || 'Electronic Item';
                  const category = req.category || req.items?.[0]?.category || 'E-Waste';
                  const weight = req.weight || req.estimatedWeight || '1.0';
                  const condition = req.condition || req.items?.[0]?.condition || 'Standard';
                  const courierName = req.logisticsPartner?.companyName || req.logisticsPartner?.name || req.assignedLogisticsName || 'Pending Courier Dispatch';

                  return (
                    <tr key={reqId} className="hover:bg-sand-50/60 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-forest-900">
                        #{shortId}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-earth-950">{devName}</div>
                        <div className="text-[11px] text-earth-500">{category} • {condition}</div>
                      </td>
                      <td className="py-4 px-4 font-bold text-earth-900">
                        {weight} kg
                      </td>
                      <td className="py-4 px-4 text-earth-600">
                        {courierName}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={req.status} size="xs" />
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedReq(req)}
                            className="btn-secondary text-[11px] py-1 px-2.5"
                          >
                            <Eye size={13} /> View
                          </button>

                          {(req.status === 'assigned' || req.recyclerStatus === 'pending') && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleAcceptAssignment(req)}
                                className="px-2.5 py-1 rounded-xl bg-forest-100 hover:bg-forest-200 text-forest-900 border border-forest-300 text-[11px] font-semibold"
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectAssignment(req)}
                                className="px-2 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-medium"
                              >
                                Decline
                              </button>
                            </>
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

      {/* Manifest Modal */}
      {selectedReq && (
        <Modal
          isOpen={!!selectedReq}
          onClose={() => setSelectedReq(null)}
          title={`Equipment Manifest: #${(selectedReq._id || selectedReq.id || '').toString().slice(-6).toUpperCase()}`}
          subtitle={`Submitted for ${selectedReq.category || selectedReq.items?.[0]?.category || 'General E-Waste'}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-sand-100/70 rounded-xl border border-sand-200 space-y-1">
              <span className="font-bold text-earth-950 text-sm block">
                {selectedReq.deviceName || selectedReq.items?.[0]?.itemName || selectedReq.category}
              </span>
              <p className="text-earth-600">
                Category: {selectedReq.category || selectedReq.items?.[0]?.category} • Estimated Weight: {selectedReq.weight || selectedReq.estimatedWeight} kg
              </p>
            </div>

            <div className="space-y-2 p-3 bg-white rounded-xl border border-sand-200">
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Disposal Condition</span>
                <span className="font-semibold text-earth-900">{selectedReq.condition || selectedReq.items?.[0]?.condition || 'Standard'}</span>
              </div>
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Assigned Logistics Courier</span>
                <span className="font-semibold text-earth-900">
                  {selectedReq.logisticsPartner?.companyName || selectedReq.logisticsPartner?.name || selectedReq.assignedLogisticsName || 'Awaiting dispatch'}
                </span>
              </div>
              {(selectedReq.notes || selectedReq.pickupNotes) && (
                <div>
                  <span className="text-earth-400 block text-[10px] uppercase font-bold">Customer Notes</span>
                  <p className="text-earth-700 italic">{selectedReq.notes || selectedReq.pickupNotes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="btn-secondary text-xs py-2 px-4"
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
