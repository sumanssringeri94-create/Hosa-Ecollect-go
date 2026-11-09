import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import { Boxes, Sparkles, Scale, TrendingUp, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecyclerInventory() {
  const INVENTORY_ITEMS = [
    { name: 'Refined Gold (99.9% Hydrometallurgical Grain)', grade: 'Bullion Grade', stock: '840.5 g', purity: '99.92%', destination: 'Semiconductor Foundry Partner', trend: '+140g this week' },
    { name: 'High-Purity Copper Cathode Plates', grade: 'Grade A', stock: '4,120 kg', purity: '99.95%', destination: 'EV Motor Winding Manufacturer', trend: '+350kg this week' },
    { name: 'Extruded Aluminum Ingot Scrap', grade: '6000-Series', stock: '8,450 kg', purity: '98.5%', destination: 'Architectural Framing Co', trend: '+600kg this week' },
    { name: 'Sorted ABS Polymer Flake', grade: 'Pelletized', stock: '6,200 kg', purity: '99.0%', destination: 'Circular Enclosure Injection Molder', trend: '+450kg this week' },
    { name: 'Lithium Carbonate Salt Fraction', grade: 'Technical Grade', stock: '920 kg', purity: '95.2%', destination: 'Cathode Precursor Refinery', trend: '+80kg this week' },
    { name: 'Polycarbonate Optical Grade Flake', grade: 'Re-granulated', stock: '2,150 kg', purity: '99.1%', destination: 'Automotive Light Cluster Fabricator', trend: '+190kg this week' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recovered Secondary Raw Materials Stock"
        subtitle="Live warehouse assay ledger of precious metals, engineering polymers, and strategic battery salts."
        badge="Secondary Ore Vault"
        actions={
          <button
            type="button"
            onClick={() => toast.success('Vault assay report downloaded (PDF).')}
            className="btn-secondary text-xs py-2 px-3.5"
          >
            <Download size={14} /> Export Vault Assay
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INVENTORY_ITEMS.map((item) => (
          <div
            key={item.name}
            className="card p-6 bg-white border border-sand-300 flex flex-col justify-between space-y-4 hover:border-sand-400 transition-colors"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="badge badge-sand text-[10px] font-bold">{item.grade}</span>
                <span className="text-[11px] font-semibold text-forest-800 bg-forest-50 px-2 py-0.5 rounded">
                  {item.purity} Pure
                </span>
              </div>

              <h3 className="text-base font-bold text-earth-950 font-sans leading-snug">
                {item.name}
              </h3>

              <div className="p-3 bg-sand-50/70 rounded-xl border border-sand-200">
                <span className="text-[10px] uppercase font-bold text-earth-400 block">Warehouse Stock</span>
                <span className="text-2xl font-bold font-serif text-forest-900">{item.stock}</span>
                <span className="text-[10px] text-terracotta-600 font-semibold block mt-0.5">{item.trend}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-sand-100 text-[11px] text-earth-600">
              <span className="text-earth-400 block text-[10px] uppercase font-bold">Designated Offtaker:</span>
              <span className="font-semibold text-earth-900">{item.destination}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
