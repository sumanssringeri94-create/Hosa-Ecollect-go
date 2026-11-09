import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Recycle,
  User,
  Factory,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: 'Bengaluru',
    organization: '',
    vehicleType: 'Electric Cargo Van',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please complete all required fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register({
        ...formData,
        role,
      });

      if (role === 'recycler') navigate('/recycler/dashboard');
      else if (role === 'logistics') navigate('/logistics/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      // toast shown in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 group mb-2">
          <div className="w-10 h-10 rounded-2xl bg-forest-900 text-sand-50 flex items-center justify-center shadow-soft">
            <Recycle size={22} className="text-terracotta-400" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-forest-950">
            eCollect<span className="text-terracotta-600">-Go</span>
          </span>
        </Link>
        <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-earth-950">
          Create Your Platform Account
        </h2>
        <p className="text-xs text-earth-500">
          Select your ecosystem role to get started with verified circular e-waste management.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="card p-8 bg-white border border-sand-300 shadow-xl space-y-6">
          {/* Role Selection */}
          <div>
            <label className="label mb-2 block">Select Your Ecosystem Role *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'user',
                  label: 'Citizen / User',
                  desc: 'Schedule personal or enterprise pickups',
                  icon: User,
                },
                {
                  id: 'recycler',
                  label: 'Recycler Partner',
                  desc: 'Process e-waste & recover materials',
                  icon: Factory,
                },
                {
                  id: 'logistics',
                  label: 'Logistics Fleet',
                  desc: 'Zero-emission pickup & transit fleet',
                  icon: Truck,
                },
              ].map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-forest-800 bg-forest-50/70 ring-2 ring-forest-800/20'
                        : 'border-sand-300 bg-sand-50/40 hover:bg-white hover:border-sand-400'
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2
                        size={15}
                        className="text-forest-800 absolute top-3 right-3"
                      />
                    )}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                        isSelected
                          ? 'bg-forest-900 text-sand-50'
                          : 'bg-sand-200 text-earth-700'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="text-xs font-bold text-earth-900">{r.label}</div>
                    <div className="text-[10px] text-earth-500 mt-0.5 leading-snug">{r.desc}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-earth-400 mt-2 italic">
              * Note: Administrator accounts are strictly provisioned by platform governance and cannot be self-registered.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 pt-2 border-t border-sand-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name / Primary Contact *</label>
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
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Confirm Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Operating City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input"
                >
                  <option>Bengaluru</option>
                  <option>Chennai</option>
                  <option>Hyderabad</option>
                  <option>Mumbai</option>
                  <option>Delhi NCR</option>
                  <option>Pune</option>
                </select>
              </div>
            </div>

            {/* Role specific dynamic fields */}
            {role === 'recycler' && (
              <div>
                <label className="label">Facility / Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CleanMetals Circular Solutions Ltd"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="input"
                />
              </div>
            )}

            {role === 'logistics' && (
              <div>
                <label className="label">Vehicle Fleet Type</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="input"
                >
                  <option>Electric Cargo Van (e.g. Tata Ace EV)</option>
                  <option>Electric 3-Wheeler Cargo</option>
                  <option>Heavy Box Electric Truck</option>
                  <option>Cargo E-Bike / Two-Wheeler</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 justify-center text-sm font-semibold shadow-md mt-4"
            >
              {loading ? 'Creating Account...' : `Register as ${role.toUpperCase()}`} <ArrowRight size={16} />
            </button>
          </form>

          <div className="pt-4 border-t border-sand-200 text-center text-xs text-earth-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-forest-800 hover:underline">
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
