import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import { Truck, ShieldCheck, Zap, Phone, Mail, MapPin, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LogisticsProfile() {
  const { user } = useAuth();

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Driver & EV vehicle parameters saved.');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Driver & EV Fleet Profile"
        subtitle="Vehicle payload limits, green transit credentials, and assigned service sectors."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <form onSubmit={handleSave} className="card p-6 sm:p-8 bg-white border border-sand-300 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-sand-200">
              <div className="w-16 h-16 rounded-2xl bg-olive-100 text-olive-800 flex items-center justify-center border-2 border-olive-200">
                <Truck size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-earth-950">{user?.name || 'Ravi Kumar'}</h3>
                <span className="badge badge-olive text-[11px] mt-1">Verified Electric Fleet Partner</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Driver Name</label>
                <input type="text" defaultValue={user?.name || 'Ravi Kumar'} className="input" />
              </div>
              <div>
                <label className="label">Fleet Operator</label>
                <input type="text" defaultValue={user?.organization || 'GreenRoute EcoFleet'} className="input" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Assigned Vehicle</label>
                <input type="text" defaultValue="Tata Ace Electric (KA-03-EV-1029)" className="input" />
              </div>
              <div>
                <label className="label">Payload Capacity</label>
                <input type="text" defaultValue="850 kg Gross" className="input" />
              </div>
            </div>

            <div>
              <label className="label">Primary Service Corridor</label>
              <input type="text" defaultValue="Bengaluru Central & East (Indiranagar, Koramangala, Whitefield)" className="input" />
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-primary text-xs py-2.5 px-6 shadow-sm">
                <Save size={14} /> Update Fleet Profile
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="card p-5 bg-sand-50/70 border border-sand-300 space-y-3 text-xs">
            <h4 className="font-bold text-earth-950 uppercase tracking-wider text-[11px]">
              Fleet Verification
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 bg-white rounded-xl border border-sand-200 flex items-center gap-2">
                <ShieldCheck size={16} className="text-forest-700" />
                <span className="font-semibold text-earth-900">Zero-Emission Fleet Validated</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-sand-200 flex items-center gap-2">
                <ShieldCheck size={16} className="text-forest-700" />
                <span className="font-semibold text-earth-900">Lithium Cell Transit Certified</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-sand-200 flex items-center gap-2">
                <ShieldCheck size={16} className="text-forest-700" />
                <span className="font-semibold text-earth-900">Commercial EV Registration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
