import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Recycle,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  User,
  Factory,
  Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('sarah.chen@gmail.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login, getDashboardPath, demoPresets } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'recycler') navigate('/recycler/dashboard');
      else if (user.role === 'logistics') navigate('/logistics/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      // toast shown in context
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (preset) => {
    setEmail(preset.email);
    setPassword(preset.password);
    toast.success(`Loaded credentials for ${preset.label} (${preset.name})`);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 group mb-2">
          <div className="w-10 h-10 rounded-2xl bg-forest-900 text-sand-50 flex items-center justify-center shadow-soft">
            <Recycle size={22} className="text-terracotta-400" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-forest-950">
            eCollect<span className="text-terracotta-600">-Go</span>
          </span>
        </Link>
        <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-earth-950">
          Sign In to Your Portal
        </h2>
        <p className="text-xs text-earth-500">
          Access your digital custody records, pickup schedules, or facility dashboards.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8 bg-white border border-sand-300 shadow-xl space-y-6">
          {/* Quick Demo Autofill Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-earth-600 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} className="text-terracotta-600" /> Instant Demo Autofill:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoPresets.map((p) => (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handleQuickFill(p)}
                  className={`text-left p-2 rounded-xl border text-xs transition-all ${
                    email === p.email
                      ? 'bg-forest-50 border-forest-300 text-forest-900 font-bold'
                      : 'bg-sand-50/70 border-sand-200 text-earth-700 hover:bg-sand-100'
                  }`}
                >
                  <div className="font-semibold text-earth-900 truncate">{p.label}</div>
                  <div className="text-[10px] text-earth-400 truncate">{p.name}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2 border-t border-sand-200">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-forest-800 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 justify-center text-sm font-semibold shadow-md mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
            </button>
          </form>

          <div className="pt-4 border-t border-sand-200 text-center text-xs text-earth-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-forest-800 hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
