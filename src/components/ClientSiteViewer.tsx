import { useState, useEffect } from 'react';
import { Globe, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ClientData {
  id: string;
  site_name: string;
  domain_name: string;
  site_active: boolean;
  payment_status: string;
}

export function ClientSiteViewer() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadClientsData();
  }, []);

  const loadClientsData = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('site_name');

      if (error) throw error;

      setClients(data || []);
      if (data && data.length > 0) {
        setSelectedClient(data[0]);
      }
    } catch (error) {
      console.error('Error loading clients data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateClientStatus = async (clientId: string, newStatus: boolean) => {
    setUpdating(true);

    try {
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
      //     metadata: { source: 'site_viewer', triggered_by: 'admin' }
      //   });
      //
      // if (logError) {
      //   console.warn('Failed to log deployment action:', logError);
      // }

      const updatedClients = clients.map(client =>
        client.id === clientId
          ? { ...client, site_active: newStatus }
          : client
      );
      setClients(updatedClients);
      const updatedClient = updatedClients.find(c => c.id === clientId);
      if (updatedClient) {
        setSelectedClient(updatedClient);
      }
    } catch (error) {
      console.error('Error updating client status:', error);
      alert('Failed to update client status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const toggleSiteStatus = () => {
    if (selectedClient) {
      const newStatus = !selectedClient.site_active;
      updateClientStatus(selectedClient.id, newStatus);
    }
  };

  const getSiteUrl = () => {
    if (!selectedClient) return '';

    if (!selectedClient.site_active) {
      return '/renewal_notice/index.html';
    }

    return `/client_sites/${selectedClient.domain_name}/index.html`;
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
        <p>No client sites available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Client Site Viewer</h2>
          <p className="text-gray-400">Preview and manage client website status</p>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-semibold">Select Client</label>
            <select
              value={selectedClient?.id || ''}
              onChange={(e) => {
                const client = clients.find(c => c.id === e.target.value);
                if (client) setSelectedClient(client);
              }}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.site_name} - {client.domain_name}
                </option>
              ))}
            </select>
          </div>

          {selectedClient && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-gray-300 text-sm mb-1 font-semibold">Site Status</label>
                  <div className="flex items-center space-x-2">
                    {selectedClient.site_active ? (
                      <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Suspended</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={toggleSiteStatus}
                  disabled={updating}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                    selectedClient.site_active
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      {selectedClient.site_active ? (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          <span>Deactivate Site</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Activate Site</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>

              {!selectedClient.site_active && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                  <p className="text-red-400 text-sm flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Visitors will see the renewal notice page</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedClient && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm font-mono">{getSiteUrl()}</span>
            </div>

            <div className="relative" style={{ height: '600px' }}>
              {/* FIX: Updated iframe sandbox attributes to allow localStorage access */}
              {/* Added 'allow-same-origin' to permit localStorage access for activation checks */}
              {/* Added 'referrerPolicy' to control referrer information */}
              <iframe
                key={getSiteUrl()}
                src={getSiteUrl()}
                className="w-full h-full border-0"
                title={`${selectedClient.site_name} Website Preview`}
                sandbox="allow-scripts allow-same-origin"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
