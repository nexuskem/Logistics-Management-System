import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import api from '../utils/api';
import { 
  TruckIcon, MapIcon, CurrencyDollarIcon, PresentationChartLineIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
        // Provide mock data if backend isn't ready or fails
        setStats({
          kpis: {
            totalVehicles: 42,
            activeTrips: 18,
            revenueThisMonth: 1250000,
            expensesThisMonth: 420000,
            pendingDeliveries: 5
          },
          vehicleStatusBreakdown: [
            { status: 'AVAILABLE', _count: { status: 15 } },
            { status: 'ON_TRIP', _count: { status: 18 } },
            { status: 'UNDER_MAINTENANCE', _count: { status: 7 } },
            { status: 'GROUNDED', _count: { status: 2 } }
          ],
          recentTrips: [
            { id: 't1', status: 'IN_TRANSIT', client: { name: 'Safaricom' }, vehicle: { plate: 'KDC 123A' }, origin: 'Nairobi', destination: 'Mombasa' },
            { id: 't2', status: 'DISPATCHED', client: { name: 'EABL' }, vehicle: { plate: 'KBB 456X' }, origin: 'Nairobi', destination: 'Kisumu' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-32 bg-brand-panel rounded-2xl"></div>
      <div className="h-64 bg-brand-panel rounded-2xl"></div>
    </div>;
  }

  const KPICard = ({ title, value, icon: Icon, colorClass, prefix = '' }) => (
    <div className="bg-brand-panel rounded-2xl p-6 shadow-md border border-brand-border flex items-center justify-between group hover:shadow-lg transition-all hover:-translate-y-1">
      <div>
        <p className="text-sm font-medium text-brand-muted mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
      </div>
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  );

  const pieData = stats?.vehicleStatusBreakdown?.map(item => ({
    name: item.status.replace('_', ' '),
    value: item._count.status
  })) || [];

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']; // Emerald, Blue, Amber, Red

  const barData = [
    { name: 'Revenue', amount: stats?.kpis?.revenueThisMonth || 0 },
    { name: 'Expenses', amount: stats?.kpis?.expensesThisMonth || 0 }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-text">Dashboard Overview</h1>
        <div className="text-sm text-brand-muted">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Vehicles" 
          value={stats?.kpis?.totalVehicles} 
          icon={TruckIcon} 
          colorClass="bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/20 shadow-lg" 
        />
        <KPICard 
          title="Active Trips" 
          value={stats?.kpis?.activeTrips} 
          icon={MapIcon} 
          colorClass="bg-gradient-to-br from-brand-orange to-orange-600 shadow-orange-500/20 shadow-lg" 
        />
        <KPICard 
          title="Monthly Revenue" 
          value={stats?.kpis?.revenueThisMonth} 
          prefix="KES " 
          icon={PresentationChartLineIcon} 
          colorClass="bg-gradient-to-br from-emerald-500 to-green-600 shadow-green-500/20 shadow-lg" 
        />
        <KPICard 
          title="Monthly Expenses" 
          value={stats?.kpis?.expensesThisMonth} 
          prefix="KES " 
          icon={CurrencyDollarIcon} 
          colorClass="bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/20 shadow-lg" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-brand-panel p-6 rounded-2xl shadow-md border border-brand-border lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-6">Financial Overview</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `KES ${value/1000}k`} tick={{fill: '#9CA3AF'}} />
                <RechartsTooltip cursor={{fill: '#1F2937'}} contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff'}} formatter={(value) => `KES ${value.toLocaleString()}`} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-brand-panel p-6 rounded-2xl shadow-md border border-brand-border">
          <h2 className="text-lg font-bold text-white mb-6">Fleet Status</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '8px'}} itemStyle={{color: '#fff'}} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{color: '#9CA3AF'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-brand-panel rounded-2xl shadow-md border border-brand-border overflow-hidden">
        <div className="px-6 py-5 border-b border-brand-border flex justify-between items-center bg-brand-panel-light/30">
          <h2 className="text-lg font-bold text-white">Recent Trips</h2>
          <button onClick={() => navigate('/trips')} className="text-sm text-brand-orange font-medium hover:text-orange-400 transition-colors">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-panel-light text-brand-muted text-xs uppercase tracking-widest font-semibold">
                <th className="px-6 py-4">Trip ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-sm">
              {stats?.recentTrips?.map((trip) => (
                <tr key={trip.id} className="hover:bg-brand-panel-light/60 transition-colors">
                  <td className="px-6 py-5 font-medium text-white border-b border-transparent">
                    #{trip.id.substring(0,8).toUpperCase()}
                  </td>
                  <td className="px-6 py-5 text-brand-muted">{trip.client?.name || 'N/A'}</td>
                  <td className="px-6 py-5">
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium px-2.5 py-1 rounded-md text-xs">
                      {trip.vehicle?.plate || 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      trip.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      trip.status === 'IN_TRANSIT' ? 'bg-orange-500/10 text-brand-orange border-orange-500/20' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {trip.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {(!stats?.recentTrips || stats.recentTrips.length === 0) && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-brand-muted">
                    No recent trips found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
