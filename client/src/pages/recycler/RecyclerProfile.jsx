import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import { Factory, Award, ShieldCheck, MapPin, Phone, Mail, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecyclerProfile() {
  const { user } = useAuth();

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Facility operational preferences updated.');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Facility Credentials & Profile"
        subtitle="Operational licenses, environmental safety audit status, and technical processing capacities."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <form onSubmit={handleSave} className="card p-6 sm:p-8 bg-white border border-sand-300 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-sand-200">
              <div className="w-16 h-16 rounded-2xl bg-terracotta-100 text-terracotta-800 flex items-center justify-center border-2 border-terracotta-200">
                <Factory size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-earth-950">{user?.organization || 'EcoCycle Technologies Ltd'}</h3>
                <span className="badge badge-terracotta text-[11px] mt-1">Tier-1 Authorized Partner</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Managing Director</label>
                <input type="text" defaultValue={user?.name || 'Marcus Vance'} className="input" />
              </div>
              <div>
                <label className="label">Operations Email</label>
                <input type="email" defaultValue={user?.email || 'operations@ecocycle.com'} disabled className="input bg-sand-100 text-earth-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">SPCB E-Waste License</label>
                <input type="text" defaultValue="KSPCB/EW-REG/2023/041" disabled className="input bg-sand-100 text-earth-600 font-mono text-xs" />
              </div>
              <div>
                <label className="label">Monthly Quota Capacity</label>
                <input type="text" defaultValue="85 Tonnes / Month" className="input" />
              </div>
            </div>

            <div>
              <label className="label">Facility Physical Address</label>
              <textarea rows={2} defaultValue="Plot 18, Stage 2, Peenya Industrial Area, Bengaluru, Karnataka 560058" className="input resize-none" />
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-primary text-xs py-2.5 px-6 shadow-sm">
                <Save size={14} /> Update Facility Parameters
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="card p-5 bg-sand-50/70 border border-sand-300 space-y-3 text-xs">
            <h4 className="font-bold text-earth-950 uppercase tracking-wider text-[11px]">
              Compliance Accreditations
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 bg-white rounded-xl border border-sand-200 flex items-center gap-2">
                <ShieldCheck size={16} className="text-forest-700" />
                <span className="font-semibold text-earth-900">ISO 14001:2015</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-sand-200 flex items-center gap-2">
                <ShieldCheck size={16} className="text-forest-700" />
                <span className="font-semibold text-earth-900">R2v3 Standard Certified</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-sand-200 flex items-center gap-2">
                <ShieldCheck size={16} className="text-forest-700" />
                <span className="font-semibold text-earth-900">Zero Liquid Discharge (ZLD)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
