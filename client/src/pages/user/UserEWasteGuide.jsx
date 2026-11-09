import React from 'react';
import { Link } from 'react-router-dom';
import EWasteGuide from '../public/EWasteGuide';
import { CalendarPlus } from 'lucide-react';

export default function UserEWasteGuide() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-sand-200">
        <div>
          <h2 className="text-2xl font-bold text-earth-950">E-Waste Preparation Handbook</h2>
          <p className="text-xs text-earth-500">Guidelines for safe handling, packaging, and data wiped devices.</p>
        </div>
        <Link to="/user/schedule" className="btn-primary text-xs py-2 px-4">
          <CalendarPlus size={14} /> Schedule Pickup
        </Link>
      </div>

      <EWasteGuide />
    </div>
  );
}
