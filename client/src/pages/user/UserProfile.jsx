import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import UserAvatar from '../../components/common/UserAvatar';
import { User, Mail, Phone, MapPin, Award, Leaf, Save, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'Sarah Chen',
    email: user?.email || 'sarah.chen@gmail.com',
    phone: user?.phone || '+91 98860 12345',
    city: user?.city || 'Bengaluru',
    address: user?.address || 'Apartment 4B, Whispering Palms, 12th Main Road, Indiranagar',
    pincode: user?.pincode || '560038',
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Account & Environmental Profile"
        subtitle="Manage your contact details, doorstep pickup coordinates, and circular milestones."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Profile Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSave} className="card p-6 sm:p-8 bg-white border border-sand-300 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-sand-200">
              <UserAvatar
                name={user?.name}
                className="w-16 h-16 text-2xl border-2 border-forest-200"
              />
              <div>
                <h3 className="text-lg font-bold text-earth-950">{user?.name || 'Sarah Chen'}</h3>
                <span className="badge badge-forest text-[11px] mt-1">Verified Citizen Recycler</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="input bg-sand-100 text-earth-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Mobile Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Operating City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label">Default Pickup Address</label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input resize-none"
              />
            </div>

            <div>
              <label className="label">Postal Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="input"
              />
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-primary text-xs py-2.5 px-6 shadow-sm">
                <Save size={15} /> Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right: Personal Sustainability Scorecard */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card p-6 bg-sand-50/70 border border-sand-300 space-y-4">
            <div className="flex items-center gap-2 text-forest-800">
              <Leaf size={20} />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                My Eco Scorecard
              </h4>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-[10px] uppercase font-bold text-earth-400 block">Total Requests</span>
                <span className="text-2xl font-bold font-serif text-earth-950">4 Pickups</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-[10px] uppercase font-bold text-earth-400 block">Diverted E-Waste</span>
                <span className="text-2xl font-bold font-serif text-forest-900">18.2 kg</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-[10px] uppercase font-bold text-earth-400 block">Avoided Greenhouse CO₂</span>
                <span className="text-2xl font-bold font-serif text-terracotta-600">42.6 kg</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-forest-100 text-forest-900 text-xs flex items-center gap-2 font-medium">
              <Award size={18} className="text-forest-800 shrink-0" />
              <span>Tier 2 Green Citizen Champion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
