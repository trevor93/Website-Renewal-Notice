import { useState } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { useAuth } from '../useAuth';
import { LoginPage } from './LoginPage';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { ClientsTable } from './ClientsTable';
import { Settings } from './Settings';
import { EmailNotification } from './EmailNotification';

function PortalContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [emailNotification, setEmailNotification] = useState<{
    clientName: string;
    domain: string;
  } | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const handleEmailNotification = (clientName: string, domain: string) => {
    setEmailNotification({ clientName, domain });
  };

  const closeEmailNotification = () => {
    setEmailNotification(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex animate-fade-in">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Client Management</h2>
                <p className="text-gray-400">View and manage all client domains and payment status</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <ClientsTable onEmailNotification={handleEmailNotification} />
              </div>
            </div>
          )}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>

      {emailNotification && (
        <EmailNotification
          clientName={emailNotification.clientName}
          domain={emailNotification.domain}
          onClose={closeEmailNotification}
        />
      )}
    </div>
  );
}

export function ProviderPortal() {
  return (
    <AuthProvider>
      <PortalContent />
    </AuthProvider>
  );
}
