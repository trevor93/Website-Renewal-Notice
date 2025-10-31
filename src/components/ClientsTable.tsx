import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Mail, Globe, RefreshCw, Plus, X } from 'lucide-react';
import { supabase, Client } from '../lib/supabase';

interface ClientsTableProps {
  onEmailNotification: (clientName: string, domain: string) => void;
}

export function ClientsTable({}: ClientsTableProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingClient, setAddingClient] = useState(false);
  const [newClient, setNewClient] = useState({
    site_name: '',
    domain_name: '',
    email: '',
    monthly_fee: '',
    payment_status: 'unpaid',
    payment_date: '',
  });

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

  const addClient = async () => {
    if (!newClient.site_name || !newClient.domain_name || !newClient.email) {
      alert('Please fill in all required fields (Site Name, Domain, Email)');
      return;
    }

    if (!newClient.payment_date) {
      alert('Please select a payment date');
      return;
    }

    setAddingClient(true);

    try {
      const { error } = await supabase
        .from('clients')
        .insert({
          site_name: newClient.site_name,
          domain_name: newClient.domain_name,
          email: newClient.email,
          monthly_fee: newClient.monthly_fee ? parseFloat(newClient.monthly_fee) : 0,
          payment_status: newClient.payment_status,
          payment_date: newClient.payment_date,
          site_active: true,
          manual_override: false,
        });

      if (error) throw error;

      setNewClient({
        site_name: '',
        domain_name: '',
        email: '',
        monthly_fee: '',
        payment_status: 'unpaid',
        payment_date: '',
      });
      setShowAddForm(false);
      await fetchClients();
      alert('Client added successfully!');
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client. Please try again.');
    } finally {
      setAddingClient(false);
    }
  };

  const toggleSiteActivation = async (clientId: string, currentStatus: boolean) => {
    setActionLoading(clientId);

    try {
      const newStatus = !currentStatus;

      const { error: clientError } = await supabase
        .from('clients')
        .update({
          site_active: newStatus,
          manual_override: true,
          payment_status: newStatus ? 'paid' : 'unpaid',
        })
        .eq('id', clientId);

      if (clientError) throw clientError;

      const { error: repoError } = await supabase
        .from('client_repositories')
        .update({
          status: newStatus ? 'active' : 'inactive'
        })
        .eq('client_id', clientId);

      if (repoError) {
        console.warn('No repositories found or failed to update repository status:', repoError);
      }

      // TODO: Add proper repository_id lookup before enabling deployment logging
      // const { error: logError } = await supabase
      //   .from('repository_deployment_logs')
      //   .insert({
      //     repository_id: null,
      //     client_id: clientId,
      //     action: newStatus ? 'activate' : 'deactivate',
      //     success: true,
      //     metadata: { source: 'manual_control', triggered_by: 'admin' }
      //   });
      //
      // if (logError) {
      //   console.warn('Failed to log deployment action:', logError);
      // }

      await fetchClients();
    } catch (error) {
      console.error('Error toggling site activation:', error);
      alert('Failed to update site status. Please try again.');
    } finally {
      setActionLoading(null);
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Client Management</h2>
          <p className="text-gray-400 mt-1">Manage your clients and their website status</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span>{showAddForm ? 'Cancel' : 'Add Client'}</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Add New Client</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Site Name *</label>
              <input
                type="text"
                value={newClient.site_name}
                onChange={(e) => setNewClient({ ...newClient, site_name: e.target.value })}
                placeholder="e.g., AquaBliss Water"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Domain Name *</label>
              <input
                type="text"
                value={newClient.domain_name}
                onChange={(e) => setNewClient({ ...newClient, domain_name: e.target.value })}
                placeholder="e.g., aquablisswaters.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Email *</label>
              <input
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                placeholder="e.g., client@example.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Monthly Fee ($)</label>
              <input
                type="number"
                step="0.01"
                value={newClient.monthly_fee}
                onChange={(e) => setNewClient({ ...newClient, monthly_fee: e.target.value })}
                placeholder="e.g., 29.99"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Status *</label>
              <select
                value={newClient.payment_status}
                onChange={(e) => setNewClient({ ...newClient, payment_status: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Payment Date *</label>
              <input
                type="date"
                value={newClient.payment_date}
                onChange={(e) => setNewClient({ ...newClient, payment_date: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={addClient}
              disabled={addingClient}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {addingClient ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Client</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {clients.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No clients found. Add your first client to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-xl p-6">
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
      )}
    </div>
  );
}
