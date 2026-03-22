import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { PlusIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';

const today = new Date().toISOString().split('T')[0];
const blankForm = { name: '', phone: '', license_no: '', license_class: '', expiry: today };

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(blankForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/drivers');
      setDrivers(res.data);
    } catch (err) {
      console.error('Failed to fetch drivers', err);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDrivers(); }, []);

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
        await api.put(`/drivers/${formData.id}`, formData);
      } else {
        await api.post('/drivers', formData);
      }
      handleClose();
      fetchDrivers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save driver');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Driver Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Driver</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-brand-muted">Loading drivers...</div>
        ) : drivers.length === 0 ? (
          <div className="col-span-3 bg-brand-panel rounded-2xl shadow-xl border border-brand-border p-10 text-center text-brand-muted">
            No drivers found. Click "Add Driver" to create one.
          </div>
        ) : (
          drivers.map(driver => (
            <div key={driver.id} className="bg-brand-panel rounded-2xl shadow-xl border border-brand-border overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-panel-light flex items-center justify-center border border-brand-border">
                       <IdentificationIcon className="w-6 h-6 text-brand-muted" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">{driver.name}</h3>
                      <p className="text-sm font-medium text-brand-orange">{driver.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mt-4 text-sm text-brand-muted">
                  <div className="flex justify-between border-b border-brand-border/50 pb-2">
                    <span>Status:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      driver.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-400' :
                      driver.status === 'ON_TRIP' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>{driver.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between border-b border-brand-border/50 pb-2">
                    <span>License No:</span>
                    <span className="font-semibold text-white">{driver.license_no}</span>
                  </div>
                  <div className="flex justify-between border-b border-brand-border/50 pb-2">
                    <span>Class:</span>
                    <span className="font-semibold text-white">{driver.license_class}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Expiry:</span>
                    <span className={`font-semibold ${new Date(driver.expiry) < new Date() ? 'text-red-500' : 'text-white'}`}>
                      {new Date(driver.expiry).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-brand-panel-light/30 px-6 py-4 border-t border-brand-border flex justify-end">
                <button
                  onClick={() => { setFormData({...driver, expiry: new Date(driver.expiry).toISOString().split('T')[0]}); setIsModalOpen(true); }}
                  className="text-sm text-brand-orange font-semibold hover:text-orange-400 transition-colors">Edit Profile</button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} title={formData.id ? 'Edit Driver Profile' : 'Add New Driver'}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="e.g. John Doe" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Phone</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="0712345678" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">License Number</label>
                <input type="text" value={formData.license_no} onChange={e => setFormData({...formData, license_no: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="DL-12345" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">License Class</label>
                <input type="text" value={formData.license_class} onChange={e => setFormData({...formData, license_class: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="B, C, E" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">License Expiry</label>
                <input type="date" value={formData.expiry} min={today} onChange={e => setFormData({...formData, expiry: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" required />
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-brand-border/50">
            <button type="button" onClick={handleClose} className="px-5 py-2.5 rounded-lg text-sm font-bold text-brand-muted hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-orange text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Driver'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Drivers;
