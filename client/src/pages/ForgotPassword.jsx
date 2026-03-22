import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successToken, setSuccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessToken('');
    
    try {
      const res = await forgotPassword(email);
      setSuccessToken(res.resetToken);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4">
      <div className="max-w-md w-full bg-brand-panel rounded-2xl shadow-2xl overflow-hidden border border-brand-border">
        <div className="bg-gradient-to-r from-brand-orange to-orange-600 p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <h1 className="text-4xl font-extrabold text-white tracking-wider relative z-10 drop-shadow-md">
            LMS
          </h1>
          <p className="text-orange-100 mt-3 text-xs uppercase tracking-widest font-bold relative z-10">
            Forgot Password
          </p>
        </div>
        
        <div className="p-10">
          {successToken ? (
            <div className="space-y-6 text-center">
              <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl text-sm font-medium">
                Password reset initialized successfully!
              </div>
              <p className="text-brand-muted text-sm">
                Because this system has no email server configured, your reset token is displayed below. Please copy it and proceed to reset your password.
              </p>
              <div className="bg-brand-dark p-4 rounded-xl border border-brand-border text-white text-2xl font-mono tracking-widest break-all">
                {successToken}
              </div>
              <button
                onClick={() => navigate('/reset-password')}
                className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg block"
              >
                Proceed to Reset
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium text-center">
                  {error}
                </div>
              )}
              
              <p className="text-brand-muted text-sm font-semibold text-center pb-2">
                Enter your email address to receive password reset instructions.
              </p>
              
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold text-brand-muted uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-brand-border bg-brand-dark focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder-brand-muted/70 text-white"
                  placeholder="admin@logistics.co.ke"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-orange-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-panel focus:ring-brand-orange mt-4 ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? 'Sending Request...' : 'Send Reset Link'}
              </button>
              
              <div className="mt-6 text-center text-brand-muted text-sm font-semibold">
                Remember your password?{' '}
                <Link to="/login" className="text-brand-orange hover:text-orange-400 transition-colors">
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
