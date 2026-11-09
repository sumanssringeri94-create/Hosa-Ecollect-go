import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Recycle,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import RoleSwitcherModal from './RoleSwitcherModal';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'About', path: '/about' },
  { name: 'E-Waste Guide', path: '/e-waste-guide' },
  { name: 'Contact', path: '/contact' },
];

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, getDashboardPath } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-sand-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-forest-900 text-sand-50 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-200">
                <Recycle size={22} className="text-terracotta-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-forest-950 font-sans">
                  eCollect<span className="text-terracotta-600 font-extrabold">-Go</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-earth-500 font-medium -mt-1">
                  Circular Recycling
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-sand-100/70 p-1.5 rounded-2xl border border-sand-200/80">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-white text-forest-900 shadow-xs font-semibold'
                        : 'text-earth-700 hover:text-earth-950 hover:bg-white/60'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Demo Role Switcher Pill */}
              <button
                type="button"
                onClick={() => setRoleModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 border border-forest-200/80 text-xs font-semibold transition-all duration-150 shadow-2xs"
                title="Switch between User, Admin, Recycler and Logistics Demo Accounts"
              >
                <Sparkles size={13} className="text-terracotta-600 animate-spin-slow" />
                <span>Demo Portals</span>
                {user && (
                  <span className="ml-1 px-1.5 py-0.2 bg-white rounded-md text-[10px] text-earth-700 font-bold border border-forest-200">
                    {user.role}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <Link
                  to={getDashboardPath()}
                  className="btn-primary text-sm py-2.5 px-5"
                >
                  Go to Dashboard <ArrowRight size={15} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-earth-800 hover:text-forest-900 px-3 py-2 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-sm py-2.5 px-5"
                  >
                    Get Started <ArrowRight size={15} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setRoleModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-forest-50 text-forest-900 text-xs font-bold border border-forest-200"
              >
                Portals
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-earth-700 hover:text-earth-900 hover:bg-sand-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-sand-200 bg-[#FBFBF9] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-forest-900 text-white font-semibold'
                        : 'text-earth-700 hover:bg-sand-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-sand-200 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full text-center py-2.5"
                >
                  Enter {user.role.toUpperCase()} Dashboard
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-secondary text-center py-2 text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary text-center py-2 text-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />
    </>
  );
}
