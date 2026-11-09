import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Recycle, Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Reset link dispatched to your email.');
    } catch (err) {
      toast.error('Unable to send reset email.');
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
          Reset Your Password
        </h2>
        <p className="text-xs text-earth-500">
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8 bg-white border border-sand-300 shadow-xl space-y-6">
          {sent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
                <CheckCircle size={26} />
              </div>
              <h3 className="text-lg font-bold text-earth-950">Reset Email Sent</h3>
              <p className="text-xs text-earth-600 leading-relaxed">
                We have sent an authentication reset token to <span className="font-semibold text-earth-900">{email}</span>. Click the link in the message to reset your password.
              </p>
              <div className="pt-2">
                <Link to="/reset-password" className="btn-primary w-full py-2.5 text-xs justify-center">
                  Continue to Enter Reset Token <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Registered Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.chen@gmail.com"
                    className="input pl-10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 justify-center text-sm font-semibold shadow-md"
              >
                {loading ? 'Sending link...' : 'Send Password Reset Link'}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-sand-200 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-earth-600 hover:text-earth-950 font-medium"
            >
              <ArrowLeft size={13} /> Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
