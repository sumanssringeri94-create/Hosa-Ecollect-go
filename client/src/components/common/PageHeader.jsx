import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({
  title,
  subtitle,
  badge,
  backUrl,
  actions,
  className = '',
}) {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-sand-200/80 ${className}`}>
      <div className="flex items-start gap-3">
        {backUrl && (
          <button
            onClick={() => navigate(backUrl)}
            className="p-2 -ml-1 text-earth-500 hover:text-earth-900 hover:bg-sand-100 rounded-xl transition-colors shrink-0 mt-0.5"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-earth-900 tracking-tight">
              {title}
            </h1>
            {badge && (
              <span className="badge badge-forest text-xs font-semibold">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-earth-600 mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
