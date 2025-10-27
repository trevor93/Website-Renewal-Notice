import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Mail, Globe, RefreshCw } from 'lucide-react';
import { supabase, Client } from '../lib/supabase';

interface ClientsTableProps {
  onEmailNotification: (clientName: string, domain: string) => void;
}

export function ClientsTable({}: ClientsTableProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();

    const channel = supabase
      .channel('clients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients'
        },
        () => {
          fetchClients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  const toggleSiteActivation = async (clientId: string, currentStatus: boolean) => {
    setActionLoading(clientId);

    const { error } = await supabase
      .from('clients')
      .update({
        site_active: !currentStatus,
        manual_override: true,
      })
      .eq('id', clientId);

    if (error) {
      console.error('Error toggling site activation:', error);
      alert('Failed to update site status. Please try again.');
    } else {
      await fetchClients();
    }

    setActionLoading(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>No clients found. Add your first client to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Site Name</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Domain</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Email</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Monthly Fee</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Status</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Payment Date</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Site Active</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Manual Control</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${client.site_active ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                  <span className="text-white font-medium">{client.site_name}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <a
                  href={`https://${client.domain_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center space-x-1"
                >
                  <Globe className="w-4 h-4" />
                  <span>{client.domain_name}</span>
                </a>
              </td>
              <td className="py-4 px-4">
                <a
                  href={`mailto:${client.email}`}
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{client.email}</span>
                </a>
              </td>
              <td className="py-4 px-4">
                <span className="text-green-400 font-semibold">${client.monthly_fee?.toFixed(2) || '0.00'}</span>
                <span className="text-gray-500 text-xs ml-1">/month</span>
              </td>
              <td className="py-4 px-4">
                {client.payment_status === 'paid' ? (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-700 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Paid</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-700 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Unpaid</span>
                  </span>
                )}
              </td>
              <td className="py-4 px-4">
                <span className="text-gray-400 text-sm">{formatDate(client.payment_date)}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  {client.site_active ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-700 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-700 text-xs">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <span>Inactive</span>
                    </span>
                  )}
                  {client.manual_override && (
                    <span className="text-xs text-yellow-500 italic">(Manual)</span>
                  )}
                </div>
              </td>
              <td className="py-4 px-4">
                <button
                  onClick={() => toggleSiteActivation(client.id, client.site_active)}
                  disabled={actionLoading === client.id}
                  className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: client.site_active ? '#10b981' : '#6b7280'
                  }}
                >
                  {actionLoading === client.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white mx-auto" />
                  ) : (
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                        client.site_active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
