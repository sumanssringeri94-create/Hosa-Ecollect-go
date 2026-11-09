import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No records found',
  description = 'There are currently no items matching your criteria in the system.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`card p-10 flex flex-col items-center justify-center text-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-sand-100 border border-sand-200/90 flex items-center justify-center text-forest-800 mb-4 shadow-sm">
        <Icon size={32} />
      </div>

      <h4 className="text-lg font-bold text-earth-900 tracking-tight mb-1.5">
        {title}
      </h4>

      <p className="text-sm text-earth-500 max-w-sm leading-relaxed mb-6">
        {description}
      </p>

      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="btn-primary text-sm py-2 px-5">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
