import React, { useState } from 'react';
import { UploadCloud, X, Image as ImageIcon, Sparkles } from 'lucide-react';

const SAMPLE_EWaste_PHOTOS = [
  { label: 'Laptop', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80' },
  { label: 'Smartphones', url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Peripherals', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cables & Power', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Monitor', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' },
];

export default function ImageUploader({ value, onChange, label = 'Device Photo / Visual Proof' }) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="label mb-0">{label}</label>
        <span className="text-xs text-earth-400 font-normal">Optional image</span>
      </div>

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-sand-300 bg-sand-50 group">
          <img
            src={value}
            alt="Device preview"
            className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-earth-950/60 via-transparent to-transparent opacity-80" />

          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-earth-800 rounded-full shadow-md transition-all hover:scale-105"
            title="Remove image"
          >
            <X size={16} />
          </button>

          <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1.5">
            <ImageIcon size={14} /> Photo attached successfully
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 relative ${
            dragOver
              ? 'border-forest-600 bg-forest-50/50 scale-[1.01]'
              : 'border-sand-300 hover:border-forest-500 bg-sand-50/40 hover:bg-white'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 text-forest-800 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <UploadCloud size={24} />
          </div>
          <p className="text-sm font-semibold text-earth-800">
            Click to upload or drag & drop photo
          </p>
          <p className="text-xs text-earth-400 mt-1">
            PNG, JPG, WebP up to 5MB (helping recyclers identify material grade)
          </p>
        </div>
      )}

      {/* Preset demo photo selector */}
      {!value && (
        <div className="pt-1.5">
          <div className="text-[11px] font-semibold text-earth-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles size={12} className="text-terracotta-500" /> Or pick a sample device photo:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_EWaste_PHOTOS.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => onChange(sample.url)}
                className="text-xs px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-forest-100 hover:text-forest-900 text-earth-700 border border-sand-200 transition-colors"
              >
                + {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
