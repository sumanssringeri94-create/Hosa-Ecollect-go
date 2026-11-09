import React from 'react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  trend,
  trendPositive = true,
  colorScheme = 'forest', // 'forest', 'terracotta', 'olive', 'sand'
  isSample = true,
  className = '',
}) {
  const colorMap = {
    forest: {
      iconBg: 'bg-forest-100 text-forest-800',
      accentBorder: 'hover:border-forest-300',
    },
    terracotta: {
      iconBg: 'bg-terracotta-100 text-terracotta-800',
      accentBorder: 'hover:border-terracotta-300',
    },
    olive: {
      iconBg: 'bg-olive-100 text-olive-800',
      accentBorder: 'hover:border-olive-300',
    },
    sand: {
      iconBg: 'bg-sand-200 text-earth-800',
      accentBorder: 'hover:border-sand-400',
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.forest;

  return (
    <div
      className={`card p-5 relative overflow-hidden transition-all duration-200 ${scheme.accentBorder} ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${scheme.iconBg}`}>
          {Icon && <Icon size={22} />}
        </div>

        <div className="flex flex-col items-end gap-1">
          {trend && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                trendPositive
                  ? 'bg-forest-50 text-forest-700 border border-forest-200/60'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/60'
              }`}
            >
              {trend}
            </span>
          )}
          {isSample && (
            <span className="text-[10px] tracking-wider uppercase font-medium text-earth-400">
              Sample Data
            </span>
          )}
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-bold text-earth-900 tracking-tight">
          {value}
        </div>
        <div className="text-sm font-medium text-earth-600 mt-0.5">{label}</div>
        {subtext && <div className="text-xs text-earth-400 mt-2">{subtext}</div>}
      </div>
    </div>
  );
}
