import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import RoleSwitcherModal from './RoleSwitcherModal';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import {
  Menu,
  Bell,
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const notifications = storageService.getNotifications(user?.role, user?.id);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenRoleModal={() => setRoleModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-sand-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Left section: mobile hamburger & quick context */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-earth-700 hover:text-earth-900 hover:bg-sand-100 rounded-xl transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-earth-500">
              <span className="font-semibold text-earth-800">
                {user?.role?.toUpperCase()} PORTAL
              </span>
              <span>/</span>
              <span className="text-earth-500 truncate max-w-[200px]">
                {user?.organization || user?.city || 'Central Network'}
              </span>
            </div>
          </div>

          {/* Right section: switcher, notification, profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Demo Switcher Pill */}
            <button
              type="button"
              onClick={() => setRoleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 border border-forest-200/80 text-xs font-semibold transition-all duration-150 shadow-2xs"
            >
              <Sparkles size={13} className="text-terracotta-600" />
              <span className="hidden sm:inline">Switch Demo Role</span>
              <span className="sm:hidden">Role</span>
            </button>

            {/* View Public Website Link */}
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1 text-xs text-earth-600 hover:text-forest-900 px-2.5 py-1.5 rounded-xl hover:bg-sand-100 transition-colors"
              title="Visit public landing page"
            >
              <span>Landing Page</span>
              <ExternalLink size={13} />
            </Link>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-earth-600 hover:text-earth-900 hover:bg-sand-100 rounded-xl transition-colors"
                aria-label="Notifications"
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-terracotta-600 ring-2 ring-[#FBFBF9]" />
                )}
              </button>

              {/* Notification Popover */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-sand-200 rounded-2xl shadow-elevated p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-sand-200 mb-3">
                    <span className="text-xs font-bold text-earth-900 uppercase tracking-wider">
                      Recent Alerts ({notifications.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        storageService.markAllNotificationsAsRead(user?.role);
                        setNotifDropdownOpen(false);
                      }}
                      className="text-[11px] text-forest-700 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-earth-400 py-4 text-center">
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl text-xs border transition-colors ${
                            n.read
                              ? 'bg-sand-50/50 border-sand-200/60 text-earth-600'
                              : 'bg-forest-50/50 border-forest-200/80 text-earth-900 font-medium'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-earth-900">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-earth-400 shrink-0">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-earth-600 mt-1 leading-normal">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-1">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                }
                alt={user?.name || 'User'}
                className="w-9 h-9 rounded-full object-cover border border-sand-300"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />
    </div>
  );
}
