import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../common/UserAvatar';
import {
  LayoutDashboard,
  CalendarPlus,
  Package,
  Compass,
  BookOpen,
  Bell,
  User,
  LogOut,
  Users,
  Factory,
  Truck,
  Layers,
  BarChart3,
  Settings,
  Recycle,
  Sparkles,
  CheckSquare,
  Boxes,
  FileText,
  Clock,
  MapPin,
  X,
} from 'lucide-react';

export const SIDEBAR_CONFIGS = {
  user: [
    { name: 'Overview', path: '/user/dashboard', icon: LayoutDashboard },
    { name: 'My Pickup Requests', path: '/user/pickups', icon: Package },
    { name: 'Schedule Pickup', path: '/user/schedule', icon: CalendarPlus, highlight: true },
    { name: 'Track Collection', path: '/user/track', icon: Compass },
    { name: 'E-Waste Guide', path: '/user/guide', icon: BookOpen },
    { name: 'Notifications', path: '/user/notifications', icon: Bell },
    { name: 'Profile Settings', path: '/user/profile', icon: User },
  ],
  admin: [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Pickup Requests', path: '/admin/pickups', icon: Package },
    { name: 'User Directory', path: '/admin/users', icon: Users },
    { name: 'Recycler Partners', path: '/admin/recyclers', icon: Factory },
    { name: 'Logistics Fleets', path: '/admin/logistics', icon: Truck },
    { name: 'Assignments Matrix', path: '/admin/assignments', icon: CheckSquare, highlight: true },
    { name: 'E-Waste Categories', path: '/admin/categories', icon: Layers },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ],
  recycler: [
    { name: 'Dashboard', path: '/recycler/dashboard', icon: LayoutDashboard },
    { name: 'Assigned Requests', path: '/recycler/assigned', icon: Package },
    { name: 'Incoming E-Waste', path: '/recycler/incoming', icon: Truck },
    { name: 'Recycling Operations', path: '/recycler/operations', icon: Recycle, highlight: true },
    { name: 'Recovered Inventory', path: '/recycler/inventory', icon: Boxes },
    { name: 'Material Reports', path: '/recycler/reports', icon: FileText },
    { name: 'Facility Profile', path: '/recycler/profile', icon: User },
  ],
  logistics: [
    { name: 'Dashboard', path: '/logistics/dashboard', icon: LayoutDashboard },
    { name: 'Assigned Pickups', path: '/logistics/pickups', icon: Package },
    { name: 'Collection Schedule', path: '/logistics/schedule', icon: Clock },
    { name: 'Pickup History', path: '/logistics/history', icon: CheckSquare },
    { name: 'Delivery Status & Map', path: '/logistics/delivery', icon: MapPin, highlight: true },
    { name: 'Driver Profile', path: '/logistics/profile', icon: User },
  ],
};

const ROLE_THEMES = {
  user: {
    badge: 'Citizen Portal',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    activeBg: 'bg-forest-900 text-sand-50 shadow-sm',
    accentText: 'text-forest-700',
  },
  admin: {
    badge: 'Admin Control Tower',
    badgeColor: 'bg-forest-100 text-forest-900 border-forest-300 font-bold',
    activeBg: 'bg-forest-950 text-sand-50 shadow-sm',
    accentText: 'text-forest-900',
  },
  recycler: {
    badge: 'Recycling Facility',
    badgeColor: 'bg-terracotta-100 text-terracotta-900 border-terracotta-300 font-semibold',
    activeBg: 'bg-terracotta-600 text-white shadow-sm',
    accentText: 'text-terracotta-600',
  },
  logistics: {
    badge: 'Logistics Fleet',
    badgeColor: 'bg-olive-100 text-olive-900 border-olive-300 font-semibold',
    activeBg: 'bg-olive-800 text-sand-50 shadow-sm',
    accentText: 'text-olive-700',
  },
};

export default function Sidebar({ isOpen, onClose, onOpenRoleModal }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role || 'user';
  const navItems = SIDEBAR_CONFIGS[role] || SIDEBAR_CONFIGS.user;
  const theme = ROLE_THEMES[role] || ROLE_THEMES.user;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-earth-950/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-[#FAF8F5] border-r border-sand-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="h-20 px-6 border-b border-sand-200 flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-900 text-sand-50 flex items-center justify-center shadow-xs">
                <Recycle size={20} className="text-terracotta-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-forest-950">
                  eCollect<span className="text-terracotta-600">-Go</span>
                </span>
                <span className="text-[10px] tracking-wider text-earth-500 font-medium">
                  Smart E-Waste Platform
                </span>
              </div>
            </NavLink>

            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 text-earth-500 hover:text-earth-900 rounded-lg hover:bg-sand-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Role Pill Banner */}
          <div className="px-5 py-3 border-b border-sand-200/70 bg-sand-100/50 flex items-center justify-between">
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${theme.badgeColor}`}>
              {theme.badge}
            </span>

            <button
              type="button"
              onClick={onOpenRoleModal}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta-700 hover:text-terracotta-900 hover:underline"
              title="Switch demo persona"
            >
              <Sparkles size={12} /> Switch Role
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? theme.activeBg
                      : 'text-earth-700 hover:text-earth-950 hover:bg-sand-200/60'
                  }`}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 ${
                      isActive ? 'text-inherit' : 'text-earth-400'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                  {item.highlight && !isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-terracotta-500" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Area */}
        <div className="p-4 border-t border-sand-200 bg-[#FAF8F5]">
          <div className="p-3 rounded-2xl bg-white border border-sand-200 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <UserAvatar
                name={user?.name}
                className="w-9 h-9 border border-sand-300 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-earth-900 truncate">
                  {user?.name || 'Sarah Chen'}
                </div>
                <div className="text-[11px] text-earth-500 truncate">
                  {user?.email || 'user@ecollect.go'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-earth-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
