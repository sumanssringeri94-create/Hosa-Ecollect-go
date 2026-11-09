import React from 'react';

export default function FormInput({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  icon: Icon,
  disabled = false,
  className = '',
  min,
  max,
  step,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="label flex items-center justify-between">
          <span>
            {label} {required && <span className="text-terracotta-600 font-bold">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-earth-400 pointer-events-none">
            <Icon size={17} />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`input ${Icon ? 'pl-10' : 'px-4'} ${
            error
              ? 'border-red-400 focus:ring-red-400/20 focus:border-red-500'
              : 'border-sand-300 focus:border-forest-700'
          } ${disabled ? 'bg-sand-100/70 text-earth-500 cursor-not-allowed' : ''}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-red-600 font-medium mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-earth-500 mt-1 leading-normal">{helperText}</p>
      ) : null}
    </div>
  );
}
