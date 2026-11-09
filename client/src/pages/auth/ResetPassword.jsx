import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Recycle, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [token, setToken] = useState('DEMO-RST-9981');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error('Please enter and confirm your new password.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(token, password);
      setDone(true);
      toast.success('Your password has been successfully updated!');
    } catch (err) {
      toast.error('Failed to reset password.');
    } finally {
      setLoading(false);
    }
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
          Create New Password
        </h2>
        <p className="text-xs text-earth-500">
          Enter your verification code and choose a secure password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8 bg-white border border-sand-300 shadow-xl space-y-6">
          {done ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
                <CheckCircle size={26} />
              </div>
              <h3 className="text-lg font-bold text-earth-950">Password Updated!</h3>
              <p className="text-xs text-earth-600 leading-relaxed">
                Your credentials have been securely refreshed. You can now log into your account.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="btn-primary w-full py-2.5 text-xs justify-center"
                >
                  Proceed to Login <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="label">Reset Verification Token</label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="input font-mono text-xs"
                />
              </div>

              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="label">Confirm New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 justify-center text-sm font-semibold shadow-md"
              >
                {loading ? 'Updating Password...' : 'Save & Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
