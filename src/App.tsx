import React, { useState, useEffect } from 'react';
import { ClientRenewalNotice } from './components/ClientRenewalNotice';
import { ProviderPortal } from './components/ProviderPortal';
import PaymentConfirmation from './components/PaymentConfirmation';
import { useCurrentRoute } from './components/useNavigate';

function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    try {
      return useCurrentRoute();
    } catch (error) {
      console.error('Error getting current route:', error);
      return '/';
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHashChange = () => {
      try {
        const newRoute = useCurrentRoute();
        console.log('Route changed to:', newRoute);
        setCurrentRoute(newRoute);
      } catch (error) {
        console.error('Error handling route change:', error);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  console.log('Current route:', currentRoute);

  try {
    // Show Provider Portal for /portal route
    if (currentRoute === '/portal') {
      return <ProviderPortal />;
    }

    // Show Payment Confirmation page
    if (currentRoute === '/payment-confirmation') {
      return <PaymentConfirmation />;
    }

    // Show Client Portal for all other routes (/, /client, etc.)
    return <ClientRenewalNotice />;
  } catch (error) {
    console.error('Error rendering app:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Page</h1>
          <p className="text-gray-600">Please refresh the page or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }
}

export default App;
