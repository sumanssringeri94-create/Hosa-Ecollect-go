import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-forest-50 border border-forest-200 text-forest-800 flex items-center justify-center mb-6 shadow-sm">
        <Recycle size={32} className="text-terracotta-600" />
      </div>

      <div className="text-5xl sm:text-6xl font-serif font-bold text-earth-950 mb-3">
        404
      </div>

      <h1 className="editorial-title text-2xl sm:text-3xl font-bold text-earth-900 mb-2">
        Page Not Found
      </h1>

      <p className="text-sm text-earth-600 max-w-md leading-relaxed mb-8">
        The destination you are attempting to reach does not exist or may have been relocated within our circular network.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/" className="btn-primary text-xs py-2.5 px-6 shadow-sm">
          <Home size={15} /> Back to Home
        </Link>
        <Link to="/user/dashboard" className="btn-secondary text-xs py-2.5 px-6">
          Citizen Portal
        </Link>
      </div>
    </div>
  );
}
