import React from 'react';
import {
  Clock,
  CheckCircle2,
  Truck,
  RotateCw,
  Award,
  XCircle,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const STATUS_CONFIG = {
  submitted: {
    label: 'Submitted',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200/80',
    icon: Clock,
  },
  verified: {
    label: 'Verified',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200/80',
    icon: ShieldCheck,
  },
  assigned: {
    label: 'Partners Assigned',
    bg: 'bg-olive-100',
    text: 'text-olive-900',
    border: 'border-olive-300/80',
    icon: CheckCircle2,
  },
  scheduled: {
    label: 'Pickup Scheduled',
    bg: 'bg-sand-200/80',
    text: 'text-earth-800',
    border: 'border-sand-300',
    icon: Calendar,
  },
  collected: {
    label: 'Collected',
    bg: 'bg-forest-100',
    text: 'text-forest-800',
    border: 'border-forest-200',
    icon: Truck,
  },
  in_recycling: {
    label: 'Recycling in Progress',
    bg: 'bg-terracotta-100',
    text: 'text-terracotta-800',
    border: 'border-terracotta-200',
    icon: RotateCw,
  },
  completed: {
    label: 'Completed & Certified',
    bg: 'bg-forest-900 text-white',
    text: 'text-sand-50',
    border: 'border-forest-900',
    icon: Award,
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle,
  },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    bg: 'bg-sand-100',
    text: 'text-earth-700',
    border: 'border-sand-200',
    icon: Clock,
  };

  const Icon = config.icon;
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <Icon size={size === 'xs' ? 12 : 13} className="shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
