import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';

const today = new Date().toISOString().split('T')[0];
const blankExpense = { date: today, category: 'MAINTENANCE', vehicle_id: '', amount: '', notes: '' };
const blankFuel = { date: today, vehicle_id: '', station: '', litres: '', cost_per_litre: '', total: '' };

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDataExpense, setFormDataExpense] = useState(blankExpense);
  const [formDataFuel, setFormDataFuel] = useState(blankFuel);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [expRes, fuelRes, vehRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/expenses/fuel'),
        api.get('/vehicles'),
      ]);
      setExpenses(expRes.data);
      setFuelLogs(fuelRes.data);
      setVehicles(vehRes.data);
    } catch (err) {
      console.error('Failed to fetch finances', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    setFormDataExpense(blankExpense);
    setFormDataFuel(blankFuel);
    setError('');
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/expenses', {
        ...formDataExpense,
        amount: parseFloat(formDataExpense.amount),
        date: new Date(formDataExpense.date).toISOString(),
        vehicle_id: formDataExpense.vehicle_id || undefined,
      });
      handleClose();
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitFuel = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/expenses/fuel', {
        ...formDataFuel,
        litres: parseFloat(formDataFuel.litres),
        cost_per_litre: parseFloat(formDataFuel.cost_per_litre),
        total: parseFloat(formDataFuel.total),
        date: new Date(formDataFuel.date).toISOString(),
      });
      handleClose();
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save fuel log');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Expenses & Fuel Logs</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 font-medium">
          <PlusIcon className="w-5 h-5" />
          <span>Record {activeTab === 'expenses' ? 'Expense' : 'Fuel'}</span>
        </button>
      </div>

      <div className="bg-brand-panel rounded-2xl shadow-xl border border-brand-border overflow-hidden">
        <div className="border-b border-brand-border flex bg-brand-panel-light/30">
          <button className={`px-8 py-5 font-medium text-sm transition-colors relative ${activeTab === 'expenses' ? 'text-brand-orange' : 'text-brand-muted hover:text-white'}`} onClick={() => setActiveTab('expenses')}>
            General Expenses
            {activeTab === 'expenses' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>}
          </button>
          <button className={`px-8 py-5 font-medium text-sm transition-colors relative ${activeTab === 'fuel' ? 'text-brand-orange' : 'text-brand-muted hover:text-white'}`} onClick={() => setActiveTab('fuel')}>
            Fuel Logs
            {activeTab === 'fuel' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>}
          </button>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'expenses' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-panel-light text-brand-muted text-xs uppercase tracking-widest font-semibold">
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Vehicle</th>
                  <th className="px-6 py-5">Amount (KES)</th>
                  <th className="px-6 py-5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-sm">
                {loading ? <tr><td colSpan="5" className="p-8 text-center text-brand-muted">Loading...</td></tr> : expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-brand-panel-light/60 transition-colors">
                    <td className="px-6 py-5 text-brand-muted">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-6 py-5"><span className="px-3 py-1.5 bg-brand-panel-light text-brand-muted border border-brand-border rounded-md text-xs font-bold">{exp.category}</span></td>
                    <td className="px-6 py-5 text-blue-400 font-medium">{exp.vehicle?.plate || 'N/A'}</td>
                    <td className="px-6 py-5 font-bold text-white tracking-wide">{exp.amount.toLocaleString()}</td>
                    <td className="px-6 py-5 text-brand-muted">{exp.notes || '-'}</td>
                  </tr>
                ))}
                {!loading && expenses.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-brand-muted">No expenses recorded.</td></tr>}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-panel-light text-brand-muted text-xs uppercase tracking-widest font-semibold">
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Vehicle</th>
                  <th className="px-6 py-5">Station</th>
                  <th className="px-6 py-5">Litres</th>
                  <th className="px-6 py-5">Total Cost (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-sm">
                {loading ? <tr><td colSpan="5" className="p-8 text-center text-brand-muted">Loading...</td></tr> : fuelLogs.map(log => (
                  <tr key={log.id} className="hover:bg-brand-panel-light/60 transition-colors">
                    <td className="px-6 py-5 text-brand-muted">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="px-6 py-5 text-blue-400 font-medium">{log.vehicle?.plate}</td>
                    <td className="px-6 py-5 text-white">{log.station || 'Unknown'}</td>
                    <td className="px-6 py-5 text-white font-medium">{log.litres} L</td>
                    <td className="px-6 py-5 font-bold text-red-500 tracking-wide">{log.total.toLocaleString()}</td>
                  </tr>
                ))}
                {!loading && fuelLogs.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-brand-muted">No fuel logs recorded.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} title={activeTab === 'expenses' ? 'Record General Expense' : 'Record Fuel Intake'}>
        {activeTab === 'expenses' ? (
          <form className="space-y-4" onSubmit={handleSubmitExpense}>
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Date</label>
                  <input type="date" value={formDataExpense.date} onChange={e => setFormDataExpense({...formDataExpense, date: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Category</label>
                  <select value={formDataExpense.category} onChange={e => setFormDataExpense({...formDataExpense, category: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none">
                    <option value="MAINTENANCE">Maintenance & Repairs</option>
                    <option value="SALARY">Staff Salary</option>
                    <option value="OFFICE">Office Supplies</option>
                    <option value="INSURANCE">Insurance</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Vehicle (Optional)</label>
                  <select value={formDataExpense.vehicle_id} onChange={e => setFormDataExpense({...formDataExpense, vehicle_id: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none">
                    <option value="">None</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Amount (KES)</label>
                  <input type="number" value={formDataExpense.amount} onChange={e => setFormDataExpense({...formDataExpense, amount: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="10000" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Notes</label>
                  <textarea value={formDataExpense.notes} onChange={e => setFormDataExpense({...formDataExpense, notes: e.target.value})} rows="2" className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="e.g. Engine oil change"></textarea>
                </div>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-3 mt-4 border-t border-brand-border/50">
              <button type="button" onClick={handleClose} className="px-5 py-2.5 rounded-lg text-sm font-bold text-brand-muted hover:text-white transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-orange text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-60">{saving ? 'Saving...' : 'Save Expense'}</button>
            </div>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmitFuel}>
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Date</label>
                  <input type="date" value={formDataFuel.date} onChange={e => setFormDataFuel({...formDataFuel, date: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Vehicle</label>
                  <select value={formDataFuel.vehicle_id} onChange={e => setFormDataFuel({...formDataFuel, vehicle_id: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" required>
                    <option value="">Select Vehicle</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Station Name</label>
                  <input type="text" value={formDataFuel.station} onChange={e => setFormDataFuel({...formDataFuel, station: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="e.g. Shell Westlands" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Litres Filled</label>
                  <input type="number" step="0.1" value={formDataFuel.litres} onChange={e => setFormDataFuel({...formDataFuel, litres: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="50.5" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Cost per Litre (KES)</label>
                  <input type="number" step="0.1" value={formDataFuel.cost_per_litre} onChange={e => setFormDataFuel({...formDataFuel, cost_per_litre: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="220" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-muted mb-1.5 uppercase tracking-wider">Total Cost (KES)</label>
                  <input type="number" value={formDataFuel.total} onChange={e => setFormDataFuel({...formDataFuel, total: e.target.value})} className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-white focus:ring-2 focus:ring-brand-orange outline-none" placeholder="11100" required />
                </div>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-3 mt-4 border-t border-brand-border/50">
              <button type="button" onClick={handleClose} className="px-5 py-2.5 rounded-lg text-sm font-bold text-brand-muted hover:text-white transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-orange text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-60">{saving ? 'Saving...' : 'Save Fuel Log'}</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Expenses;
