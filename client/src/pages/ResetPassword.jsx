import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
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
            Reset Password
          </p>
        </div>
        
        <div className="p-10">
          {success ? (
            <div className="space-y-6 text-center">
              <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl text-sm font-medium">
                Password changed successfully!
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg block mt-4"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium text-center">
                  {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label htmlFor="token" className="block text-xs font-bold text-brand-muted uppercase tracking-wider">
                  Reset Token
                </label>
                <input
                  id="token"
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-brand-border bg-brand-dark focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder-brand-muted/70 text-white font-mono"
                  placeholder="A1B2C3"
                />
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="block text-xs font-bold text-brand-muted uppercase tracking-wider">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-brand-border bg-brand-dark focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder-brand-muted/70 text-white"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-orange-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-panel focus:ring-brand-orange mt-4 ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? 'Processing...' : 'Reset Password'}
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

export default ResetPassword;
