import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  pageSize = 10,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-sand-200 text-xs text-earth-600 ${className}`}
    >
      <div>
        Showing <span className="font-semibold text-earth-900">{startItem}</span> to{' '}
        <span className="font-semibold text-earth-900">{endItem}</span> of{' '}
        <span className="font-semibold text-earth-900">{totalItems}</span> records
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-sand-300 bg-white hover:bg-sand-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 rounded-lg font-medium text-xs transition-colors ${
              currentPage === pageNum
                ? 'bg-forest-900 text-sand-50 font-bold shadow-sm'
                : 'bg-white border border-sand-300 text-earth-700 hover:bg-sand-100'
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-sand-300 bg-white hover:bg-sand-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
