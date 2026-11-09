import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import { Factory, Plus, CheckCircle, XCircle, MapPin, Phone, Mail, Award, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminRecyclers() {
  const [recyclers, setRecyclers] = useState(storageService.getRecyclers());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecycler, setSelectedRecycler] = useState(null);

  const [newRecyclerForm, setNewRecyclerForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    location: 'Bengaluru, Karnataka',
    licenseNumber: 'KSPCB/EW-REG/2026/088',
    capacityTonnesPerMonth: 50,
    categoriesHandled: ['Laptops & Computers', 'Mobiles & Tablets'],
  });

  const handleToggleVerification = (id, currentStatus) => {
    storageService.verifyRecycler(id, !currentStatus);
    setRecyclers(storageService.getRecyclers());
    toast.success(`Verification status updated to ${!currentStatus ? 'VERIFIED' : 'UNVERIFIED'}`);
  };

  const handleCreateRecycler = (e) => {
    e.preventDefault();
    if (!newRecyclerForm.name || !newRecyclerForm.companyName || !newRecyclerForm.email) {
      toast.error('Please enter all required company details.');
      return;
    }

    storageService.createRecycler(newRecyclerForm);
    setRecyclers(storageService.getRecyclers());
    setIsAddModalOpen(false);
    toast.success(`Recycler facility ${newRecyclerForm.companyName} registered!`);
    setNewRecyclerForm({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      location: 'Bengaluru, Karnataka',
      licenseNumber: 'KSPCB/EW-REG/2026/088',
      capacityTonnesPerMonth: 50,
      categoriesHandled: ['Laptops & Computers', 'Mobiles & Tablets'],
    });
  };

  const filtered = recyclers.filter((r) =>
    r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Authorized Recycler Directory"
        subtitle="Accredited processing laboratories, hydrometallurgical refiners, and secondary polymer recyclers."
        badge={`${recyclers.length} Facilities`}
        actions={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 shadow-sm"
          >
            <Plus size={15} /> Add Recycler Facility
          </button>
        }
      />

      <div className="card p-4 bg-white border border-sand-300 flex items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by facility name, manager, or location..."
          className="w-full sm:w-80"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="card p-6 bg-white border border-sand-300 flex flex-col justify-between space-y-4 hover:border-sand-400 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-terracotta-100 text-terracotta-800 flex items-center justify-center shrink-0 border border-terracotta-200">
                    <Factory size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-earth-950 font-sans">
                      {r.companyName}
                    </h3>
                    <p className="text-xs text-earth-500">
                      Lead Lead / Operator: <span className="font-semibold text-earth-800">{r.name}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    r.verified
                      ? 'bg-forest-50 text-forest-800 border-forest-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  {r.verified ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {r.verified ? 'Verified' : 'Pending Audit'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-earth-600 pt-1">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-earth-400 shrink-0" />
                  <span>{r.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-earth-400 shrink-0" />
                  <span className="font-mono text-[11px]">{r.email} • {r.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-earth-400 shrink-0" />
                  <span className="font-mono text-[11px]">License: {r.licenseNumber || 'CPCB/2024'}</span>
                </div>
              </div>

              {/* Handled categories */}
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-earth-400 block mb-1">
                  Permitted Waste Streams:
                </span>
                <div className="flex flex-wrap gap-1">
                  {r.categoriesHandled?.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 rounded bg-sand-100 text-earth-800 text-[10px] font-medium border border-sand-200"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sand-200 flex items-center justify-between text-xs">
              <span className="text-earth-500">
                Monthly Capacity: <strong className="text-earth-900">{r.capacityTonnesPerMonth}t / mo</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecycler(r)}
                  className="btn-secondary text-[11px] py-1 px-3"
                >
                  Profile
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleVerification(r.id, r.verified)}
                  className={`text-[11px] py-1 px-3 rounded-xl border font-semibold transition-colors ${
                    r.verified
                      ? 'bg-sand-100 hover:bg-sand-200 text-earth-700 border-sand-300'
                      : 'bg-forest-100 hover:bg-forest-200 text-forest-900 border-forest-300'
                  }`}
                >
                  {r.verified ? 'Revoke Verification' : 'Verify Facility'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── MODAL: ADD RECYCLER FACILITY ──────────────────────── */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Onboard New Recycler Facility"
          subtitle="Register an accredited facility with environmental compliance credentials."
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleCreateRecycler} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Company / Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PureMetals Reclamation Ltd"
                  value={newRecyclerForm.companyName}
                  onChange={(e) => setNewRecyclerForm({ ...newRecyclerForm, companyName: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Facility Lead Contact *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Anil Prasad"
                  value={newRecyclerForm.name}
                  onChange={(e) => setNewRecyclerForm({ ...newRecyclerForm, name: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Facility Operations Email *</label>
                <input
                  type="email"
                  required
                  placeholder="ops@puremetals.in"
                  value={newRecyclerForm.email}
                  onChange={(e) => setNewRecyclerForm({ ...newRecyclerForm, email: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Official Phone</label>
                <input
                  type="tel"
                  placeholder="+91 (080) 2341-9900"
                  value={newRecyclerForm.phone}
                  onChange={(e) => setNewRecyclerForm({ ...newRecyclerForm, phone: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Facility Location</label>
                <input
                  type="text"
                  value={newRecyclerForm.location}
                  onChange={(e) => setNewRecyclerForm({ ...newRecyclerForm, location: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Pollution Board License</label>
                <input
                  type="text"
                  value={newRecyclerForm.licenseNumber}
                  onChange={(e) => setNewRecyclerForm({ ...newRecyclerForm, licenseNumber: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-sand-200">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-5 shadow-sm"
              >
                Register Recycler
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Recycler Profile Details Modal */}
      {selectedRecycler && (
        <Modal
          isOpen={!!selectedRecycler}
          onClose={() => setSelectedRecycler(null)}
          title={`Facility File: ${selectedRecycler.companyName}`}
          subtitle={`License ID: ${selectedRecycler.licenseNumber || 'CPCB-REG'}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-sand-100/70 rounded-2xl border border-sand-200 space-y-1">
              <span className="font-bold text-earth-900 block text-sm">{selectedRecycler.companyName}</span>
              <p className="text-earth-600">{selectedRecycler.location}</p>
            </div>

            <div className="space-y-2 p-3 bg-white rounded-xl border border-sand-200">
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Facility Director</span>
                <span className="font-semibold text-earth-900">{selectedRecycler.name}</span>
              </div>
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Contact Email & Phone</span>
                <span className="font-semibold text-earth-900">{selectedRecycler.email} • {selectedRecycler.phone}</span>
              </div>
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Monthly Quota</span>
                <span className="font-semibold text-earth-900">{selectedRecycler.capacityTonnesPerMonth} Tonnes/month</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecycler(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close File
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
