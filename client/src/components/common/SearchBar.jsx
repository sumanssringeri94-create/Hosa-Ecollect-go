import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search by ID, name, keyword...',
  className = '',
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        size={17}
        className="absolute left-3.5 text-earth-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-sand-300 text-earth-900 placeholder:text-earth-400 rounded-xl pl-10 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 transition-all duration-150"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            if (onClear) onClear();
            else onChange('');
          }}
          className="absolute right-3 p-0.5 text-earth-400 hover:text-earth-700 rounded-full hover:bg-sand-100 transition-colors"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
