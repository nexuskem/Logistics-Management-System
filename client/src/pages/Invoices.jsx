import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { DocumentPlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';

const blankForm = { client_id: '', trip_id: '', amount: '', vat: 16, description: '', due_date: '' };

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [tripsList, setTripsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(blankForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      const [invRes, clientsRes, tripsRes] = await Promise.all([
        api.get('/invoices'),
        api.get('/clients'),
        api.get('/trips'),
      ]);
      setInvoices(invRes.data);
      setClientsList(clientsRes.data);
      setTripsList(tripsRes.data);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    setFormData(blankForm);
    setError('');
  };

  const subtotal = parseFloat(formData.amount) || 0;
  const vatAmount = subtotal * (parseFloat(formData.vat) / 100 || 0);
  const total = subtotal + vatAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/invoices', {
        client_id: formData.client_id,
        trip_id: formData.trip_id || undefined,
        amount: subtotal,
        vat: vatAmount,
      });
      handleClose();
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Billing & Invoices</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 font-medium">
          <DocumentPlusIcon className="w-5 h-5" />
          <span>Generate Invoice</span>
        </button>
      </div>

      <div className="bg-brand-panel rounded-2xl shadow-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-panel-light text-brand-muted text-xs uppercase tracking-widest font-semibold">
                <th className="px-6 py-5">Invoice ID</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Client</th>
                <th className="px-6 py-5">Amount (KES)</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-sm">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-brand-muted">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-brand-muted">No invoices generated yet.</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-brand-panel-light/60 transition-colors">
                    <td className="px-6 py-5 font-bold text-white">#{inv.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-5 text-brand-muted">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-5 text-white font-medium">{inv.client?.name}</td>
                    <td className="px-6 py-5 text-white font-bold tracking-wide">{inv.total.toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                        inv.status === 'PAID' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        inv.status === 'OVERDUE' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        inv.status === 'SENT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-brand-panel-light text-brand-muted border-brand-border'
                      }`}>{inv.status}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-4 text-brand-orange">
                        <button className="hover:text-orange-400 font-semibold transition-colors">View</button>
                        <button className="hover:text-orange-400 font-medium transition-colors"><ArrowDownTrayIcon className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} title="Generate New Invoice">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Bill To Client</label>
              <select value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" required>
                <option value="">Select Client</option>
                {clientsList.map(c => <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Linked Trip (Optional)</label>
              <select value={formData.trip_id} onChange={e => setFormData({...formData, trip_id: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none">
                <option value="">None</option>
                {tripsList.map(t => <option key={t.id} value={t.id}>#{t.id.substring(0,8).toUpperCase()} – {t.route?.origin} → {t.route?.destination}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Amount (KES)</label>
                <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="50000" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">VAT (%)</label>
                <input type="number" value={formData.vat} onChange={e => setFormData({...formData, vat: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="16" />
              </div>
            </div>
            <div className="bg-brand-panel-light p-4 rounded-xl border border-brand-border flex justify-between items-center text-white">
              <span className="font-bold">Total (incl. VAT):</span>
              <span className="font-bold text-brand-orange text-lg">KES {total.toLocaleString()}</span>
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-3 mt-4 border-t border-brand-border/50">
            <button type="button" onClick={handleClose} className="px-5 py-2.5 rounded-lg text-sm font-bold text-brand-muted hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-orange text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-60">
              {saving ? 'Creating...' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Invoices;
