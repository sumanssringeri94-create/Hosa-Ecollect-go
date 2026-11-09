import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Household Collection',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitted(true);
    toast.success('Your message has been received! Our support coordinator will respond within 24 hours.');
  };

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="badge badge-olive text-xs font-semibold">
          Get in Touch
        </span>
        <h1 className="editorial-title text-4xl sm:text-6xl font-bold text-earth-950">
          Contact Our Circular Team
        </h1>
        <p className="text-earth-600 text-base leading-relaxed">
          Questions about specialized corporate e-waste manifests, authorized recycler onboarding, or pickup logistics? We are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="card p-8 bg-white border border-sand-300">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-earth-950">Thank You!</h3>
                <p className="text-sm text-earth-600 max-w-md mx-auto leading-relaxed">
                  Your inquiry has been submitted. Reference Ticket <span className="font-mono font-bold text-forest-800">#SUP-4091</span>. Our support team will reach out via email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', inquiryType: 'Household Collection', message: '' });
                  }}
                  className="btn-secondary text-xs mt-2"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suman S."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. suman@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Nature of Inquiry</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="input"
                    >
                      <option>Household Pickup Support</option>
                      <option>Enterprise Corporate Batch Collection</option>
                      <option>Recycler Facility Onboarding</option>
                      <option>Logistics Fleet Partnership</option>
                      <option>Media & ESG Inquiries</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your query, approximate quantity or equipment specifics..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full py-3 justify-center text-sm font-semibold">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Contact Info & Map Placeholder */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card p-6 bg-sand-50/80 border border-sand-300 space-y-4">
            <h3 className="text-lg font-bold text-earth-950 font-sans">
              Headquarters & Hubs
            </h3>

            <div className="space-y-3.5 text-xs text-earth-700">
              <div className="flex items-start gap-3">
                <MapPin size={17} className="text-terracotta-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-earth-900 block">Bengaluru Circular Central</span>
                  <span>Plot 42, Green Park Hub, 12th Main Road, Indiranagar, Bengaluru 560038</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={17} className="text-terracotta-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-earth-900 block">Toll-Free Helpline</span>
                  <span>1800-425-ECOLLECT (+91 080 6120-0900)</span>
                  <span className="text-earth-400 block text-[11px]">Mon - Sat: 9:00 AM – 7:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={17} className="text-terracotta-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-earth-900 block">Direct Inquiries</span>
                  <span>support@ecollect-go.org • partnerships@ecollect-go.org</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder Card (As instructed: Map placeholder only, no external Google Maps API key required) */}
          <div className="card p-6 bg-white border border-sand-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-earth-900 uppercase tracking-wider">
                Service Zone Map Preview
              </span>
              <span className="badge badge-olive text-[10px]">Active Hubs</span>
            </div>

            <div className="h-44 rounded-2xl bg-sand-200/80 border border-sand-300 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#C4CDB4_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

              <div className="relative text-center p-4">
                <div className="w-10 h-10 rounded-full bg-forest-900 text-white flex items-center justify-center mx-auto mb-2 shadow-md animate-pulse">
                  <MapPin size={20} />
                </div>
                <div className="text-xs font-bold text-earth-900">Bengaluru Metropolitan Cluster</div>
                <div className="text-[11px] text-earth-500">6 Certified Recycler Nodes • 14 Fleet Waypoints</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
