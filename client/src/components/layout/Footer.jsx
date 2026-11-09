import React from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Globe,
  ShieldCheck,
  Heart,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-sand-200 border-t border-forest-900/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-forest-900/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sand-100 text-forest-950 flex items-center justify-center">
                <Recycle size={20} className="text-terracotta-600" />
              </div>
              <span className="text-xl font-bold tracking-tight text-sand-50 font-sans">
                eCollect<span className="text-terracotta-400">-Go</span>
              </span>
            </Link>

            <p className="text-sm text-sand-300 leading-relaxed max-w-sm">
              Empowering communities, verified recyclers, and zero-emission fleets to transform electronic waste into reusable circular resources.
            </p>

            {/* SDG Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-forest-900/80 border border-forest-800 text-[11px] text-sand-200 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                UN SDG 11: Sustainable Cities
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-forest-900/80 border border-forest-800 text-[11px] text-sand-200 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                UN SDG 12: Responsible Consumption
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-sand-400">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-sand-300">
              <li>
                <Link to="/how-it-works" className="hover:text-sand-50 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/e-waste-guide" className="hover:text-sand-50 transition-colors">
                  E-Waste Disposal Guide
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-sand-50 transition-colors">
                  About eCollect-Go
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-sand-50 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-sand-50 transition-colors">
                  Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* For Partners */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-sand-400">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-sm text-sand-300">
              <li>
                <Link to="/register" className="hover:text-sand-50 transition-colors">
                  Citizen Registration
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-sand-50 transition-colors">
                  Authorized Recycler Intake
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-sand-50 transition-colors">
                  Green Fleet Partner
                </Link>
              </li>
              <li>
                <Link to="/user/dashboard" className="hover:text-sand-50 transition-colors">
                  Schedule Pickup
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-sand-50 transition-colors">
                  Admin Control Tower
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-sand-400">
              Headquarters
            </h4>
            <div className="space-y-2.5 text-xs text-sand-300">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-terracotta-400 shrink-0 mt-0.5" />
                <span>Sector 4, Circular Hub, Indiranagar, Bengaluru 560038</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-terracotta-400 shrink-0" />
                <span>+91 (080) 6120-0900 (Helpline)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-terracotta-400 shrink-0" />
                <span>support@ecollect-go.org</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 pt-1">
                <ShieldCheck size={14} />
                <span>ISO 14001 Certified Protocol</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-400">
          <p>
            © {new Date().getFullYear()} eCollect-Go Platform. Developed for sustainable e-waste stewardship.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="bg-forest-900 px-2 py-0.5 rounded text-sand-300">
              Frontend Demo Prototype (All metrics labeled as sample data)
            </span>
            <span className="hover:text-sand-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-sand-200 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
