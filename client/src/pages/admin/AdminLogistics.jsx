import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Truck, Plus, MapPin, Phone, Mail, CheckCircle2, XCircle, Power, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogistics() {
  const [logistics, setLogistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadLogistics = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getLogistics();
      setLogistics(res.partners || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load logistics partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogistics();
  }, []);

  const filtered = logistics.filter((l) => {
    const name = (l.name || '').toLowerCase();
    const comp = (l.companyName || l.company || '').toLowerCase();
    const area = (l.serviceArea || l.city || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || comp.includes(q) || area.includes(q);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Zero-Emission Logistics Fleets"
        subtitle="Manage certified electric couriers, route coverage zones, vehicle payloads, and active dispatch queues."
        badge={`${logistics.length} Couriers`}
      />

      <div className="card p-4 bg-white border border-sand-300 flex items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by driver, fleet company, or service area..."
          className="w-full sm:w-80"
        />
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No logistics partners found"
          description="Adjust your search filter to locate fleet couriers."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((l) => {
            const lId = l._id || l.id;
            const compName = l.companyName || l.company || 'CleanTech Logistics';
            const serviceArea = l.serviceArea || l.city || 'Bengaluru Metropolitan';
            const vehicle = l.vehicleType || 'Electric Cargo Van';
            const isAvail = l.isAvailable !== false && l.available !== false;

            return (
              <div
                key={lId}
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
                        <p className="text-xs text-earth-500">{compName}</p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        isAvail
                          ? 'bg-forest-50 text-forest-800 border-forest-300'
                          : 'bg-sand-100 text-earth-600 border-sand-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isAvail ? 'bg-forest-600' : 'bg-earth-400'}`} />
                      {isAvail ? 'Available' : 'Busy / Offline'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-earth-600 pt-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-earth-400 shrink-0" />
                      <span>{serviceArea}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-earth-400 shrink-0" />
                      <span>{l.phone || 'Phone verified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-terracotta-500 shrink-0" />
                      <span className="font-semibold text-earth-800">{vehicle}</span>
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
                  <span className="badge badge-sand text-[10px]">Active Partner</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
