import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import Modal from '../../components/common/Modal';
import { Layers, Plus, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState(storageService.getCategories());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newCat, setNewCat] = useState({
    id: '',
    name: '',
    description: '',
    averageWeight: '1.5 kg',
    hazardRating: 'Medium',
    recoverableMaterials: 'Gold, Copper, Aluminum, ABS Plastic',
    disposalTip: 'Remove batteries prior to dispatch.',
  });

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCat.name || !newCat.description) return;

    const formattedCat = {
      id: newCat.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: newCat.name,
      description: newCat.description,
      averageWeight: newCat.averageWeight,
      hazardRating: newCat.hazardRating,
      recoverableMaterials: newCat.recoverableMaterials.split(',').map((s) => s.trim()),
      disposalTip: newCat.disposalTip,
      isPopular: false,
    };

    const updated = [...categories, formattedCat];
    storageService.saveCategories(updated);
    setCategories(updated);
    setIsAddModalOpen(false);
    toast.success(`Category ${newCat.name} registered into taxonomy!`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="E-Waste Taxonomy & Stream Rules"
        subtitle="Manage accepted equipment categories, hazard classification ratings, and recoverable secondary materials."
        badge={`${categories.length} Regulated Streams`}
        actions={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 shadow-sm"
          >
            <Plus size={15} /> Add Category
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="card p-6 bg-white border border-sand-300 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="badge badge-sand text-[10px] font-semibold">
                  {cat.hazardRating} Hazard
                </span>
                <span className="text-[11px] text-earth-500 font-medium">
                  {cat.averageWeight}
                </span>
              </div>

              <h3 className="text-base font-bold text-earth-950 font-sans">
                {cat.name}
              </h3>

              <p className="text-xs text-earth-600 leading-relaxed">
                {cat.description}
              </p>

              <div>
                <span className="text-[10px] uppercase font-bold text-earth-400 block mb-1">
                  Recoverable Fractions:
                </span>
                <div className="flex flex-wrap gap-1">
                  {cat.recoverableMaterials?.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded bg-sand-100 text-earth-800 text-[10px] font-medium border border-sand-200"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-sand-100 text-[11px] text-earth-500 italic">
              Tip: {cat.disposalTip}
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New E-Waste Stream Category"
          subtitle="Define accepted device taxonomy, hazard ratings, and material fractions."
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="label">Category Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Smart Wearables & IoT Sensors"
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                rows={2}
                required
                placeholder="Smartwatches, fitness bands, smart rings, health telemetry tags..."
                value={newCat.description}
                onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                className="input resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Average Weight</label>
                <input
                  type="text"
                  value={newCat.averageWeight}
                  onChange={(e) => setNewCat({ ...newCat, averageWeight: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Hazard Classification</label>
                <select
                  value={newCat.hazardRating}
                  onChange={(e) => setNewCat({ ...newCat, hazardRating: e.target.value })}
                  className="input cursor-pointer"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High (Li-ion Batteries)</option>
                  <option>Critical (Mercury / Lead)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Recoverable Fractions (Comma separated)</label>
              <input
                type="text"
                value={newCat.recoverableMaterials}
                onChange={(e) => setNewCat({ ...newCat, recoverableMaterials: e.target.value })}
                className="input"
              />
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
                Create Category
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
