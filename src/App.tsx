import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ClientRenewalNotice } from './components/ClientRenewalNotice';
import { useCurrentRoute } from './components/useNavigate';

const ProviderPortal = lazy(() => import('./components/ProviderPortal').then(m => ({ default: m.ProviderPortal })));

function App() {
  const [currentRoute, setCurrentRoute] = useState(useCurrentRoute());

  useEffect(() => {
    const handleHashChange = () => {
      const newRoute = useCurrentRoute();
      console.log('Route changed to:', newRoute);
      setCurrentRoute(newRoute);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  console.log('Current route:', currentRoute);

  if (currentRoute === '/client' || currentRoute === '/') {
    return <ClientRenewalNotice />;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ProviderPortal />
    </Suspense>
  );
}

export default App;
