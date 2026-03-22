import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircleIcon, IdentificationIcon, KeyIcon } from '@heroicons/react/24/outline';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-brand-panel rounded-2xl shadow-xl border border-brand-border overflow-hidden p-2">
            <nav className="flex flex-col space-y-1.5">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'profile' ? 'bg-gradient-to-r from-brand-orange to-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-brand-muted hover:bg-brand-panel-light hover:text-white'}`}
              >
                <UserCircleIcon className="w-5 h-5" />
                Profile Settings
              </button>
              {user?.role === 'SUPER_ADMIN' && (
                <button 
                  onClick={() => setActiveTab('company')}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'company' ? 'bg-gradient-to-r from-brand-orange to-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-brand-muted hover:bg-brand-panel-light hover:text-white'}`}
                >
                  <IdentificationIcon className="w-5 h-5" />
                  Company Details
                </button>
              )}
              {user?.role === 'SUPER_ADMIN' && (
                <button 
                  onClick={() => setActiveTab('api')}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'api' ? 'bg-gradient-to-r from-brand-orange to-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-brand-muted hover:bg-brand-panel-light hover:text-white'}`}
                >
                  <KeyIcon className="w-5 h-5" />
                  API Integrations
                </button>
              )}
            </nav>
          </div>
        </div>

        <div className="flex-1 bg-brand-panel rounded-2xl shadow-xl border border-brand-border p-8">
          {activeTab === 'profile' && (
            <div className="max-w-xl">
              <h2 className="text-xl font-bold text-white mb-8">Profile Information</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-brand-muted mb-2">Full Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-dark text-white opacity-80 cursor-not-allowed" value={user?.name || ''} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-muted mb-2">Role</label>
                    <input type="text" className="w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-dark text-white opacity-80 cursor-not-allowed" value={user?.role || ''} readOnly />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-muted mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-dark text-white opacity-80 cursor-not-allowed" value={user?.email || ''} readOnly />
                </div>
                <div className="pt-8 border-t border-brand-border mt-8">
                  <h3 className="text-lg font-bold text-white mb-6">Change Password</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-brand-muted mb-2">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-brand-border bg-brand-dark text-white rounded-lg focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none placeholder-brand-muted" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-muted mb-2">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-brand-border bg-brand-dark text-white rounded-lg focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none placeholder-brand-muted" />
                    </div>
                    <button type="button" className="bg-brand-orange text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 mt-2">
                      Update Password
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-white mb-8">API Keys & Integrations</h2>
              
              <div className="space-y-8">
                <div className="bg-brand-panel-light p-6 rounded-2xl border border-brand-border shadow-inner">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white text-lg">M-Pesa Daraja API</h3>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold rounded-md">Configured</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Consumer Key</label>
                      <input type="password" value="********************************" readOnly className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-brand-muted opacity-80 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Shortcode</label>
                      <input type="text" value="174379" readOnly className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-brand-muted opacity-80 cursor-not-allowed" />
                    </div>
                    <button className="text-sm font-bold text-brand-orange hover:text-orange-400 transition-colors mt-2">Edit M-Pesa Credentials</button>
                  </div>
                </div>

                <div className="bg-brand-panel-light p-6 rounded-2xl border border-brand-border shadow-inner">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white text-lg">Africa's Talking SMS</h3>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold rounded-md">Active</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-muted mb-1.5 uppercase tracking-wider">API Key</label>
                      <input type="password" value="********************************" readOnly className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-brand-muted opacity-80 cursor-not-allowed" />
                    </div>
                    <button className="text-sm font-bold text-brand-orange hover:text-orange-400 transition-colors mt-2">Edit SMS Credentials</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'company' && (
             <div className="max-w-xl text-brand-muted">
                <h2 className="text-xl font-bold text-white mb-6">Company Information</h2>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Company details updated successfully."); }}>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-brand-muted mb-2">Company Name</label>
                      <input type="text" defaultValue="Logistics & Fleet Solutions" className="w-full px-4 py-3 border border-brand-border bg-brand-dark text-white rounded-lg focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-muted mb-2">KRA PIN</label>
                      <input type="text" defaultValue="P051234567Z" className="w-full px-4 py-3 border border-brand-border bg-brand-dark text-white rounded-lg focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none uppercase" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-brand-muted mb-2">Business Email</label>
                      <input type="email" defaultValue="hello@logistics.co.ke" className="w-full px-4 py-3 border border-brand-border bg-brand-dark text-white rounded-lg focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-muted mb-2">Phone Number</label>
                      <input type="text" defaultValue="+254 700 123456" className="w-full px-4 py-3 border border-brand-border bg-brand-dark text-white rounded-lg focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-muted mb-2">Office Address</label>
                    <textarea defaultValue="Westlands, Nairobi, Kenya" rows="2" className="w-full px-4 py-3 border border-brand-border bg-brand-dark text-white rounded-lg focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none"></textarea>
                  </div>
                  <button type="submit" className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-orange-500/30 transition-all mt-4">
                    Save Changes
                  </button>
                </form>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
