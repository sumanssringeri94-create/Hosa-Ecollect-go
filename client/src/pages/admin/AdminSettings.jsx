import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { storageService, resetDemoData } from '../../services/storageService';
import { Settings, RotateCcw, ShieldCheck, Database, Save, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [platformName, setPlatformName] = useState('eCollect-Go Central Governance');
  const [autoApproveStandard, setAutoApproveStandard] = useState(false);
  const [allowPublicDemoSwitcher, setAllowPublicDemoSwitcher] = useState(true);
  const [carbonOffsetFactor, setCarbonOffsetFactor] = useState(2.4);

  const auditLogs = storageService.getAuditLogs();

  const handleSaveSettings = (e) => {
    e.preventDefault();
    toast.success('Platform governance parameters updated.');
  };

  const handleResetData = () => {
    resetDemoData();
    toast.success('All local storage state reset to factory demo values.');
    setTimeout(() => window.location.reload(), 400);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="System Governance & Settings"
        subtitle="Configure municipal platform parameters, ESG emission calculation factors, and demo storage state."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSaveSettings} className="card p-6 sm:p-8 bg-white border border-sand-300 space-y-6">
            <h3 className="text-base font-bold text-earth-950 font-sans pb-3 border-b border-sand-200">
              Operational Parameters
            </h3>

            <div>
              <label className="label">Platform Organization Name</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">LCA Carbon Avoidance Factor (kg CO₂ / kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={carbonOffsetFactor}
                  onChange={(e) => setCarbonOffsetFactor(Number(e.target.value))}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Verification Window SLA (Hours)</label>
                <input
                  type="number"
                  defaultValue={24}
                  className="input"
                />
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-sand-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApproveStandard}
                  onChange={(e) => setAutoApproveStandard(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-800 border-sand-300 focus:ring-forest-600"
                />
                <div>
                  <span className="text-xs font-bold text-earth-900 block">Auto-Verify Low Hazard Household Categories</span>
                  <span className="text-[11px] text-earth-500">Automatically advance peripheral & cable manifests without manual inspection.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowPublicDemoSwitcher}
                  onChange={(e) => setAllowPublicDemoSwitcher(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-800 border-sand-300 focus:ring-forest-600"
                />
                <div>
                  <span className="text-xs font-bold text-earth-900 block">Enable Instant Demo Role Switcher</span>
                  <span className="text-[11px] text-earth-500">Displays the quick 1-click persona switcher pill in header and sidebar.</span>
                </div>
              </label>
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-primary text-xs py-2.5 px-6 shadow-sm">
                <Save size={15} /> Save Configuration
              </button>
            </div>
          </form>

          {/* Dangerous Zone / Factory Reset */}
          <div className="card p-6 bg-red-50/40 border border-red-200 rounded-2xl space-y-3">
            <h4 className="text-sm font-bold text-red-950">Factory Demo State Reset</h4>
            <p className="text-xs text-red-700 leading-relaxed">
              Resets all localStorage collections, audit logs, partner assignments, and mock requests back to their pristine initial factory seed.
            </p>
            <button
              type="button"
              onClick={handleResetData}
              className="btn-danger text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <RotateCcw size={14} /> Reset All Demo Storage
            </button>
          </div>
        </div>

        {/* Right: Immutable Ledger Preview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card p-5 bg-sand-50/70 border border-sand-300 space-y-3">
            <div className="flex items-center gap-2 text-forest-900">
              <Database size={18} />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                System Audit Ledger
              </h4>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-white rounded-xl border border-sand-200 text-xs">
                  <div className="font-semibold text-earth-900">{log.action}</div>
                  <div className="text-[10px] text-earth-500 mt-0.5">Target: {log.target}</div>
                  <div className="text-[10px] text-earth-400 mt-1 font-mono">{log.time} by {log.actor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
