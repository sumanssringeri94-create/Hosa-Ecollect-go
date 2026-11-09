import React from 'react';

export default function LoadingSkeleton({ type = 'card', count = 3, className = '' }) {
  if (type === 'table') {
    return (
      <div className={`space-y-3 animate-pulse ${className}`}>
        <div className="h-10 bg-sand-200/70 rounded-xl w-full" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-14 bg-sand-100 rounded-xl w-full" />
        ))}
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card p-5 h-32 bg-sand-100/60 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-sand-200" />
            <div className="space-y-2">
              <div className="h-6 bg-sand-200 rounded w-1/2" />
              <div className="h-3 bg-sand-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 animate-pulse ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-6 bg-sand-100/60 h-28 rounded-2xl" />
      ))}
    </div>
  );
}
