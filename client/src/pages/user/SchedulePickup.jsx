import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { INITIAL_CATEGORIES } from '../../data/mockData';
import PageHeader from '../../components/common/PageHeader';
import ImageUploader from '../../components/forms/ImageUploader';
import {
  CalendarPlus,
  Send,
  Info,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SchedulePickup() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Tomorrow's date string as default min
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    category: 'Laptops & Computers',
    deviceName: '',
    quantity: 1,
    weight: 2.5,
    condition: 'Non-functional',
    pickupAddress: user?.address || 'Apartment 4B, Whispering Palms, 12th Main Road, Indiranagar',
    city: user?.city || 'Bengaluru',
    pincode: user?.pincode || '560038',
    preferredDate: minDate,
    preferredTime: '10:00 AM - 01:00 PM',
    notes: '',
    imageUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.deviceName) {
      toast.error('Please enter the name of the electronic device.');
      return;
    }
    if (!formData.pickupAddress || !formData.city || !formData.pincode) {
      toast.error('Please provide complete address details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const createdRequest = storageService.createRequest({
        userId: user?.id || 'user-1',
        userName: user?.name || 'Sarah Chen',
        userEmail: user?.email || 'sarah.chen@gmail.com',
        userPhone: user?.phone || '+91 98860 12345',
        ...formData,
      });

      toast.success(`Request ${createdRequest.id} scheduled successfully! 🎉`);
      navigate('/user/pickups');
    } catch (err) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Schedule an E-Waste Pickup"
        subtitle="Book a zero-emission doorstep collection for your decommissioned electronic devices."
        backUrl="/user/dashboard"
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Equipment Details Card */}
        <div className="card p-6 sm:p-8 bg-white border border-sand-300 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-sand-200">
            <span className="w-7 h-7 rounded-full bg-forest-900 text-sand-50 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-base font-bold text-earth-950 font-sans">
              Device Specifications
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* E-Waste Category */}
            <div>
              <label className="label">E-Waste Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input cursor-pointer"
              >
                {INITIAL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Device Name */}
            <div>
              <label className="label">Device Name / Model *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dell XPS 15 (2020) or Apple iPad 6th Gen"
                value={formData.deviceName}
                onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Quantity */}
            <div>
              <label className="label">Quantity (Units) *</label>
              <input
                type="number"
                min="1"
                max="1000"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="input"
              />
            </div>

            {/* Approx Weight */}
            <div>
              <label className="label">Approximate Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="5000"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                className="input"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="label">Condition of Device *</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="input cursor-pointer"
              >
                <option value="Working">Working / Operational</option>
                <option value="Repairable">Repairable / Minor Fault</option>
                <option value="Non-functional">Non-functional / Dead</option>
                <option value="Scrap">Total Scrap / Parts Only</option>
              </select>
            </div>
          </div>

          {/* Image Uploader */}
          <div className="pt-2">
            <ImageUploader
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              label="Device Photo / Visual Proof"
            />
          </div>
        </div>

        {/* Step 2: Pickup Logistics & Timing */}
        <div className="card p-6 sm:p-8 bg-white border border-sand-300 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-sand-200">
            <span className="w-7 h-7 rounded-full bg-forest-900 text-sand-50 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="text-base font-bold text-earth-950 font-sans">
              Collection Address & Schedule
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Doorstep Pickup Address *</label>
              <input
                type="text"
                required
                placeholder="House/Office number, building name, street address"
                value={formData.pickupAddress}
                onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                className="input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label">City *</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input cursor-pointer"
                >
                  <option>Bengaluru</option>
                  <option>Chennai</option>
                  <option>Hyderabad</option>
                  <option>Mumbai</option>
                  <option>Delhi NCR</option>
                  <option>Pune</option>
                </select>
              </div>

              <div>
                <label className="label">Postal Pincode *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 560038"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="label">Preferred Collection Date *</label>
                <input
                  type="date"
                  required
                  min={minDate}
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="input cursor-pointer"
                />
              </div>

              <div>
                <label className="label">Preferred Time Slot *</label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="input cursor-pointer"
                >
                  <option>10:00 AM - 01:00 PM (Morning Window)</option>
                  <option>02:00 PM - 05:00 PM (Afternoon Window)</option>
                  <option>05:00 PM - 08:00 PM (Evening Window)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Special Instructions / Handling Notes</label>
              <textarea
                rows={3}
                placeholder="e.g. Please call upon arrival. Item packed in a box. Swollen battery separated..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submission Bar */}
        <div className="card p-6 bg-sand-100/70 border border-sand-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-earth-600">
            <ShieldCheck size={18} className="text-forest-700 shrink-0" />
            <span>
              By submitting, you authorize certified circular recycling and green custody transfer.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate('/user/dashboard')}
              className="btn-secondary flex-1 sm:flex-none text-xs py-2.5 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 sm:flex-none text-xs py-2.5 px-6 shadow-md"
            >
              {isSubmitting ? 'Dispatching...' : 'Submit Pickup Request'} <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
