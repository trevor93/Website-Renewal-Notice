import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ClientsTable } from './components/ClientsTable';
import { Settings } from './components/Settings';
import { EmailNotification } from './components/EmailNotification';

function AppContent() {
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
