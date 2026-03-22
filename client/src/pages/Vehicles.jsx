import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';

const blankForm = { plate: '', make: '', model: '', year: '', type: 'TRUCK', capacity: '', status: 'AVAILABLE' };

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(blankForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    setFormData(blankForm);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (formData.id) {
        await api.put(`/vehicles/${formData.id}`, formData);
      } else {
        await api.post('/vehicles', formData);
      }
      handleClose();
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Vehicle Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Vehicle</span>
        </button>
      </div>

      <div className="bg-brand-panel rounded-2xl shadow-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-panel-light text-brand-muted text-xs uppercase tracking-widest font-semibold">
                <th className="px-6 py-5">Plate No</th>
                <th className="px-6 py-5">Make/Model</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Capacity</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-sm">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-brand-muted">Loading vehicles...</td></tr>
              ) : vehicles.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-brand-muted">No vehicles found. Click "Add Vehicle" to create one.</td></tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-brand-panel-light/60 transition-colors">
                    <td className="px-6 py-5 font-bold text-white">{v.plate}</td>
                    <td className="px-6 py-5 text-brand-muted">{v.make} {v.model} ({v.year})</td>
                    <td className="px-6 py-5 text-brand-muted">{v.type}</td>
                    <td className="px-6 py-5 text-brand-muted">{v.capacity} Tons</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                        v.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        v.status === 'ON_TRIP' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        v.status === 'GROUNDED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                        {v.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => { setFormData(v); setIsModalOpen(true); }}
                        className="text-brand-orange hover:text-orange-400 font-semibold transition-colors">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} title={formData.id ? 'Edit Vehicle' : 'Add New Vehicle'}>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Plate Number</label>
              <input type="text" value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="e.g. KDC 123A" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Make</label>
              <input type="text" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="e.g. Isuzu" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Model</label>
              <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="e.g. FRR" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Year</label>
              <input type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="2022" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none">
                <option value="TRUCK">Truck</option>
                <option value="VAN">Van</option>
                <option value="PICKUP">Pickup</option>
                <option value="MOTORBIKE">Motorbike</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Capacity (Tons)</label>
              <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="10" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none">
                <option value="AVAILABLE">Available</option>
                <option value="ON_TRIP">On Trip</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                <option value="GROUNDED">Grounded</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-brand-border/50">
            <button type="button" onClick={handleClose} className="px-5 py-2.5 rounded-lg text-sm font-bold text-brand-muted hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-orange text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Vehicle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Vehicles;
