import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import { Truck, Plus, MapPin, Phone, Mail, CheckCircle2, XCircle, Power, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogistics() {
  const [logistics, setLogistics] = useState(storageService.getLogistics());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newPartnerForm, setNewPartnerForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    serviceArea: 'Bengaluru Central & East',
    vehicleType: 'Electric Van (Tata Ace EV)',
    vehiclePlate: 'KA-04-EV-2041',
    capacityKg: 850,
  });

  const handleToggleAvailability = (id, currentAvail) => {
    storageService.updateLogistics(id, {
      available: !currentAvail,
      status: !currentAvail ? 'Active' : 'Offline / In-Transit',
    });
    setLogistics(storageService.getLogistics());
    toast.success(`Logistics fleet status toggled to ${!currentAvail ? 'AVAILABLE' : 'OFFLINE'}`);
  };

  const handleCreatePartner = (e) => {
    e.preventDefault();
    if (!newPartnerForm.name || !newPartnerForm.company || !newPartnerForm.phone) {
      toast.error('Please enter all required logistics details.');
      return;
    }

    storageService.createLogistics(newPartnerForm);
    setLogistics(storageService.getLogistics());
    setIsAddModalOpen(false);
    toast.success(`Green fleet courier ${newPartnerForm.name} registered!`);
    setNewPartnerForm({
      name: '',
      company: '',
      phone: '',
      email: '',
      serviceArea: 'Bengaluru Central & East',
      vehicleType: 'Electric Van (Tata Ace EV)',
      vehiclePlate: 'KA-04-EV-2041',
      capacityKg: 850,
    });
  };

  const filtered = logistics.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.serviceArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Zero-Emission Logistics Fleets"
        subtitle="Manage certified electric couriers, route coverage zones, vehicle payloads, and active dispatch queues."
        badge={`${logistics.length} Couriers`}
        actions={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 shadow-sm"
          >
            <Plus size={15} /> Add Logistics Fleet
          </button>
        }
      />

      <div className="card p-4 bg-white border border-sand-300 flex items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by driver, fleet company, or service area..."
          className="w-full sm:w-80"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((l) => (
          <div
            key={l.id}
            className="card p-6 bg-white border border-sand-300 flex flex-col justify-between space-y-4 hover:border-sand-400 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-olive-100 text-olive-800 flex items-center justify-center shrink-0 border border-olive-200">
                    <Truck size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-earth-950 font-sans">
                      {l.name}
                    </h3>
                    <p className="text-xs text-earth-500">{l.company}</p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    l.available
                      ? 'bg-forest-50 text-forest-800 border-forest-300'
                      : 'bg-sand-100 text-earth-600 border-sand-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${l.available ? 'bg-forest-600' : 'bg-earth-400'}`} />
                  {l.available ? 'Available' : 'Busy / Offline'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-earth-600 pt-1">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-earth-400 shrink-0" />
                  <span>{l.serviceArea}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-earth-400 shrink-0" />
                  <span>{l.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-terracotta-500 shrink-0" />
                  <span className="font-semibold text-earth-800">{l.vehicleType}</span>
                </div>
                {l.vehiclePlate && (
                  <div className="text-[11px] font-mono text-earth-500 pl-5">
                    Registration: {l.vehiclePlate}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-sand-200 flex items-center justify-between text-xs">
              <span className="text-earth-500">
                Payload: <strong className="text-earth-900">{l.capacityKg || 800} kg</strong>
              </span>

              <button
                type="button"
                onClick={() => handleToggleAvailability(l.id, l.available)}
                className={`text-[11px] py-1 px-3 rounded-xl border font-semibold transition-colors flex items-center gap-1 ${
                  l.available
                    ? 'bg-sand-100 hover:bg-sand-200 text-earth-700 border-sand-300'
                    : 'bg-forest-100 hover:bg-forest-200 text-forest-900 border-forest-300'
                }`}
              >
                <Power size={11} />
                {l.available ? 'Mark Busy' : 'Set Available'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Partner Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Register Green Fleet Courier"
          subtitle="Add an electric cargo van, 3-wheeler or bike courier to active dispatch queue."
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleCreatePartner} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Driver / Fleet Lead *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Gowda"
                  value={newPartnerForm.name}
                  onChange={(e) => setNewPartnerForm({ ...newPartnerForm, name: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Fleet Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GreenVolt Couriers"
                  value={newPartnerForm.company}
                  onChange={(e) => setNewPartnerForm({ ...newPartnerForm, company: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98450 11223"
                  value={newPartnerForm.phone}
                  onChange={(e) => setNewPartnerForm({ ...newPartnerForm, phone: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Dispatch Email</label>
                <input
                  type="email"
                  placeholder="ramesh@greenvolt.io"
                  value={newPartnerForm.email}
                  onChange={(e) => setNewPartnerForm({ ...newPartnerForm, email: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Service Sector Area</label>
                <input
                  type="text"
                  value={newPartnerForm.serviceArea}
                  onChange={(e) => setNewPartnerForm({ ...newPartnerForm, serviceArea: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Electric Vehicle Model</label>
                <select
                  value={newPartnerForm.vehicleType}
                  onChange={(e) => setNewPartnerForm({ ...newPartnerForm, vehicleType: e.target.value })}
                  className="input cursor-pointer"
                >
                  <option>Electric Van (Tata Ace EV)</option>
                  <option>Electric 3-Wheeler Cargo</option>
                  <option>Heavy Box Electric Truck</option>
                  <option>Electric Cargo Bike</option>
                </select>
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
                Onboard Fleet Partner
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
