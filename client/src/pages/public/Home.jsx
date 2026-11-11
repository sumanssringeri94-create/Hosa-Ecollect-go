import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Recycle,
  ArrowRight,
  ShieldCheck,
  Truck,
  Factory,
  Sparkles,
  CheckCircle2,
  Leaf,
  ChevronDown,
  Globe2,
  Layers,
  BatteryCharging,
  Laptop,
  Smartphone,
  Tv,
  Keyboard,
  Zap,
  Award,
  HeartHandshake,
} from 'lucide-react';
import { INITIAL_CATEGORIES, SAMPLE_IMPACT_METRICS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(INITIAL_CATEGORIES[0].id);
  const { switchAccount } = useAuth();
  const navigate = useNavigate();

  const activeCategory = INITIAL_CATEGORIES.find((c) => c.id === selectedCategoryTab) || INITIAL_CATEGORIES[0];

  const handleQuickDemo = (role, path) => {
    switchAccount(role);
    navigate(path);
  };

  const FAQS = [
    {
      q: 'Is doorstep pickup really free for household electronics?',
      a: 'Yes. eCollect-Go partners with municipal bodies and authorized recycling consortiums that sponsor zero-emission residential collections for standard household e-waste.',
    },
    {
      q: 'How do you ensure private data on laptops and phones is wiped?',
      a: 'All memory units undergo physical degaussing and shredding in accordance with NIST 800-88 standards at ISO 14001 certified facilities. We also recommend performing a factory reset before handing over your device.',
    },
    {
      q: 'What happens to the toxic substances like mercury and lead?',
      a: 'Hazardous fractions are chemically stabilized in hermetic negative-pressure chambers. Heavy metals like lead and cadmium are hydrometallurgically recovered without landfill runoff.',
    },
    {
      q: 'Can organizations and IT companies schedule bulk batch pickups?',
      a: 'Absolutely. Corporate and enterprise users can log bulk inventory (50kg to 5+ tonnes), receive formal Form-6 manifests, and obtain legally certified green disposal reports.',
    },
    {
      q: 'How are the carbon offset and environmental impact scores calculated?',
      a: 'We calculate avoidance metrics based on life-cycle assessment (LCA) values comparing primary virgin ore mining versus secondary hydrometallurgical extraction.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* ─── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Natural background organic blurs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-olive-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-10 w-80 h-80 bg-terracotta-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/80 border border-forest-200 text-forest-900 text-xs font-semibold tracking-wide">
                <Leaf size={14} className="text-terracotta-600" />
                <span>Next-Generation Circular Resource Recovery</span>
              </div>

              <h1 className="editorial-title text-4xl sm:text-6xl lg:text-7xl font-bold text-earth-950 leading-[1.08] tracking-tight">
                Give Your <br />
                <span className="italic font-normal text-forest-800">E-Waste</span> a Better{' '}
                <span className="text-terracotta-600">
                  Future.
                </span>
              </h1>

              <p className="text-earth-600 text-lg sm:text-xl max-w-xl leading-relaxed">
                Make responsible e-waste disposal simple. Schedule a pickup, track your collection, and help valuable materials find a new life.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to="/user/schedule"
                  className="btn-primary text-base py-3.5 px-7 shadow-elevated"
                >
                  Schedule a Pickup <ArrowRight size={18} />
                </Link>
                <Link
                  to="/how-it-works"
                  className="btn-secondary text-base py-3.5 px-6"
                >
                  Explore How It Works
                </Link>
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-sand-200/80 max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-earth-900">100%</div>
                  <div className="text-xs text-earth-500 font-medium mt-0.5">Zero Landfill Goal</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-forest-800">ISO 14001</div>
                  <div className="text-xs text-earth-500 font-medium mt-0.5">Certified Facilities</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-terracotta-600">Free</div>
                  <div className="text-xs text-earth-500 font-medium mt-0.5">Doorstep Collection</div>
                </div>
              </div>
            </div>

            {/* Right Visual Image & Live Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Photo: Disassembly & recovery */}
                <div className="rounded-4xl overflow-hidden border-2 border-sand-200 shadow-2xl relative bg-sand-100 aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=85"
                    alt="Responsible electronics disassembly and recycling"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-950/70 via-earth-950/10 to-transparent" />

                  {/* Caption badge */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta-300 block mb-1">
                      Material Lifecycle Lab
                    </span>
                    <h3 className="text-sm font-semibold text-white/95 leading-snug">
                      High-precision electronic disassembly extracting gold, copper, and rare-earth components.
                    </h3>
                  </div>
                </div>

                {/* Floating pill card 1: Real-time collection simulation */}
                <div className="absolute -top-4 -left-6 sm:-left-8 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-sand-200 shadow-elevated flex items-center gap-3 max-w-xs animate-bounce-subtle">
                  <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
                    <Truck size={20} />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-earth-900 block">EV Fleet En Route</span>
                    <span className="text-earth-500 text-[11px]">Indiranagar, Sector 4 • 10:15 AM</span>
                  </div>
                </div>

                {/* Floating pill card 2: Recovery score */}
                <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-forest-900 text-sand-50 p-4 rounded-2xl border border-forest-800 shadow-elevated flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-forest-800 text-terracotta-400 flex items-center justify-center shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">89.9% Material Recovery</div>
                    <div className="text-[10px] text-sand-300">Sample verified rate (Q3 2026)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 1: HOW IT WORKS (4 STEPS) ───────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="badge badge-olive text-xs font-semibold">
            Simple 4-Step Process
          </span>
          <h2 className="editorial-title text-3xl sm:text-5xl font-bold text-earth-950">
            How eCollect-Go Works
          </h2>
          <p className="text-earth-600 text-sm sm:text-base leading-relaxed">
            From your shelf to certified circular recovery — safe, transparent, and completely traceable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Schedule a Pickup',
              desc: 'Select your e-waste items, pick your preferred date & time slot, and add an optional photo.',
              icon: Laptop,
              badge: 'Under 2 mins',
            },
            {
              step: '02',
              title: 'Admin Verification',
              desc: 'Our governance team verifies category safety and allocates an authorized recycler & EV courier.',
              icon: ShieldCheck,
              badge: 'Fast approval',
            },
            {
              step: '03',
              title: 'Doorstep Collection',
              desc: 'Our zero-emission logistics partner collects your items safely with digital manifest signoff.',
              icon: Truck,
              badge: 'Electric fleets',
            },
            {
              step: '04',
              title: 'Circular Recycling',
              desc: 'Certified facilities recover precious gold, copper, and polymers. View your impact certificate.',
              icon: Recycle,
              badge: 'Certified',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="card card-hover p-6 flex flex-col justify-between relative overflow-hidden bg-white group"
              >
                <div className="absolute -right-2 -top-3 text-6xl font-serif font-black text-sand-200/60 select-none group-hover:text-forest-100 transition-colors">
                  {item.step}
                </div>

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200/80 text-forest-800 flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform">
                    <Icon size={24} />
                  </div>

                  <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-terracotta-600 mb-2">
                    {item.badge}
                  </span>

                  <h3 className="text-lg font-bold text-earth-950 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-earth-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-sand-100 flex items-center text-xs font-semibold text-forest-800">
                  Step {item.step} of 04
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── SECTION 2: WHY RESPONSIBLE E-WASTE MATTERS ───────────── */}
      <section className="bg-sand-100/70 border-y border-sand-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="badge badge-terracotta text-xs font-semibold">
                The Global E-Waste Challenge
              </span>
              <h2 className="editorial-title text-3xl sm:text-4xl lg:text-5xl font-bold text-earth-950">
                Why Responsible Disposal Cannot Wait
              </h2>
              <p className="text-earth-600 text-sm sm:text-base leading-relaxed">
                Electronics represent only 2% of domestic trash by volume, but account for over 70% of toxic heavy metals leaking into municipal landfills.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { title: 'Toxic Soil & Water Leaching', desc: 'Lead, cadmium, and mercury from broken monitors pollute subterranean aquifers.' },
                  { title: 'Finite Raw Material Depletion', desc: 'Mining 1 gram of virgin gold generates 3,000 kg of mine tailings; recycling 40 phones yields the same gram.' },
                  { title: 'Carbon Emission Mitigation', desc: 'Urban mining of secondary aluminium and copper cuts metallurgical carbon footprint by up to 85%.' },
                ].map((point, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-sand-200/80 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-forest-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-earth-900">{point.title}</h4>
                      <p className="text-xs text-earth-600 mt-0.5 leading-normal">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card p-6 bg-white space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <div className="text-3xl font-bold text-earth-950 font-serif">62M Tonnes</div>
                <div className="text-xs font-bold text-earth-800">Global Annual E-Waste</div>
                <p className="text-xs text-earth-500 leading-relaxed">
                  Generated worldwide each year. Less than 22% is formally documented as collected and recycled.
                </p>
              </div>

              <div className="card p-6 bg-forest-900 text-sand-50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-forest-800 text-terracotta-400 flex items-center justify-center">
                  <Recycle size={20} />
                </div>
                <div className="text-3xl font-bold font-serif text-sand-50">85% Lower CO₂</div>
                <div className="text-xs font-bold text-terracotta-300">Circular Metallurgy</div>
                <p className="text-xs text-sand-300 leading-relaxed">
                  Secondary precious metal recovery releases significantly less greenhouse gases than open-pit ore refining.
                </p>
              </div>

              <div className="card p-6 bg-white space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <BatteryCharging size={20} />
                </div>
                <div className="text-3xl font-bold text-earth-950 font-serif">Critical Minerals</div>
                <div className="text-xs font-bold text-earth-800">Lithium, Cobalt & Rare Earths</div>
                <p className="text-xs text-earth-500 leading-relaxed">
                  Closing the loop on electric cells safeguards domestic tech sovereignty and prevents landfill fires.
                </p>
              </div>

              <div className="card p-6 bg-sand-200/60 space-y-3 border-sand-300">
                <div className="w-10 h-10 rounded-xl bg-sand-300/80 text-forest-900 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <div className="text-3xl font-bold text-earth-950 font-serif">Legal Compliance</div>
                <div className="text-xs font-bold text-earth-800">E-Waste (Management) Rules</div>
                <p className="text-xs text-earth-600 leading-relaxed">
                  Compliant with Extended Producer Responsibility (EPR) mandates and state pollution control board norms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: WHAT WE COLLECT (INTERACTIVE CATEGORIES) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="badge badge-forest text-xs font-semibold">
            Accepted Electronic Devices
          </span>
          <h2 className="editorial-title text-3xl sm:text-5xl font-bold text-earth-950">
            What We Collect
          </h2>
          <p className="text-earth-600 text-sm sm:text-base leading-relaxed">
            From consumer portables to industrial enterprise computing racks, we facilitate verified recycling across 7 streams.
          </p>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {INITIAL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryTab(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-forest-900 text-sand-50 shadow-sm'
                    : 'bg-sand-100 hover:bg-sand-200/80 text-earth-700 border border-sand-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Selected Category Feature Card */}
        <div className="card p-6 sm:p-10 bg-white border border-sand-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="badge badge-olive text-xs font-semibold">
                  Hazard Rating: {activeCategory.hazardRating}
                </span>
                <span className="badge badge-sand text-xs">
                  Avg Weight: {activeCategory.averageWeight}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-earth-950 font-sans">
                {activeCategory.name}
              </h3>

              <p className="text-sm sm:text-base text-earth-600 leading-relaxed">
                {activeCategory.description}
              </p>

              {/* Recoverable Materials */}
              <div className="pt-2">
                <span className="text-xs font-bold text-earth-800 uppercase tracking-wider block mb-2">
                  Key Secondary Materials Recovered:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeCategory.recoverableMaterials.map((mat) => (
                    <span
                      key={mat}
                      className="px-3 py-1 rounded-lg bg-forest-50 border border-forest-200 text-forest-900 text-xs font-medium"
                    >
                      ✓ {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preparation Tip */}
              <div className="p-3.5 rounded-xl bg-sand-100/70 border border-sand-200 text-xs text-earth-700 flex items-start gap-2.5 mt-3">
                <Sparkles size={16} className="text-terracotta-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-earth-900">Pre-Pickup Tip: </span>
                  {activeCategory.disposalTip}
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to="/user/schedule"
                  className="btn-primary text-sm py-2.5 px-6"
                >
                  Schedule Pickup for {activeCategory.name} <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden border border-sand-200 bg-sand-100 aspect-video lg:aspect-square relative">
                <img
                  src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80"
                  alt={activeCategory.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-earth-950/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white text-xs font-semibold bg-earth-950/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  Circular Stream Verification
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: OUR RECYCLING JOURNEY ─────────────────────── */}
      <section className="bg-forest-950 text-sand-100 py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 border border-forest-800 text-xs font-semibold text-terracotta-300">
              End-to-End Transparency
            </span>
            <h2 className="editorial-title text-3xl sm:text-5xl font-bold text-sand-50">
              Our Circular Recycling Journey
            </h2>
            <p className="text-sand-300 text-sm sm:text-base leading-relaxed">
              Every item collected follows an audited custody chain from pickup to high-grade industrial ingot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { num: '01', title: 'Intake Manifest', desc: 'Barcoded digital tracking tagging each payload.' },
              { num: '02', title: 'Manual Dismantle', desc: 'Delicate manual removal of batteries and boards.' },
              { num: '03', title: 'Hazard Isolation', desc: 'Safe capture of capacitors, mercury CCFLs, and toner.' },
              { num: '04', title: 'Mechanical Shred', desc: 'Granulation into copper, aluminum, and polymer flake.' },
              { num: '05', title: 'Hydrometallurgy', desc: 'Chemical refining yielding 99.9% pure gold and copper.' },
              { num: '06', title: 'Secondary Raw', desc: 'Returned into industrial manufacturing supply chains.' },
            ].map((step) => (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-forest-900/60 border border-forest-800 flex flex-col justify-between hover:bg-forest-900 hover:border-forest-700 transition-colors"
              >
                <div>
                  <div className="text-2xl font-serif font-bold text-terracotta-400 mb-2">
                    {step.num}
                  </div>
                  <h4 className="text-sm font-bold text-sand-50 mb-1.5">
                    {step.title}
                  </h4>
                  <p className="text-xs text-sand-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-forest-800/80 text-[10px] uppercase tracking-wider text-sand-400">
                  Verified Stage
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: ENVIRONMENTAL IMPACT (SAMPLE STATISTICS) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 sm:p-12 bg-white border border-sand-300 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-sand-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="editorial-title text-2xl sm:text-4xl font-bold text-earth-950">
                  Measurable Environmental Impact
                </h2>
                <span className="badge badge-terracotta text-[10px] font-bold">
                  Sample Data
                </span>
              </div>
              <p className="text-xs sm:text-sm text-earth-500 mt-1">
                Aggregated demo statistics across participating municipal clusters (Clearly labeled as sample data).
              </p>
            </div>

            <Link
              to="/about"
              className="btn-outline text-xs py-2 px-4 shrink-0"
            >
              View Full Methodology
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200/80">
              <div className="text-3xl sm:text-4xl font-bold font-serif text-forest-900">
                142.8t
              </div>
              <div className="text-xs font-bold text-earth-800 mt-1">E-Waste Diverted</div>
              <div className="text-[11px] text-earth-400 mt-0.5">Prevented from landfills</div>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200/80">
              <div className="text-3xl sm:text-4xl font-bold font-serif text-terracotta-600">
                89.9%
              </div>
              <div className="text-xs font-bold text-earth-800 mt-1">Material Recovery Rate</div>
              <div className="text-[11px] text-earth-400 mt-0.5">Secondary raw recycling</div>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200/80">
              <div className="text-3xl sm:text-4xl font-bold font-serif text-forest-800">
                341.2t
              </div>
              <div className="text-xs font-bold text-earth-800 mt-1">CO₂ Emissions Avoided</div>
              <div className="text-[11px] text-earth-400 mt-0.5">Life-cycle comparison</div>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200/80">
              <div className="text-3xl sm:text-4xl font-bold font-serif text-olive-800">
                4,265
              </div>
              <div className="text-xs font-bold text-earth-800 mt-1">Equivalent Trees Planted</div>
              <div className="text-[11px] text-earth-400 mt-0.5">Annual carbon absorption</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: THREE DEDICATED ECOSYSTEM PORTALS ────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="badge badge-olive text-xs font-semibold">
            Multi-Stakeholder Architecture
          </span>
          <h2 className="editorial-title text-3xl sm:text-5xl font-bold text-earth-950">
            Tailored Portals for Every Partner
          </h2>
          <p className="text-earth-600 text-sm sm:text-base leading-relaxed">
            One unified platform orchestrating citizens, authorized recyclers, green logistics fleets, and central administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* For Citizens */}
          <div className="card p-7 flex flex-col justify-between bg-white border border-sand-300 hover:border-forest-400 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center">
                <Laptop size={24} />
              </div>
              <h3 className="text-xl font-bold text-earth-950">
                Citizens & Businesses
              </h3>
              <p className="text-xs sm:text-sm text-earth-600 leading-relaxed">
                Schedule on-demand pickups, monitor driver transit in real time, view material breakdown reports, and download green disposal certificates.
              </p>
              <ul className="space-y-2 text-xs text-earth-700 pt-2 border-t border-sand-200">
                <li className="flex items-center gap-2">✓ Free doorstep pickup scheduling</li>
                <li className="flex items-center gap-2">✓ 7-stage live tracking timeline</li>
                <li className="flex items-center gap-2">✓ Verified digital recycling certificate</li>
              </ul>
            </div>

            <div className="pt-6 mt-4">
              <button
                type="button"
                onClick={() => handleQuickDemo('user', '/user/dashboard')}
                className="btn-primary w-full text-xs py-2.5 justify-center"
              >
                Explore Citizen Portal <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* For Recyclers */}
          <div className="card p-7 flex flex-col justify-between bg-white border border-sand-300 hover:border-terracotta-400 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-800 flex items-center justify-center">
                <Factory size={24} />
              </div>
              <h3 className="text-xl font-bold text-earth-950">
                Authorized Recyclers
              </h3>
              <p className="text-xs sm:text-sm text-earth-600 leading-relaxed">
                Accept incoming batches, record scale weight measurements, manage multi-step disassembly operations, and track precious metal yields.
              </p>
              <ul className="space-y-2 text-xs text-earth-700 pt-2 border-t border-sand-200">
                <li className="flex items-center gap-2">✓ Batch intake & scale verification</li>
                <li className="flex items-center gap-2">✓ Disassembly & recovery logging</li>
                <li className="flex items-center gap-2">✓ Recovered materials inventory ledger</li>
              </ul>
            </div>

            <div className="pt-6 mt-4">
              <button
                type="button"
                onClick={() => handleQuickDemo('recycler', '/recycler/dashboard')}
                className="btn-accent w-full text-xs py-2.5 justify-center"
              >
                Explore Recycler Portal <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* For Logistics */}
          <div className="card p-7 flex flex-col justify-between bg-white border border-sand-300 hover:border-olive-400 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-olive-100 text-olive-800 flex items-center justify-center">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-bold text-earth-950">
                Green Logistics Fleets
              </h3>
              <p className="text-xs sm:text-sm text-earth-600 leading-relaxed">
                Review assigned dispatches, view customer pickup addresses, update route progress, verify custody handoff, and deliver directly to partner labs.
              </p>
              <ul className="space-y-2 text-xs text-earth-700 pt-2 border-t border-sand-200">
                <li className="flex items-center gap-2">✓ Route coordinates & address cards</li>
                <li className="flex items-center gap-2">✓ Status updates (En Route, Arrived, Collected)</li>
                <li className="flex items-center gap-2">✓ Recycler drop-off confirmation</li>
              </ul>
            </div>

            <div className="pt-6 mt-4">
              <button
                type="button"
                onClick={() => handleQuickDemo('logistics', '/logistics/dashboard')}
                className="btn-secondary w-full text-xs py-2.5 justify-center"
              >
                Explore Logistics Portal <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: UN SDG 11 & SDG 12 COMMITMENT ────────────── */}
      <section className="bg-sand-100/70 border-y border-sand-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* SDG 11 */}
            <div className="card p-7 bg-white border border-sand-300 flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-sm font-sans">
                11
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                  United Nations SDG 11
                </span>
                <h3 className="text-lg font-bold text-earth-950">
                  Sustainable Cities & Communities
                </h3>
                <p className="text-xs sm:text-sm text-earth-600 leading-relaxed">
                  Target 11.6: By removing hazardous electronic scrap from municipal landfills, eCollect-Go drastically reduces urban environmental impact and safeguards community public health.
                </p>
              </div>
            </div>

            {/* SDG 12 */}
            <div className="card p-7 bg-white border border-sand-300 flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-sm font-sans">
                12
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                  United Nations SDG 12
                </span>
                <h3 className="text-lg font-bold text-earth-950">
                  Responsible Consumption & Production
                </h3>
                <p className="text-xs sm:text-sm text-earth-600 leading-relaxed">
                  Target 12.5: Substantially reducing waste generation through prevention, reduction, recycling, and reuse — recovering precious metals without new mining devastation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: FAQ ACCORDION ────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="badge badge-forest text-xs font-semibold">
            Common Questions
          </span>
          <h2 className="editorial-title text-3xl sm:text-4xl font-bold text-earth-950">
            Frequently Asked Questions
          </h2>
          <p className="text-earth-600 text-xs sm:text-sm">
            Everything you need to know about our e-waste recycling lifecycle.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="card bg-white border border-sand-300 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-earth-900 hover:text-forest-900 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-earth-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-forest-800' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-earth-600 leading-relaxed border-t border-sand-100 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── SECTION 9: CALL TO ACTION BANNER ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl bg-forest-900 text-sand-50 p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-forest-800">
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-forest-800/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-10 w-64 h-64 bg-terracotta-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="badge badge-terracotta text-xs font-semibold">
              Join the Circular Movement
            </span>

            <h2 className="editorial-title text-3xl sm:text-5xl font-bold leading-tight text-white">
              Ready to Give Your Devices a Second Life?
            </h2>

            <p className="text-sand-200 text-sm sm:text-base leading-relaxed">
              Book a pickup in under two minutes. Whether you have an old smartphone in a drawer or a server rack in a warehouse, we make recycling effortless.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to="/user/schedule"
                className="btn-accent text-base py-3 px-8 justify-center shadow-lg"
              >
                Schedule Free Pickup <ArrowRight size={18} />
              </Link>
              <Link
                to="/e-waste-guide"
                className="btn-outline text-base py-3 px-6 text-white border-white/30 hover:bg-white/10 justify-center"
              >
                Read E-Waste Guide
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
