import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_CATEGORIES } from '../../data/mockData';
import {
  BookOpen,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Smartphone,
  HardDrive,
  Battery,
  Sparkles,
} from 'lucide-react';

export default function EWasteGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('accepted');

  const filteredCategories = INITIAL_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.recoverableMaterials.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const ACCEPTED_ITEMS = [
    'Laptops, MacBooks, Chromebooks, Ultrabooks',
    'Desktop Towers, Servers, Workstations, Motherboards',
    'Smartphones, Feature Phones, Landline Phones, Walkie-talkies',
    'iPads, Android Tablets, Kindle E-readers',
    'Monitors, LCD/LED Screens, Television displays',
    'Keyboards, Mice, Webcams, Headsets, External HDDs',
    'Power Adapters, Charging Bricks, USB Cords, HDMI Cables',
    'UPS Battery Backup Units, Power Banks, Laptop Batteries',
    'Printers, Scanners, WiFi Routers, Modems, Switches',
  ];

  const RESTRICTED_ITEMS = [
    'Leaking car batteries without secondary acid containment',
    'Unenclosed, broken mercury fluorescent tube lamps (CFLs)',
    'Radioactive smoke detectors with americium chambers',
    'Bio-medical diagnostic machines containing biohazard residues',
    'Large white goods / Freon refrigerators (Contact municipal bulky service)',
  ];

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge badge-forest text-xs font-semibold">
          Comprehensive Recycling Reference
        </span>
        <h1 className="editorial-title text-4xl sm:text-6xl font-bold text-earth-950">
          The eCollect-Go E-Waste Guide
        </h1>
        <p className="text-earth-600 text-base sm:text-lg leading-relaxed">
          Learn what electronic items qualify for doorstep pickup, how to securely wipe your data, and how to safely prepare batteries.
        </p>
      </div>

      {/* Accepted vs Restricted Dual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Accepted */}
        <div className="card p-7 bg-white border border-forest-200 space-y-4">
          <div className="flex items-center gap-2.5 text-forest-800">
            <CheckCircle size={22} className="text-forest-700" />
            <h3 className="text-lg font-bold text-earth-950">Accepted for Doorstep Pickup</h3>
          </div>
          <p className="text-xs text-earth-500">
            All items below are accepted for free domestic collection and certified processing.
          </p>
          <ul className="space-y-2.5 text-xs text-earth-700 pt-2 border-t border-sand-200">
            {ACCEPTED_ITEMS.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-forest-700 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Restricted */}
        <div className="card p-7 bg-white border border-red-200 space-y-4">
          <div className="flex items-center gap-2.5 text-red-700">
            <XCircle size={22} className="text-red-600" />
            <h3 className="text-lg font-bold text-earth-950">Excluded & Special Handled Items</h3>
          </div>
          <p className="text-xs text-earth-500">
            Items requiring hazardous materials certification or municipal large-appliance disposal.
          </p>
          <ul className="space-y-2.5 text-xs text-earth-700 pt-2 border-t border-sand-200">
            {RESTRICTED_ITEMS.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3 Step Device Prep Guide */}
      <div className="card p-8 sm:p-10 bg-sand-100/70 border border-sand-300 rounded-3xl space-y-6">
        <div>
          <span className="badge badge-olive text-xs font-semibold mb-2">Step-by-Step Instructions</span>
          <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-earth-950">
            How to Prepare Your Devices Before Collection
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white rounded-2xl border border-sand-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center font-bold font-serif text-lg">
              1
            </div>
            <h4 className="text-sm font-bold text-earth-900">Backup & Wipe Data</h4>
            <p className="text-xs text-earth-600 leading-relaxed">
              Back up your files to an external drive or cloud. Log out of iCloud/Google accounts and perform a factory reset.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-sand-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-terracotta-50 text-terracotta-700 flex items-center justify-center font-bold font-serif text-lg">
              2
            </div>
            <h4 className="text-sm font-bold text-earth-900">Tape Battery Terminals</h4>
            <p className="text-xs text-earth-600 leading-relaxed">
              For loose lithium or power cells, place a strip of electrical tape across the copper terminals to prevent short-circuits.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-sand-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-olive-50 text-olive-800 flex items-center justify-center font-bold font-serif text-lg">
              3
            </div>
            <h4 className="text-sm font-bold text-earth-900">Bundle Accessories</h4>
            <p className="text-xs text-earth-600 leading-relaxed">
              Keep power adapters, remotes, and cables in a small cardboard box or reusable cloth bag ready for the courier.
            </p>
          </div>
        </div>
      </div>

      {/* Category Directory with Search */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="editorial-title text-2xl sm:text-3xl font-bold text-earth-950">
              Detailed Stream Directory
            </h3>
            <p className="text-xs text-earth-500 mt-1">
              Explore recoverable material grades and handling requirements.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
            <input
              type="text"
              placeholder="Search category or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-sand-300 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="card p-6 bg-white border border-sand-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="badge badge-sand text-[10px]">{cat.hazardRating} Hazard</span>
                  <span className="text-[11px] text-earth-400 font-medium">{cat.averageWeight}</span>
                </div>

                <h4 className="text-base font-bold text-earth-950">{cat.name}</h4>
                <p className="text-xs text-earth-600 leading-relaxed">{cat.description}</p>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-earth-700 uppercase tracking-wider block mb-1">
                    Recoverable:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cat.recoverableMaterials.map((m) => (
                      <span key={m} className="px-2 py-0.5 rounded bg-sand-100 text-earth-800 text-[10px] font-medium border border-sand-200">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-sand-100 flex items-center justify-between">
                <span className="text-xs text-earth-500 italic truncate max-w-[180px]">{cat.disposalTip}</span>
                <Link to="/user/schedule" className="text-xs font-bold text-forest-800 hover:underline shrink-0">
                  Schedule →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
