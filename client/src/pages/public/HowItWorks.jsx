import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ShieldCheck,
  Truck,
  RotateCw,
  Award,
  ArrowRight,
  CheckCircle,
  FileText,
  Boxes,
  HelpCircle,
} from 'lucide-react';

export default function HowItWorks() {
  const STAGES = [
    {
      num: '01',
      title: 'Digital Pickup Request',
      subtitle: 'Schedule in under 2 minutes',
      desc: 'Specify the electronic category, estimate quantity or weight, note condition, and pick a preferred date & time window. You can optionally upload a photo for accurate categorization.',
      icon: Calendar,
      deliverable: 'Instant ECG Request ID & live manifest tracking link',
    },
    {
      num: '02',
      title: 'Admin Verification & Allocation',
      subtitle: 'Controlled chain of custody',
      desc: 'Our platform administrator inspects the e-waste manifest. Hazardous elements (such as swollen batteries or CRTs) are flagged for specialized handling before pairing with a certified recycler.',
      icon: ShieldCheck,
      deliverable: 'Authorized recycler & designated EV courier paired',
    },
    {
      num: '03',
      title: 'Zero-Emission Doorstep Collection',
      subtitle: 'Clean transport to facility',
      desc: 'A verified logistics driver arrives during your chosen slot. The driver scans your digital OTP, verifies the items, places them in shock-absorbing containment bins, and transports them to the processing lab.',
      icon: Truck,
      deliverable: 'Custody handoff receipt & digital driver verification',
    },
    {
      num: '04',
      title: 'Intake & Dismantling',
      subtitle: 'Component-level separation',
      desc: 'At the ISO 14001 facility, items are weighed on calibrated digital scales. Skilled technicians manually disconnect lithium-ion batteries, copper heat pipes, memory modules, and aluminum chassis.',
      icon: Boxes,
      deliverable: 'Scale gross vs tare audit log & hazardous neutralization',
    },
    {
      num: '05',
      title: 'Precious Metals & Plastics Recovery',
      subtitle: 'Hydrometallurgy without smoke',
      desc: 'Circuit boards undergo hydrometallurgical leaching to separate 99.9% pure gold, palladium, and copper. High-impact polymers are granulated into pellets for injection molding.',
      icon: RotateCw,
      deliverable: 'Secondary raw materials ledger & 0% landfill disposal',
    },
    {
      num: '06',
      title: 'Green Certificate Issuance',
      subtitle: 'Quantifiable environmental impact',
      desc: 'Upon completion, a tamper-proof digital Recycling Certificate is minted for the user. It quantifies exact grams of metals saved, CO₂ emissions prevented, and tree-equivalents planted.',
      icon: Award,
      deliverable: 'Official Certificate with QR verification',
    },
  ];

  return (
    <div className="space-y-20 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge badge-forest text-xs font-semibold">
          Platform Architecture & Workflow
        </span>
        <h1 className="editorial-title text-4xl sm:text-6xl font-bold text-earth-950">
          How eCollect-Go Operates
        </h1>
        <p className="text-earth-600 text-base sm:text-lg leading-relaxed">
          From doorstep pickup to secondary raw material recovery — discover the audited six-stage custody chain powering our circular platform.
        </p>
      </div>

      {/* 6 Stages Timeline */}
      <div className="space-y-6">
        {STAGES.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="card p-6 sm:p-8 bg-white border border-sand-300 flex flex-col md:flex-row items-start gap-6 hover:shadow-elevated transition-all"
            >
              <div className="flex md:flex-col items-center justify-between w-full md:w-28 shrink-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-sand-200">
                <span className="text-3xl sm:text-4xl font-serif font-black text-terracotta-600">
                  {s.num}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center border border-forest-200/80">
                  <Icon size={24} />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-earth-400">
                  {s.subtitle}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-earth-950">
                  {s.title}
                </h3>
                <p className="text-sm text-earth-600 leading-relaxed max-w-3xl">
                  {s.desc}
                </p>

                <div className="pt-3 flex items-center gap-2 text-xs font-semibold text-forest-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-700" />
                  <span>Output: {s.deliverable}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="card p-8 sm:p-12 bg-forest-900 text-sand-50 text-center max-w-3xl mx-auto space-y-6 rounded-3xl">
        <h2 className="editorial-title text-3xl sm:text-4xl font-bold text-white">
          Experience the Seamless Workflow Yourself
        </h2>
        <p className="text-sand-200 text-sm max-w-lg mx-auto">
          Try scheduling a simulated pickup request now and watch it move through Admin, Logistics, and Recycler stages.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/user/schedule" className="btn-accent py-3 px-8 text-sm">
            Schedule a Pickup Now <ArrowRight size={16} />
          </Link>
          <Link to="/e-waste-guide" className="btn-outline py-3 px-6 text-sm text-white border-white/40 hover:bg-white/10">
            Check Accepted Devices
          </Link>
        </div>
      </div>
    </div>
  );
}
