import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterDropdown({
  label = 'Filter',
  value,
  onChange,
  options = [],
  allLabel = 'All Options',
  className = '',
}) {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full bg-white border border-sand-300 text-earth-800 text-sm font-medium rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 cursor-pointer transition-colors"
        >
          <option value="all">{allLabel}</option>
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const text = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {text}
              </option>
            );
          })}
        </select>
        <Filter
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-500 pointer-events-none"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-earth-400 text-xs">
          ▼
        </div>
      </div>
    </div>
  );
}
