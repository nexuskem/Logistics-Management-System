import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, TruckIcon, UserGroupIcon, MapIcon, 
  DocumentTextIcon, CurrencyDollarIcon, CogIcon, GlobeAltIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Vehicles', path: '/vehicles', icon: TruckIcon },
  { name: 'Drivers', path: '/drivers', icon: UserGroupIcon },
  { name: 'Trips & Dispatch', path: '/trips', icon: MapIcon },
  { name: 'Clients', path: '/clients', icon: UserGroupIcon },
  { name: 'Invoices', path: '/invoices', icon: DocumentTextIcon },
  { name: 'Expenses', path: '/expenses', icon: CurrencyDollarIcon },
  { name: 'Live Tracking', path: '/tracking', icon: GlobeAltIcon },
  { name: 'Settings', path: '/settings', icon: CogIcon },
];

  const Sidebar = () => {
  return (
    <div className="w-64 bg-brand-panel text-brand-text flex flex-col h-full border-r border-brand-border z-20 shadow-xl">
      <div className="p-6 flex items-center justify-center border-b border-brand-border">
        <h1 className="text-2xl font-bold tracking-wider">
          <span className="text-brand-orange">L</span>MS
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-gradient-to-r from-brand-orange to-orange-500 text-white shadow-lg shadow-orange-500/30' : 'hover:bg-brand-panel-light text-brand-muted hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-brand-border text-xs text-center text-brand-muted">
        &copy; 2026 Logistics Inc.
      </div>
    </div>
  );
};

export default Sidebar;
