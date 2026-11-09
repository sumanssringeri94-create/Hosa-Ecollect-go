import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import { Package, CheckCircle, XCircle, Eye, Factory, Scale, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecyclerAssigned() {
  const [requests, setRequests] = useState(storageService.getRequests());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReq, setSelectedReq] = useState(null);

  const recyclerRequests = requests.filter(
    (r) => r.assignedRecyclerId === 'rec-1' || r.assignedRecyclerName?.includes('EcoCycle') || !r.assignedRecyclerId
  );

  const handleAcceptAssignment = (req) => {
    storageService.updateRequestStatus(
      req.id,
      req.status === 'assigned' ? 'scheduled' : req.status,
      'Recycling facility accepted the processing assignment.',
      'EcoCycle Technologies'
    );
    setRequests(storageService.getRequests());
    toast.success(`Accepted assignment for manifest ${req.id}!`);
  };

  const handleRejectAssignment = (req) => {
    storageService.updateRequestStatus(
      req.id,
      'verified',
      'Recycler facility reached capacity quota. Re-allocated for another lab.',
      'EcoCycle Technologies'
    );
    setRequests(storageService.getRequests());
    toast.success(`Declined assignment for ${req.id}. Returned to Admin queue.`);
  };

  const filtered = recyclerRequests.filter(
    (r) =>
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned E-Waste Requests"
        subtitle="Review equipment manifests allocated to your processing facility by platform governance."
        badge={`${recyclerRequests.length} Allocations`}
      />

      <div className="card p-4 bg-white border border-sand-300 flex items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by manifest ID, device or category..."
          className="w-full sm:w-80"
        />
      </div>

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
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-sand-50/60 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-forest-900">
                    {req.id}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-earth-950">{req.deviceName}</div>
                    <div className="text-[11px] text-earth-500">{req.category} • {req.condition}</div>
                  </td>
                  <td className="py-4 px-4 font-bold text-earth-900">
                    {req.weight} kg
                  </td>
                  <td className="py-4 px-4 text-earth-600">
                    {req.assignedLogisticsName || 'Pending Courier Dispatch'}
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

                      {req.status === 'assigned' && (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manifest Modal */}
      {selectedReq && (
        <Modal
          isOpen={!!selectedReq}
          onClose={() => setSelectedReq(null)}
          title={`Equipment Manifest: ${selectedReq.id}`}
          subtitle={`Submitted for ${selectedReq.category}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-sand-100/70 rounded-xl border border-sand-200 space-y-1">
              <span className="font-bold text-earth-950 text-sm block">{selectedReq.deviceName}</span>
              <p className="text-earth-600">Category: {selectedReq.category} • Estimated Weight: {selectedReq.weight} kg</p>
            </div>

            <div className="space-y-2 p-3 bg-white rounded-xl border border-sand-200">
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Disposal Condition</span>
                <span className="font-semibold text-earth-900">{selectedReq.condition}</span>
              </div>
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Assigned Logistics Courier</span>
                <span className="font-semibold text-earth-900">{selectedReq.assignedLogisticsName || 'Awaiting dispatch'}</span>
              </div>
              {selectedReq.notes && (
                <div>
                  <span className="text-earth-400 block text-[10px] uppercase font-bold">Customer Notes</span>
                  <p className="text-earth-700 italic">{selectedReq.notes}</p>
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
