import React, { useState, useEffect } from 'react';
import { recyclersApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  RotateCw,
  Scale,
  Award,
  CheckCircle2,
  Save,
  Boxes,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecyclerOperations() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);

  // Operations modal form
  const [opsForm, setOpsForm] = useState({
    receivedWeight: 4.15,
    goldGrams: 0.28,
    copperKg: 0.95,
    aluminumKg: 1.80,
    plasticsKg: 0.85,
    notes: 'Clean motherboard extraction achieved. Batteries routed to safe hydrometallurgical cell.',
    currentStage: 'Hydrometallurgy Leaching & Plastic Granulation',
  });

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await recyclersApi.getAssignedRequests();
      setRequests(res.pickups || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Bench jobs in progress or ready for processing
  const benchJobs = requests.filter((r) =>
    ['collected', 'in_recycling', 'recycling_in_progress'].includes(r.status) ||
    r.recyclerStatus === 'processing' ||
    r.logisticsStatus === 'delivered'
  );

  const handleOpenOpsModal = (req) => {
    setSelectedReq(req);
    const existing = req.recoveredMaterials || {};
    setOpsForm({
      receivedWeight: req.receivedWeight || req.weight || req.estimatedWeight || 2.5,
      goldGrams: existing.goldGrams || 0.25,
      copperKg: existing.copperKg || 0.85,
      aluminumKg: existing.aluminumKg || 1.2,
      plasticsKg: existing.plasticsKg || 0.75,
      notes: req.processingNotes || 'Component separation completed without thermal emissions.',
      currentStage: req.recyclerStatus === 'processing' ? 'Assaying Secondary Raw Materials' : 'Hydrometallurgy Leaching & Plastic Granulation',
    });
  };

  const handleSaveProgress = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;
    const reqId = selectedReq._id || selectedReq.id;

    try {
      await recyclersApi.updateOperations(reqId, {
        receivedWeight: opsForm.receivedWeight,
        recoveredMaterials: {
          goldGrams: opsForm.goldGrams,
          copperKg: opsForm.copperKg,
          aluminumKg: opsForm.aluminumKg,
          plasticsKg: opsForm.plasticsKg,
        },
        processingNotes: opsForm.notes,
        status: 'processing',
      });

      toast.success(`Updated assay progress for #${reqId.toString().slice(-6)}!`);
      setSelectedReq(null);
      await loadRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to update progress');
    }
  };

  const handleCompleteRecycling = async () => {
    if (!selectedReq) return;
    const reqId = selectedReq._id || selectedReq.id;
    const certId = `ECG-CERT-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await recyclersApi.updateOperations(reqId, {
        receivedWeight: opsForm.receivedWeight,
        recoveredMaterials: {
          goldGrams: opsForm.goldGrams,
          copperKg: opsForm.copperKg,
          aluminumKg: opsForm.aluminumKg,
          plasticsKg: opsForm.plasticsKg,
        },
        processingNotes: `${opsForm.notes} | Certificate: ${certId}`,
        status: 'completed',
      });

      toast.success(`Recycling fully completed! Issued certificate ${certId} 🏅`);
      setSelectedReq(null);
      await loadRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to complete recycling');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recycling Bench & Operations"
        subtitle="Record calibrated intake scale weights, component disassembly logs, and secondary material recovery yields."
        badge={`${benchJobs.length} Active Workstations`}
      />

      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : benchJobs.length === 0 ? (
        <EmptyState
          icon={RotateCw}
          title="No workstations currently active"
          description="Delivered e-waste shipments ready for bench dismantling and material recovery will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benchJobs.map((job) => {
            const reqId = job._id || job.id;
            const shortId = reqId ? reqId.toString().slice(-6).toUpperCase() : 'JOB';
            const devName = job.deviceName || job.items?.[0]?.itemName || job.category || 'Electronic Item';
            const category = job.category || job.items?.[0]?.category || 'E-Waste';
            const condition = job.condition || job.items?.[0]?.condition || 'Standard';
            const weight = job.weight || job.estimatedWeight || '1.0';

            return (
              <div
                key={reqId}
                className="card p-6 bg-white border border-sand-300 flex flex-col justify-between space-y-4 hover:border-terracotta-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-forest-900 bg-sand-100 px-2 py-0.5 rounded">
                      #{shortId}
                    </span>
                    <StatusBadge status={job.status} size="xs" />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-earth-950 font-sans">{devName}</h4>
                    <p className="text-xs text-earth-500">{category} • Condition: {condition}</p>
                  </div>

                  <div className="p-3 bg-sand-50/70 rounded-xl border border-sand-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-earth-500">Intake Scale Weight:</span>
                      <span className="font-bold text-earth-900">{weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-earth-500">Current Bench Stage:</span>
                      <span className="font-semibold text-terracotta-700">
                        {job.recyclerStatus === 'processing' ? 'Active Assay / Disassembly' : 'Dock Check-in Complete'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-sand-200 flex items-center justify-between">
                  <span className="text-[11px] text-earth-400">
                    Facility: CleanTech Hub
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenOpsModal(job)}
                    className="btn-accent text-xs py-1.5 px-4 shadow-xs"
                  >
                    Log Operations Assay →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Operations Assay Modal */}
      {selectedReq && (
        <Modal
          isOpen={!!selectedReq}
          onClose={() => setSelectedReq(null)}
          title={`Operations Log: #${(selectedReq._id || selectedReq.id || '').toString().slice(-6).toUpperCase()}`}
          subtitle={`Device: ${selectedReq.deviceName || selectedReq.items?.[0]?.itemName || selectedReq.category}`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveProgress} className="space-y-5">
            {/* Stage Selector */}
            <div>
              <label className="label">Current Operational Stage *</label>
              <select
                value={opsForm.currentStage}
                onChange={(e) => setOpsForm({ ...opsForm, currentStage: e.target.value })}
                className="input cursor-pointer"
              >
                <option>Intake Verification & Scale Tare</option>
                <option>Manual Disassembly & Battery Isolation</option>
                <option>PCB Depopulation & Heat Exchanger Removal</option>
                <option>Hydrometallurgy Leaching & Plastic Granulation</option>
                <option>Assaying Secondary Raw Materials</option>
              </select>
            </div>

            {/* Received weight */}
            <div>
              <label className="label">Verified Bench Scale Weight (kg) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={opsForm.receivedWeight}
                onChange={(e) => setOpsForm({ ...opsForm, receivedWeight: Number(e.target.value) })}
                className="input"
              />
            </div>

            {/* Material Recovery Assays */}
            <div>
              <label className="label mb-2 block">
                Recovered Secondary Materials (Assay Breakdown)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-forest-50/50 border border-forest-200 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-forest-800 block">Gold (Grams)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={opsForm.goldGrams}
                    onChange={(e) => setOpsForm({ ...opsForm, goldGrams: Number(e.target.value) })}
                    className="input py-1 text-xs"
                  />
                </div>

                <div className="p-3 bg-terracotta-50/50 border border-terracotta-200 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-terracotta-800 block">Copper (kg)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={opsForm.copperKg}
                    onChange={(e) => setOpsForm({ ...opsForm, copperKg: Number(e.target.value) })}
                    className="input py-1 text-xs"
                  />
                </div>

                <div className="p-3 bg-sand-100/70 border border-sand-300 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-earth-800 block">Aluminum (kg)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={opsForm.aluminumKg}
                    onChange={(e) => setOpsForm({ ...opsForm, aluminumKg: Number(e.target.value) })}
                    className="input py-1 text-xs"
                  />
                </div>

                <div className="p-3 bg-sand-100/70 border border-sand-300 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-earth-800 block">ABS Plastics (kg)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={opsForm.plasticsKg}
                    onChange={(e) => setOpsForm({ ...opsForm, plasticsKg: Number(e.target.value) })}
                    className="input py-1 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="label">Technician Processing Notes</label>
              <textarea
                rows={2}
                value={opsForm.notes}
                onChange={(e) => setOpsForm({ ...opsForm, notes: e.target.value })}
                className="input resize-none"
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-sand-200">
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="btn-secondary text-xs py-2 px-4 w-full sm:w-auto"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="btn-secondary text-xs py-2 px-4 flex-1 sm:flex-none"
                >
                  <Save size={13} /> Save Stage Progress
                </button>

                <button
                  type="button"
                  onClick={handleCompleteRecycling}
                  className="btn-primary text-xs py-2 px-5 flex-1 sm:flex-none shadow-sm"
                >
                  <Award size={14} /> Mark Recycling Completed
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
