import React from 'react';

export default function FormSelect({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="label flex items-center justify-between">
          <span>
            {label} {required && <span className="text-terracotta-600 font-bold">*</span>}
          </span>
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`input appearance-none pr-9 cursor-pointer ${
            error
              ? 'border-red-400 focus:ring-red-400/20 focus:border-red-500'
              : 'border-sand-300 focus:border-forest-700'
          } ${disabled ? 'bg-sand-100/70 text-earth-500 cursor-not-allowed' : ''}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
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
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-earth-400 text-xs">
          ▼
        </div>
      </div>

      {error ? (
        <p className="text-xs text-red-600 font-medium mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-earth-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
