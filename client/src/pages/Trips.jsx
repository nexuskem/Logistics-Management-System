import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ client_id: '', vehicle_id: '', driver_id: '', route_origin: '', route_destination: '', pickup_date: '', expected_delivery: '', status: 'DISPATCHED' });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get('/trips');
        setTrips(res.data);
      } catch (err) {
        console.error("Failed to fetch trips", err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Trip & Dispatch Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Trip</span>
        </button>
      </div>

      <div className="bg-brand-panel rounded-2xl shadow-xl border border-brand-border overflow-hidden">
        <div className="p-5 border-b border-brand-border bg-brand-panel-light/30">
           {/* Filters can go here */}
           <input type="text" placeholder="Search trips by ID, client or status..." className="w-full max-w-md px-4 py-2.5 rounded-lg bg-brand-dark border border-brand-border outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange text-sm text-white placeholder-brand-muted transition-all shadow-inner" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-panel-light text-brand-muted text-xs uppercase tracking-widest font-semibold">
                <th className="px-6 py-5">Trip ID</th>
                <th className="px-6 py-5">Route</th>
                <th className="px-6 py-5">Client</th>
                <th className="px-6 py-5">Driver / Vehicle</th>
                <th className="px-6 py-5">Date Setup</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-brand-muted">
                    Loading trips...
                  </td>
                </tr>
              ) : trips.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-brand-muted">
                    No trips found. Click "New Trip" to created one.
                  </td>
                </tr>
              ) : (
                trips.map((t) => (
                  <tr key={t.id} className="hover:bg-brand-panel-light/60 transition-colors cursor-pointer">
                    <td className="px-6 py-5 font-bold text-white border-b border-transparent">
                      #{t.id.substring(0,8).toUpperCase()}
                    </td>
                    <td className="px-6 py-5 text-white font-medium">
                       {t.route?.origin} &rarr; {t.route?.destination}
                    </td>
                    <td className="px-6 py-5 text-brand-muted">{t.client?.name}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{t.driver?.name}</span>
                        <span className="text-xs text-brand-muted mt-0.5">{t.vehicle?.plate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-brand-muted">
                        {new Date(t.pickup_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                        t.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        t.status === 'IN_TRANSIT' ? 'bg-orange-500/10 text-brand-orange border-orange-500/20' :
                        t.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-brand-panel-light text-brand-muted border-brand-border'
                      }`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => {
                          setFormData({ ...t, route_origin: t.route?.origin, route_destination: t.route?.destination, pickup_date: new Date(t.pickup_date).toISOString().split('T')[0] });
                          setIsModalOpen(true);
                        }}
                        className="text-brand-orange hover:text-orange-400 font-semibold transition-colors">Manage</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setFormData({ client_id: '', vehicle_id: '', driver_id: '', route_origin: '', route_destination: '', pickup_date: '', expected_delivery: '', status: 'DISPATCHED' }); }} title={formData.id ? "Manage Trip" : "Create New Trip"}>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 border-b border-brand-border/50 pb-4">
               <div>
                 <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Client Allocation</label>
                 <select value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" required>
                   <option value="">Select Client</option>
                   <option value="1">Safaricom PLC</option>
                   <option value="2">EABL</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Status</label>
                 <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none">
                   <option value="DISPATCHED">Dispatched</option>
                   <option value="IN_TRANSIT">In Transit</option>
                   <option value="COMPLETED">Completed</option>
                   <option value="CANCELLED">Cancelled</option>
                 </select>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Assign Vehicle</label>
                <select value={formData.vehicle_id} onChange={e => setFormData({...formData, vehicle_id: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" required>
                  <option value="">Select Available Vehicle</option>
                  <option value="1">KDC 123A</option>
                  <option value="2">KBB 456X</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Assign Driver</label>
                <select value={formData.driver_id} onChange={e => setFormData({...formData, driver_id: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" required>
                  <option value="">Select Available Driver</option>
                  <option value="1">John Doe</option>
                  <option value="2">Jane Kamau</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-brand-border/50 pt-4">
               <div>
                 <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Origin</label>
                 <input type="text" value={formData.route_origin} onChange={e => setFormData({...formData, route_origin: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="e.g. Nairobi" required />
               </div>
               <div>
                 <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Destination</label>
                 <input type="text" value={formData.route_destination} onChange={e => setFormData({...formData, route_destination: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="e.g. Mombasa" required />
               </div>
               <div>
                 <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Pickup Date</label>
                 <input type="date" value={formData.pickup_date} onChange={e => setFormData({...formData, pickup_date: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" required />
               </div>
               <div>
                 <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Expected Delivery</label>
                 <input type="date" value={formData.expected_delivery} onChange={e => setFormData({...formData, expected_delivery: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" required />
               </div>
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-brand-muted hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-orange text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all">Save Trip</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Trips;
