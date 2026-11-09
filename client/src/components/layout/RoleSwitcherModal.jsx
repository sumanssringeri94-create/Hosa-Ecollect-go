import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import {
  User,
  Shield,
  Factory,
  Truck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { resetDemoData } from '../../services/storageService';
import toast from 'react-hot-toast';

const ROLE_CARDS = [
  {
    role: 'user',
    title: 'Citizen / Enterprise User',
    name: 'Sarah Chen',
    email: 'sarah.chen@gmail.com',
    icon: User,
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    hover: 'hover:border-emerald-400',
    description: 'Submit e-waste pickup requests, track live collection progress, view eco impact & recycling certificates.',
    path: '/user/dashboard',
  },
  {
    role: 'admin',
    title: 'Platform Administrator',
    name: 'Elena Rostova',
    email: 'admin@ecollect.go',
    icon: Shield,
    color: 'bg-forest-100 text-forest-900 border-forest-300',
    hover: 'hover:border-forest-500',
    description: 'Verify manifests, assign authorized recyclers and EV fleets, manage directories, review system analytics.',
    path: '/admin/dashboard',
  },
  {
    role: 'recycler',
    title: 'Certified Recycler Partner',
    name: 'Marcus Vance (EcoCycle)',
    email: 'operations@ecocycle.com',
    icon: Factory,
    color: 'bg-terracotta-100 text-terracotta-900 border-terracotta-200',
    hover: 'hover:border-terracotta-400',
    description: 'Inspect incoming electronics, update processing stages, record recovered precious metals and raw polymers.',
    path: '/recycler/dashboard',
  },
  {
    role: 'logistics',
    title: 'Green Logistics Partner',
    name: 'Ravi Kumar (GreenRoute EV)',
    email: 'dispatch@greenroute.io',
    icon: Truck,
    color: 'bg-olive-100 text-olive-900 border-olive-300',
    hover: 'hover:border-olive-500',
    description: 'Accept doorstep pickup dispatches, follow route coordinates, verify collection handoff to recycling centers.',
    path: '/logistics/dashboard',
  },
];

export default function RoleSwitcherModal({ isOpen, onClose }) {
  const { user, switchAccount } = useAuth();
  const navigate = useNavigate();

  const handleSelectRole = (card) => {
    switchAccount(card.role);
    onClose();
    navigate(card.path);
  };

  const handleReset = () => {
    resetDemoData();
    switchAccount('user');
    toast.success('All demo datasets reset to factory defaults.');
    onClose();
    window.location.reload();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Demo Experience Hub — Switch Role"
      subtitle="Select any user persona to test the platform workflows end-to-end without credentials."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ROLE_CARDS.map((card) => {
            const Icon = card.icon;
            const isCurrent = user?.role === card.role;

            return (
              <div
                key={card.role}
                onClick={() => handleSelectRole(card)}
                className={`card p-4.5 cursor-pointer relative transition-all duration-200 ${
                  isCurrent
                    ? 'ring-2 ring-forest-800 bg-sand-50/90 shadow-md'
                    : `bg-white ${card.hover}`
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-3 right-3 badge badge-forest text-[10px] py-0.5">
                    <CheckCircle size={11} /> Current Role
                  </span>
                )}

                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${card.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 pr-6">
                    <h4 className="text-sm font-bold text-earth-900 truncate">
                      {card.title}
                    </h4>
                    <p className="text-xs text-earth-500 truncate">
                      {card.name}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-earth-600 leading-relaxed mb-3 line-clamp-2">
                  {card.description}
                </p>

                <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-sand-200/80">
                  <span className="text-earth-400 font-mono text-[11px] truncate">
                    {card.email}
                  </span>
                  <span className="text-forest-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Enter <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset Demo Data button */}
        <div className="pt-3 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-earth-500">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-terracotta-500" />
            <span>State persists in localStorage across browser reloads.</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-earth-600 hover:text-red-700 hover:underline transition-colors py-1"
          >
            <RotateCcw size={13} />
            <span>Reset Demo Data to Initial</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
