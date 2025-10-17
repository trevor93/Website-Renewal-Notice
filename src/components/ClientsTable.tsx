import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Power, RefreshCw, Users } from 'lucide-react';
import { supabase, Client } from '../lib/supabase';

interface ClientsTableProps {
  onEmailNotification: (clientName: string, domain: string) => void;
}

export function ClientsTable({ onEmailNotification }: ClientsTableProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
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

  const suspendSite = async (clientId: string, clientName: string) => {
    setActionLoading(clientId);

    const { error } = await supabase
      .from('clients')
      .update({
        site_active: false,
        payment_status: 'unpaid',
      })
      .eq('id', clientId);

    if (error) {
      console.error('Error suspending site:', error);
      alert('Failed to suspend site. Please try again.');
    } else {
      await fetchClients();
      alert(`${clientName}'s site has been temporarily disabled due to non-payment.`);
    }

    setActionLoading(null);
  };

  const reactivateSite = async (clientId: string, clientName: string, domain: string) => {
    setActionLoading(clientId);

    const { error } = await supabase
      .from('clients')
      .update({
        site_active: true,
        payment_status: 'paid',
        last_payment_date: new Date().toISOString().split('T')[0],
      })
      .eq('id', clientId);

    if (error) {
      console.error('Error reactivating site:', error);
      alert('Failed to reactivate site. Please try again.');
    } else {
      await fetchClients();
      onEmailNotification(clientName, domain);
      alert(`${clientName}'s site has been reactivated successfully!`);
    }

    setActionLoading(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>No clients found. Add your first client to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Domain Name</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Client Name</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Amount Due</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Status</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Last Payment</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Next Due Date</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Actions</th>
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
                  <div className={`w-2 h-2 rounded-full ${client.site_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-white font-medium">{client.domain_name}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-300">{client.client_name}</td>
              <td className="py-4 px-4 text-white font-semibold">{formatCurrency(client.amount_due)}</td>
              <td className="py-4 px-4">
                {client.payment_status === 'paid' ? (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-700 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Paid</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-700 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Not Paid</span>
                  </span>
                )}
              </td>
              <td className="py-4 px-4 text-gray-400">{formatDate(client.last_payment_date)}</td>
              <td className="py-4 px-4 text-gray-400">{formatDate(client.next_due_date)}</td>
              <td className="py-4 px-4">
                {client.site_active ? (
                  <button
                    onClick={() => suspendSite(client.id, client.client_name)}
                    disabled={actionLoading === client.id}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {actionLoading === client.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4" />
                        <span>Suspend</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => reactivateSite(client.id, client.client_name, client.domain_name)}
                    disabled={actionLoading === client.id}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {actionLoading === client.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Reactivate</span>
                      </>
                    )}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
