import { useState, useEffect } from 'react';
import { ClientRenewalNotice } from './components/ClientRenewalNotice';
import { ProviderPortal } from './components/ProviderPortal';
import PaymentConfirmation from './components/PaymentConfirmation';
import { useCurrentRoute } from './components/useNavigate';
import { supabase } from './lib/supabase';
import { ClientWebsite } from './components/ClientWebsite';

interface ClientStatus {
  site_active: boolean;
  monthly_fee: number;
  site_name: string;
  domain_name: string;
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    try {
      return useCurrentRoute();
    } catch (error) {
      console.error('Error getting current route:', error);
      return '/';
    }
  });

  const [clientStatus, setClientStatus] = useState<ClientStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentDomain = window.location.hostname;

    const fetchClientStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('site_active, monthly_fee, site_name, domain_name')
          .eq('domain_name', currentDomain)
          .maybeSingle();

        if (error) {
          console.error('Error fetching client status:', error);
        } else if (data) {
          setClientStatus(data);
        }
      } catch (error) {
        console.error('Error checking site status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientStatus();

    const channel = supabase
      .channel('client-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'clients',
          filter: `domain_name=eq.${currentDomain}`
        },
        (payload) => {
          console.log('Client status updated:', payload);
          if (payload.new) {
            setClientStatus(payload.new as ClientStatus);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
    if (currentRoute === '/portal') {
      return <ProviderPortal />;
    }

    if (currentRoute === '/payment-confirmation') {
      return <PaymentConfirmation />;
    }

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#d4af37]"></div>
        </div>
      );
    }

    if (clientStatus && !clientStatus.site_active) {
      return (
        <ClientRenewalNotice
          monthlyFee={clientStatus.monthly_fee}
          siteName={clientStatus.site_name}
        />
      );
    }

    return <ClientWebsite />;
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
