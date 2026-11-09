import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
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
  const [requests, setRequests] = useState(storageService.getRequests());
  const [selectedReq, setSelectedReq] = useState(null);

  // Bench jobs in progress or ready for processing
  const benchJobs = requests.filter((r) => ['collected', 'in_recycling'].includes(r.status));

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

  const handleOpenOpsModal = (req) => {
    setSelectedReq(req);
    const existing = req.recyclingData || {};
    setOpsForm({
      receivedWeight: existing.receivedWeight || req.weight || 2.5,
      goldGrams: existing.recoveredMaterials?.goldGrams || 0.25,
      copperKg: existing.recoveredMaterials?.copperKg || 0.85,
      aluminumKg: existing.recoveredMaterials?.aluminumKg || 1.2,
      plasticsKg: existing.recoveredMaterials?.plasticsKg || 0.75,
      notes: existing.notes || 'Component separation completed without thermal emissions.',
      currentStage: existing.currentStage || 'Material Assaying',
    });
  };

  const handleSaveProgress = (e) => {
    e.preventDefault();
    if (!selectedReq) return;

    storageService.updateRecyclingData(
      selectedReq.id,
      {
        receivedWeight: opsForm.receivedWeight,
        currentStage: opsForm.currentStage,
        recoveredMaterials: {
          goldGrams: opsForm.goldGrams,
          copperKg: opsForm.copperKg,
          aluminumKg: opsForm.aluminumKg,
          plasticsKg: opsForm.plasticsKg,
        },
        notes: opsForm.notes,
      },
      false // not completed yet
    );

    toast.success(`Updated assay progress for ${selectedReq.id}!`);
    setSelectedReq(null);
    setRequests(storageService.getRequests());
  };

  const handleCompleteRecycling = () => {
    if (!selectedReq) return;

    const certId = `ECG-CERT-${Math.floor(1000 + Math.random() * 9000)}`;

    storageService.updateRecyclingData(
      selectedReq.id,
      {
        receivedWeight: opsForm.receivedWeight,
        currentStage: 'Completed & Certified',
        recoveredMaterials: {
          goldGrams: opsForm.goldGrams,
          copperKg: opsForm.copperKg,
          aluminumKg: opsForm.aluminumKg,
          plasticsKg: opsForm.plasticsKg,
        },
        certificateId: certId,
        notes: opsForm.notes,
      },
      true // mark complete!
    );

    toast.success(`Recycling fully completed! Issued certificate ${certId} 🏅`);
    setSelectedReq(null);
    setRequests(storageService.getRequests());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recycling Bench & Operations"
        subtitle="Record calibrated intake scale weights, component disassembly logs, and secondary material recovery yields."
        badge={`${benchJobs.length} Active Workstations`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benchJobs.map((job) => (
          <div
            key={job.id}
            className="card p-6 bg-white border border-sand-300 flex flex-col justify-between space-y-4 hover:border-terracotta-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-forest-900 bg-sand-100 px-2 py-0.5 rounded">
                  {job.id}
                </span>
                <StatusBadge status={job.status} size="xs" />
              </div>

              <div>
                <h4 className="text-base font-bold text-earth-950 font-sans">{job.deviceName}</h4>
                <p className="text-xs text-earth-500">{job.category} • Condition: {job.condition}</p>
              </div>

              <div className="p-3 bg-sand-50/70 rounded-xl border border-sand-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-earth-500">Intake Scale Weight:</span>
                  <span className="font-bold text-earth-900">{job.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-500">Current Bench Stage:</span>
                  <span className="font-semibold text-terracotta-700">
                    {job.recyclingData?.currentStage || 'Intake Dock / Sorting'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-sand-200 flex items-center justify-between">
              <span className="text-[11px] text-earth-400">
                Facility: EcoCycle Hub A
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
        ))}
      </div>

      {/* Operations Assay Modal */}
      {selectedReq && (
        <Modal
          isOpen={!!selectedReq}
          onClose={() => setSelectedReq(null)}
          title={`Operations Log: ${selectedReq.id}`}
          subtitle={`Device: ${selectedReq.deviceName} (${selectedReq.category})`}
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
