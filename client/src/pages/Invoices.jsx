import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { DocumentPlusIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ client_id: '', items: [{ description: '', amount: '' }], due_date: '', tax_rate: 16 });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get('/invoices');
        setInvoices(res.data);
      } catch (err) {
        console.error("Failed to fetch invoices", err);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Billing & Invoices</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 font-medium"
        >
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
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-brand-muted">
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-brand-muted">
                    No invoices generated yet.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-brand-panel-light/60 transition-colors">
                    <td className="px-6 py-5 font-bold text-white border-b border-transparent">
                      #{inv.id.substring(0,8).toUpperCase()}
                    </td>
                    <td className="px-6 py-5 text-brand-muted">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-white font-medium">{inv.client?.name}</td>
                    <td className="px-6 py-5 text-white font-bold tracking-wide">
                      {inv.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                        inv.status === 'PAID' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        inv.status === 'OVERDUE' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        inv.status === 'SENT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-brand-panel-light text-brand-muted border-brand-border'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-4 text-brand-orange">
                        <button className="hover:text-orange-400 font-semibold transition-colors">View</button>
                        <button className="hover:text-orange-400 font-medium transition-colors">
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setFormData({ client_id: '', items: [{ description: '', amount: '' }], due_date: '', tax_rate: 16 }); }} title="Generate New Invoice">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-4">
            <div>
               <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Bill To Client</label>
               <select value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" required>
                 <option value="">Select Client</option>
                 <option value="1">Safaricom PLC</option>
                 <option value="2">EABL</option>
               </select>
            </div>
            
            <div className="bg-brand-panel-light p-4 rounded-xl border border-brand-border">
              <h4 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-3">Line Items</h4>
              
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input type="text" value={item.description} onChange={e => {
                    const newItems = [...formData.items];
                    newItems[index].description = e.target.value;
                    setFormData({...formData, items: newItems});
                  }} className="flex-1 px-4 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="Description of service/trip" required />
                  
                  <input type="number" value={item.amount} onChange={e => {
                    const newItems = [...formData.items];
                    newItems[index].amount = e.target.value;
                    setFormData({...formData, items: newItems});
                  }} className="w-32 px-4 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="Amount" required />
                  
                  {index > 0 && (
                     <button type="button" onClick={() => {
                       const newItems = formData.items.filter((_, i) => i !== index);
                       setFormData({...formData, items: newItems});
                     }} className="p-2 text-red-500 hover:text-red-400 font-bold border border-red-500/30 rounded-lg">X</button>
                  )}
                </div>
              ))}
              
              <button type="button" onClick={() => setFormData({...formData, items: [...formData.items, {description: '', amount: ''}]})} className="text-xs font-bold text-brand-orange hover:text-orange-400 mt-2">+ Add Another Item</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Due Date</label>
                <input type="date" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Tax Rate (%)</label>
                <input type="number" value={formData.tax_rate} onChange={e => setFormData({...formData, tax_rate: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="16" />
              </div>
            </div>
            
            <div className="bg-brand-panel-light p-4 rounded-xl border border-brand-border flex justify-between items-center text-white">
               <span className="font-bold">Total Estimated:</span>
               <span className="font-bold text-brand-orange text-lg">
                 KES {(formData.items.reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0) * (1 + formData.tax_rate / 100)).toLocaleString()}
               </span>
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-3 mt-4 border-t border-brand-border/50">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-brand-muted hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-orange text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all">Generate & Send Invoice</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Invoices;
