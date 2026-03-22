import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BellIcon, UserCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-brand-panel/80 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-6 z-20 sticky top-0">
      <div className="text-lg font-semibold text-brand-text">
        Welcome Back, <span className="text-brand-orange">{user?.name || 'User'}</span>
      </div>
      <div className="flex items-center gap-6 relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative text-brand-muted hover:text-white transition-colors p-2"
        >
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse"></span>
        </button>

        {showNotifications && (
           <div className="absolute top-14 right-48 w-80 bg-brand-panel border border-brand-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
             <div className="p-4 border-b border-brand-border bg-brand-panel-light/30 flex justify-between items-center">
               <h3 className="text-white font-bold tracking-wide">Notifications</h3>
               <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">2 New</span>
             </div>
             <div className="divide-y divide-brand-border max-h-80 overflow-y-auto custom-scrollbar">
                <div className="p-4 bg-red-500/5 hover:bg-brand-panel-light transition-colors cursor-pointer flex gap-4 items-start">
                   <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
                     <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-white leading-tight mb-1">Accident Alert Reported</p>
                     <p className="text-xs text-brand-muted">Vehicle KCE 789B has reported a critical accident near Kisumu.</p>
                     <p className="text-xs text-red-400 font-bold mt-2">Just now</p>
                   </div>
                </div>
                <div className="p-4 bg-orange-500/5 hover:bg-brand-panel-light transition-colors cursor-pointer flex gap-4 items-start">
                   <div className="p-2 bg-orange-500/20 rounded-lg shrink-0">
                     <ExclamationTriangleIcon className="w-5 h-5 text-brand-orange" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-white leading-tight mb-1">Over-speeding Warning</p>
                     <p className="text-xs text-brand-muted">Vehicle KBB 456X exceeded 110km/h on Mombasa Road.</p>
                     <p className="text-xs text-brand-orange font-bold mt-2">2 mins ago</p>
                   </div>
                </div>
             </div>
             <div 
               onClick={() => { setShowNotifications(false); navigate('/tracking'); }}
               className="p-3 border-t border-brand-border text-center bg-brand-panel-light/30 hover:bg-brand-panel-light cursor-pointer transition-colors"
             >
               <span className="text-sm text-brand-orange font-bold hover:text-white">View All Alerts</span>
             </div>
           </div>
        )}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-orange to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <UserCircleIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{user?.name}</span>
            <span className="text-xs text-brand-muted capitalize">{user?.role?.replace('_', ' ')}</span>
          </div>
          <button 
            onClick={logout}
            className="ml-4 text-sm text-red-500 hover:text-red-400 font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
