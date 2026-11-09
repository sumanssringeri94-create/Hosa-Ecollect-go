import React from 'react';

export default function FormTextarea({
  label,
  id,
  placeholder,
  value,
  onChange,
  rows = 3,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="label flex items-center justify-between">
          <span>
            {label} {required && <span className="text-terracotta-600 font-bold">*</span>}
          </span>
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`input resize-none py-2.5 ${
          error
            ? 'border-red-400 focus:ring-red-400/20 focus:border-red-500'
            : 'border-sand-300 focus:border-forest-700'
        } ${disabled ? 'bg-sand-100/70 text-earth-500 cursor-not-allowed' : ''}`}
        {...props}
      />

      {error ? (
        <p className="text-xs text-red-600 font-medium mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-earth-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
