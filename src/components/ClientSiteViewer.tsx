import { useState, useEffect } from 'react';
import { Globe, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface ClientData {
  id: number;
  name: string;
  domain: string;
  site_status: 'active' | 'inactive';
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
      const response = await fetch('/data/clients.json');
      const data = await response.json();
      setClients(data);
      if (data.length > 0) {
        setSelectedClient(data[0]);
      }
    } catch (error) {
      console.error('Error loading clients data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateClientStatus = async (clientId: number, newStatus: 'active' | 'inactive') => {
    setUpdating(true);

    try {
      const updatedClients = clients.map(client =>
        client.id === clientId
          ? { ...client, site_status: newStatus }
          : client
      );

      const response = await fetch('/data/clients.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClients),
      });

      if (response.ok) {
        setClients(updatedClients);
        const updatedClient = updatedClients.find(c => c.id === clientId);
        if (updatedClient) {
          setSelectedClient(updatedClient);
        }
      }
    } catch (error) {
      console.error('Error updating client status:', error);
      alert('Failed to update client status. Note: This is a frontend-only demo. In production, this would update the server.');

      const updatedClients = clients.map(client =>
        client.id === clientId
          ? { ...client, site_status: newStatus }
          : client
      );
      setClients(updatedClients);
      const updatedClient = updatedClients.find(c => c.id === clientId);
      if (updatedClient) {
        setSelectedClient(updatedClient);
      }
    } finally {
      setUpdating(false);
    }
  };

  const toggleSiteStatus = () => {
    if (selectedClient) {
      const newStatus = selectedClient.site_status === 'active' ? 'inactive' : 'active';
      updateClientStatus(selectedClient.id, newStatus);
    }
  };

  const getSiteUrl = () => {
    if (!selectedClient) return '';

    if (selectedClient.site_status === 'inactive') {
      return '/renewal_notice/index.html';
    }

    return `/client_sites/${selectedClient.domain}/index.html`;
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
                const client = clients.find(c => c.id === parseInt(e.target.value));
                if (client) setSelectedClient(client);
              }}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.domain}
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
                    {selectedClient.site_status === 'active' ? (
                      <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Inactive</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={toggleSiteStatus}
                  disabled={updating}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                    selectedClient.site_status === 'active'
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
                      {selectedClient.site_status === 'active' ? (
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

              {selectedClient.site_status === 'inactive' && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                  <p className="text-red-400 text-sm flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Client will see the renewal notice page</span>
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
              <iframe
                key={getSiteUrl()}
                src={getSiteUrl()}
                className="w-full h-full border-0"
                title={`${selectedClient.name} Website Preview`}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
