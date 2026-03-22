import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { PlusIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', phone: '', email: '', address: '', status: 'ACTIVE' });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get('/clients');
        setClients(res.data);
      } catch (err) {
        console.error("Failed to fetch clients", err);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Client</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-brand-muted">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="col-span-3 bg-brand-panel rounded-2xl shadow-xl border border-brand-border p-10 text-center text-brand-muted">
            No clients found. Click "Add Client" to create one.
          </div>
        ) : (
          clients.map(client => (
            <div key={client.id} className="bg-brand-panel rounded-2xl shadow-xl border border-brand-border p-6 flex items-start gap-4 hover:shadow-2xl hover:border-brand-border transition-all hover:-translate-y-1">
              <div className="bg-brand-panel-light text-brand-orange p-3 rounded-xl border border-brand-border">
                <BriefcaseIcon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white leading-tight">{client.name}</h3>
                <p className="text-sm font-semibold text-brand-orange mb-3">{client.company || 'Individual'}</p>
                <div className="text-sm text-brand-muted space-y-1.5">
                  <p>{client.phone}</p>
                  <p className="truncate">{client.email}</p>
                  <p className="text-xs text-gray-500 mt-2">{client.address}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-brand-border/50 flex justify-end">
                   <button onClick={() => { setFormData(client); setIsModalOpen(true); }} className="text-sm font-bold text-brand-orange hover:text-orange-400">Edit Client</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setFormData({ name: '', company: '', phone: '', email: '', address: '', status: 'ACTIVE' }); }} title={formData.id ? "Edit Client" : "Add New Client"}>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Contact Person Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="e.g. John Doe" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Company Name (Optional)</label>
              <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="e.g. Acme Corp" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Phone Phone</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="0712345678" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="contact@company.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Physical Address</label>
              <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows="2" className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="e.g. 1st Floor, Tower A, Nairobi"></textarea>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-brand-border/50">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-brand-muted hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-orange text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all">Save Client</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Clients;
