import React from 'react';

export default function ChartCard({
  title,
  subtitle,
  actions,
  children,
  className = '',
  isSample = true,
}) {
  return (
    <div className={`card p-6 flex flex-col justify-between ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-earth-900 tracking-tight">
              {title}
            </h3>
            {isSample && (
              <span className="text-[10px] uppercase font-semibold text-earth-400 bg-sand-100 px-2 py-0.5 rounded-full border border-sand-200">
                Sample Metric
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-earth-500 mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      <div className="w-full h-full min-h-[260px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
