import React from 'react';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Users,
  Calendar,
  Truck,
  RotateCw,
  Award,
  Circle,
} from 'lucide-react';

const STAGE_ICONS = {
  'Request Submitted': Clock,
  'Admin Verified': ShieldCheck,
  'Recycler & Logistics Assigned': Users,
  'Recycler Assigned': Users,
  'Pickup Scheduled': Calendar,
  'Collected': Truck,
  'Recycling in Progress': RotateCw,
  'Completed & Certified': Award,
  'Completed': Award,
};

export default function TrackingTimeline({ timeline = [], currentStatus = 'submitted', orientation = 'vertical' }) {
  // If horizontal layout
  if (orientation === 'horizontal') {
    return (
      <div className="w-full py-4 overflow-x-auto">
        <div className="flex items-center min-w-[700px] justify-between relative">
          {timeline.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isUpcoming = step.status === 'upcoming';
            const Icon = STAGE_ICONS[step.stage] || Circle;

            return (
              <div key={step.stage} className="flex-1 flex flex-col items-center text-center relative group px-2">
                {/* Connecting Line */}
                {idx > 0 && (
                  <div
                    className={`absolute top-5 -left-1/2 w-full h-[2px] -z-0 ${
                      isCompleted || isCurrent ? 'bg-forest-600' : 'bg-sand-300'
                    }`}
                  />
                )}

                {/* Node icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-transform duration-200 ${
                    isCompleted
                      ? 'bg-forest-900 text-sand-50 shadow-sm'
                      : isCurrent
                      ? 'bg-terracotta-500 text-white ring-4 ring-terracotta-100 shadow-md animate-pulse'
                      : 'bg-sand-200 text-earth-400 border border-sand-300'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                </div>

                <div className="mt-3">
                  <div
                    className={`text-xs font-semibold ${
                      isCompleted ? 'text-forest-900' : isCurrent ? 'text-terracotta-700' : 'text-earth-400'
                    }`}
                  >
                    {step.stage}
                  </div>
                  <div className="text-[11px] text-earth-500 mt-0.5">{step.date}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical layout (default)
  return (
    <div className="space-y-6 relative pl-2">
      {/* Continuous background vertical line */}
      <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-sand-200 -z-0" />

      {timeline.map((step, idx) => {
        const isCompleted = step.status === 'completed';
        const isCurrent = step.status === 'current';
        const isUpcoming = step.status === 'upcoming';
        const isRejected = step.status === 'rejected';
        const Icon = STAGE_ICONS[step.stage] || Circle;

        return (
          <div key={step.stage} className="flex items-start gap-4 relative z-10">
            {/* Step Icon Indicator */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                isCompleted
                  ? 'bg-forest-900 text-sand-50 ring-4 ring-forest-50 shadow-sm'
                  : isCurrent
                  ? 'bg-terracotta-500 text-white ring-4 ring-terracotta-100 shadow-md'
                  : isRejected
                  ? 'bg-red-500 text-white ring-4 ring-red-100'
                  : 'bg-sand-100 text-earth-400 border border-sand-300'
              }`}
            >
              {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={17} />}
            </div>

            {/* Step details */}
            <div className="flex-1 pt-0.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`text-sm font-semibold ${
                    isCompleted ? 'text-forest-900' : isCurrent ? 'text-terracotta-700' : 'text-earth-500'
                  }`}
                >
                  {step.stage}
                </span>

                <span className="text-xs text-earth-400 font-medium">
                  {step.date}
                </span>
              </div>

              {step.note && (
                <p
                  className={`text-xs mt-1.5 leading-relaxed rounded-lg p-2.5 ${
                    isCurrent
                      ? 'bg-terracotta-50/70 border border-terracotta-200/60 text-terracotta-900'
                      : isCompleted
                      ? 'bg-sand-50/80 border border-sand-200/60 text-earth-700'
                      : 'text-earth-400 italic'
                  }`}
                >
                  {step.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
