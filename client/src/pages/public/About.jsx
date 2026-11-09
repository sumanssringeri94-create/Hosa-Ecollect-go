import React from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle,
  Leaf,
  ShieldCheck,
  Globe2,
  Users,
  Award,
  ArrowRight,
  Target,
  Sparkles,
} from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-24 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge badge-olive text-xs font-semibold">
          About eCollect-Go
        </span>
        <h1 className="editorial-title text-4xl sm:text-6xl font-bold text-earth-950">
          Rooted in Nature. <br />
          Engineered for <span className="text-forest-800 italic font-normal">Circular Tech.</span>
        </h1>
        <p className="text-earth-600 text-base sm:text-lg leading-relaxed">
          We believe electronic devices are not disposable trash, but reservoirs of the Earth’s most precious minerals. Our mission is to close the loop on e-waste forever.
        </p>
      </div>

      {/* Philosophy / Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block">
            Our Core Manifesto
          </span>
          <h2 className="editorial-title text-3xl sm:text-4xl font-bold text-earth-950">
            Bridging the Chasm Between High Technology and Ecological Harmony
          </h2>
          <p className="text-sm sm:text-base text-earth-600 leading-relaxed">
            Every year, millions of smartphones, notebooks, and batteries are stashed in drawers or tossed into landfills. Meanwhile, pristine ecosystems are destroyed to mine fresh lithium, cobalt, and gold.
          </p>
          <p className="text-sm sm:text-base text-earth-600 leading-relaxed">
            eCollect-Go was built to invert this paradigm. By providing friction-free doorstep pickups, digital transparency, and strict chains of custody, we turn households and enterprises into active mineral conservationists.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-sand-100/70 border border-sand-200">
              <div className="text-2xl font-bold text-forest-900 font-serif">Zero Landfill</div>
              <p className="text-xs text-earth-500 mt-1">100% of non-recyclables safely neutralized.</p>
            </div>
            <div className="p-4 rounded-2xl bg-sand-100/70 border border-sand-200">
              <div className="text-2xl font-bold text-terracotta-600 font-serif">Transparent</div>
              <p className="text-xs text-earth-500 mt-1">Full digital provenance on every gram recovered.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden border-2 border-sand-200 shadow-xl bg-sand-100 aspect-[4/3] relative">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80"
              alt="Sustainable ecology and technology"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-earth-950/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white text-xs leading-relaxed">
              <span className="font-bold block text-sm mb-1">Cradle to Cradle Stewardship</span>
              Treating end-of-life electronics as the primary feedstocks for tomorrow’s clean energy innovations.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="editorial-title text-3xl sm:text-4xl font-bold text-earth-950">
            Our Guiding Pillars
          </h2>
          <p className="text-xs sm:text-sm text-earth-500">
            Built on four non-negotiable operational principles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Radical Traceability',
              desc: 'From the moment a device is handed to a driver, its weight and custody are permanently recorded.',
              icon: ShieldCheck,
            },
            {
              title: 'Clean Fleet Logistics',
              desc: 'Urban collections executed exclusively through electric vans and zero-emission delivery units.',
              icon: Leaf,
            },
            {
              title: 'High-Yield Recovery',
              desc: 'State-of-the-art chemical separation ensuring maximum retention of scarce strategic elements.',
              icon: Recycle,
            },
            {
              title: 'Community Empowerment',
              desc: 'Rewarding citizens and businesses with transparent carbon certificates and ESG metrics.',
              icon: Users,
            },
          ].map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="card p-6 bg-white border border-sand-300 space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center border border-forest-200">
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-bold text-earth-950">{pillar.title}</h3>
                <p className="text-xs text-earth-600 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standards & Certifications */}
      <div className="card p-8 sm:p-12 bg-sand-50/80 border border-sand-300 rounded-3xl">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="badge badge-sand text-xs font-semibold">Governance & Accreditation</span>
          <h3 className="editorial-title text-2xl sm:text-3xl font-bold text-earth-950">
            Certified Environmental Standards
          </h3>
          <p className="text-xs text-earth-500">
            All recycling operations strictly adhere to international and statutory protocols.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-white rounded-2xl border border-sand-200">
            <div className="font-bold text-earth-900 text-sm">ISO 14001:2015</div>
            <div className="text-xs text-earth-500 mt-1">Environmental Management</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-sand-200">
            <div className="font-bold text-earth-900 text-sm">R2v3 Standard</div>
            <div className="text-xs text-earth-500 mt-1">Responsible Recycling</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-sand-200">
            <div className="font-bold text-earth-900 text-sm">NIST 800-88</div>
            <div className="text-xs text-earth-500 mt-1">Data Sanitization</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-sand-200">
            <div className="font-bold text-earth-900 text-sm">CPCB & SPCB</div>
            <div className="text-xs text-earth-500 mt-1">Pollution Board Authorized</div>
          </div>
        </div>
      </div>
    </div>
  );
}
