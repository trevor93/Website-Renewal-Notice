import { useEffect, useState } from 'react';
import { DollarSign, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { supabase, Client } from '../lib/supabase';

interface StatCard {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  bgColor: string;
}

export function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*');

    if (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalClients: 0,
        activeClients: 0,
        totalRevenue: 0,
        pendingPayments: 0,
      });
    } else {
      const clients = data as Client[];
      const totalClients = clients.length;
      const activeClients = clients.filter(c => c.site_active).length;
      const totalRevenue = clients
        .filter(c => c.payment_status === 'paid')
        .reduce((sum, c) => sum + (c.monthly_fee || 0), 0);
      const pendingPayments = clients.filter(c => c.payment_status === 'unpaid').length;

      setStats({
        totalClients,
        activeClients,
        totalRevenue,
        pendingPayments,
      });
    }
    setLoading(false);
  };


  const statCards: StatCard[] = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-600',
    },
    {
      title: 'Active Sites',
      value: stats.activeClients,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-600',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'yellow',
      bgColor: 'bg-yellow-600',
    },
    {
      title: 'Unpaid Clients',
      value: stats.pendingPayments,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-gray-400">Welcome back, Salmin. Here's your hosting business summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-gray-900/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
              <p className="text-white text-2xl font-bold">
                {typeof stat.value === 'string' ? stat.value : stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-yellow-600/50 rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-2">Quick Actions</h3>
        <p className="text-gray-300 text-sm mb-4">
          Manage your clients, track payments, and control site access from the Clients tab.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300">
            View all clients
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300">
            Process payments
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300">
            Suspend/Reactivate sites
          </div>
        </div>
      </div>
    </div>
  );
}
