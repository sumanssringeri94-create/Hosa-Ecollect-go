import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Factory, Plus, CheckCircle, XCircle, MapPin, Phone, Mail, Award, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminRecyclers() {
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecycler, setSelectedRecycler] = useState(null);

  const loadRecyclers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getRecyclers();
      setRecyclers(res.recyclers || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load recyclers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecyclers();
  }, []);

  const handleToggleVerification = async (recycler) => {
    const id = recycler._id || recycler.id;
    const currentVer = recycler.isVerified !== undefined ? recycler.isVerified : recycler.verified;
    try {
      await adminApi.verifyRecycler(id, !currentVer);
      toast.success(`Verification status updated to ${!currentVer ? 'VERIFIED' : 'UNVERIFIED'}`);
      await loadRecyclers();
    } catch (err) {
      toast.error(err.message || 'Failed to update verification status');
    }
  };

  const filtered = recyclers.filter((r) => {
    const cName = (r.companyName || r.name || '').toLowerCase();
    const lead = (r.name || '').toLowerCase();
    const loc = (r.location || r.city || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return cName.includes(q) || lead.includes(q) || loc.includes(q);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Authorized Recycler Directory"
        subtitle="Accredited processing laboratories, hydrometallurgical refiners, and secondary polymer recyclers."
        badge={`${recyclers.length} Facilities`}
      />

      <div className="card p-4 bg-white border border-sand-300 flex items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by facility name, manager, or location..."
          className="w-full sm:w-80"
        />
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No recycler facilities found"
          description="Adjust your search criteria to view registered recycling partners."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((r) => {
            const rId = r._id || r.id;
            const isVer = r.isVerified !== undefined ? r.isVerified : r.verified;
            const compName = r.companyName || r.name;
            const loc = r.location || r.city || 'Bengaluru, Karnataka';
            const categories = r.categoriesHandled || ['Laptops & Computers', 'Mobiles & Tablets', 'Peripherals'];

            return (
              <div
                key={rId}
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
                          {compName}
                        </h3>
                        <p className="text-xs text-earth-500">
                          Lead / Operator: <span className="font-semibold text-earth-800">{r.name}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        isVer
                          ? 'bg-forest-50 text-forest-800 border-forest-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {isVer ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {isVer ? 'Verified' : 'Pending Audit'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-earth-600 pt-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-earth-400 shrink-0" />
                      <span>{loc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-earth-400 shrink-0" />
                      <span className="font-mono text-[11px]">{r.email} • {r.phone || 'Phone verified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={14} className="text-earth-400 shrink-0" />
                      <span className="font-mono text-[11px]">License: {r.licenseNumber || 'KSPCB/EW-REG/2026/088'}</span>
                    </div>
                  </div>

                  {/* Handled categories */}
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-earth-400 block mb-1">
                      Permitted Waste Streams:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {categories.map((cat) => (
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
                    Monthly Capacity: <strong className="text-earth-900">{r.capacityTonnesPerMonth || 50}t / mo</strong>
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
                      onClick={() => handleToggleVerification(r)}
                      className={`text-[11px] py-1 px-3 rounded-xl border font-semibold transition-colors ${
                        isVer
                          ? 'bg-sand-100 hover:bg-sand-200 text-earth-700 border-sand-300'
                          : 'bg-forest-100 hover:bg-forest-200 text-forest-900 border-forest-300'
                      }`}
                    >
                      {isVer ? 'Revoke Verification' : 'Verify Facility'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recycler Profile Details Modal */}
      {selectedRecycler && (
        <Modal
          isOpen={!!selectedRecycler}
          onClose={() => setSelectedRecycler(null)}
          title={`Facility File: ${selectedRecycler.companyName || selectedRecycler.name}`}
          subtitle={`License ID: ${selectedRecycler.licenseNumber || 'CPCB-REG'}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-sand-100/70 rounded-2xl border border-sand-200 space-y-1">
              <span className="font-bold text-earth-900 block text-sm">{selectedRecycler.companyName || selectedRecycler.name}</span>
              <p className="text-earth-600">{selectedRecycler.location || selectedRecycler.city || 'Bengaluru, Karnataka'}</p>
            </div>
            <div className="space-y-2 p-3 bg-white rounded-xl border border-sand-200">
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Facility Lead</span>
                <span className="font-semibold text-earth-900">{selectedRecycler.name}</span>
              </div>
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Email & Contact</span>
                <span className="font-semibold text-earth-900">{selectedRecycler.email} • {selectedRecycler.phone || '—'}</span>
              </div>
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Accreditation</span>
                <span className="font-semibold text-earth-900">{selectedRecycler.isVerified ? 'Accredited Facility' : 'Pending Verification'}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecycler(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
