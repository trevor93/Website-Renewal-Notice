import { useState, useEffect } from 'react';
import { X, CheckCircle, CreditCard, Building2, AlertCircle } from 'lucide-react';

interface ClientInfo {
  websiteName: string;
  amountDue: string;
  paypalLink: string;
  domain: string;
}

function App() {
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'one-time' | 'upfront'>('one-time');
  const [selectedMonths, setSelectedMonths] = useState(1);

  useEffect(() => {
    const clientDatabase: Record<string, ClientInfo> = {
      'aquablisswaters.com': {
        websiteName: 'Aqua Bliss Waters',
        amountDue: '$14.99',
        paypalLink: 'https://paypal.me/salminabdalla/14.99',
        domain: 'aquablisswaters.com'
      },
      'injaaz.netlify.app': {
        websiteName: 'Injaaz',
        amountDue: '$63.00',
        paypalLink: 'https://paypal.me/salminabdalla/63.00',
        domain: 'injaaz.netlify.app'
      },
      'jaylocs.netlify.app': {
        websiteName: 'Jaylocs',
        amountDue: 'Pending Update',
        paypalLink: 'https://paypal.me/salminabdalla',
        domain: 'jaylocs.netlify.app'
      }
    };

    const currentHostname = window.location.hostname;
    const client = clientDatabase[currentHostname];

    if (client) {
      setClientInfo(client);
    } else {
      setClientInfo({
        websiteName: 'Unknown Domain',
        amountDue: 'N/A',
        paypalLink: '',
        domain: currentHostname
      });
    }
  }, []);

  const handlePaymentClick = (type: 'one-time' | 'upfront') => {
    setPaymentType(type);
    setIsModalOpen(true);
  };

  const upfrontOptions = [
    { months: 2, label: '2 Months' },
    { months: 3, label: '3 Months' },
    { months: 4, label: '4 Months' },
    { months: 5, label: '5 Months' },
    { months: 6, label: '6 Months' },
  ];

  const calculateUpfrontAmount = (months: number): string => {
    if (!clientInfo || clientInfo.amountDue === 'Pending Update' || clientInfo.amountDue === 'N/A') {
      return 'Contact for pricing';
    }
    const baseAmount = parseFloat(clientInfo.amountDue.replace('$', ''));
    return `$${(baseAmount * months).toFixed(2)}`;
  };

  if (!clientInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50 flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isRegisteredDomain = clientInfo.websiteName !== 'Unknown Domain';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
          {!isRegisteredDomain ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Domain Not Registered
              </h1>
              <p className="text-gray-600 text-lg mb-2">
                Domain: <span className="font-semibold">{clientInfo.domain}</span>
              </p>
              <p className="text-red-600 font-semibold text-xl mb-6">
                Domain not registered under Salmin Hosting.
              </p>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                This domain is not currently managed by Salmin Abdalla. If you believe this is an error,
                please contact your hosting provider directly.
              </p>
              <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200">
                <p className="flex items-center justify-center gap-2">
                  Managed by <span className="font-semibold text-gray-700">Salmin Abdalla</span> — Your Hosting and Domain Provider
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slideDown">
                  Your Hosting & Domain Renewal Is Due
                </h1>

                <div className="inline-block bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg px-6 py-4 mb-4">
                  <p className="text-lg md:text-xl font-semibold text-gray-800">
                    Website: <span className="text-amber-700">{clientInfo.websiteName}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Domain: <span className="font-mono text-gray-700">{clientInfo.domain}</span>
                  </p>
                </div>

                <div className="inline-block bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg px-8 py-3 mb-6">
                  <p className="text-2xl md:text-3xl font-bold text-green-700">
                    Amount Due: {clientInfo.amountDue}
                  </p>
                </div>

                <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                  To keep your website online, please complete your renewal payment.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <button
                  onClick={() => handlePaymentClick('one-time')}
                  className="group relative w-full bg-gradient-to-br from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out animate-fadeInUp"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                    <CheckCircle className="w-6 h-6" />
                    One-Time Payment (This Month)
                  </span>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                </button>

                <button
                  onClick={() => handlePaymentClick('upfront')}
                  className="group relative w-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out animate-fadeInUp"
                  style={{ animationDelay: '100ms' }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                    <CreditCard className="w-6 h-6" />
                    Upfront Payment (2–6 Months)
                  </span>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                </button>
              </div>

              <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200">
                <p className="flex items-center justify-center gap-2">
                  Hosting Provider: <span className="font-semibold text-gray-700">Salmin Abdalla</span>
                  <span className="text-gray-400">(Your Hosting and Domain Provider)</span>
                </p>
              </div>
            </>
          )}
        </div>

        <footer className="text-center mt-8 text-sm text-gray-500 animate-fadeIn" style={{ animationDelay: '600ms' }}>
          © 2025 Netlify — Your Hosting and Domain Provider
        </footer>
      </div>

      {isModalOpen && isRegisteredDomain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">Hosting & Domain Renewal Notice</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-gray-800">
                  <span className="font-semibold">Hosting Provider:</span> Salmin Abdalla
                  <span className="text-gray-600 italic"> (Your Hosting & Domain Provider)</span>
                </p>
                <p className="text-gray-700 mt-2">
                  <span className="font-semibold">Website:</span> {clientInfo.websiteName}
                </p>
                <p className="text-gray-700 mt-1">
                  <span className="font-semibold">Payment Type:</span> {paymentType === 'one-time' ? 'One-Time Payment (This Month)' : 'Upfront Payment'}
                </p>
              </div>

              {paymentType === 'upfront' && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-3">Select Duration:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {upfrontOptions.map((option) => (
                      <button
                        key={option.months}
                        onClick={() => setSelectedMonths(option.months)}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                          selectedMonths === option.months
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-700 border-2 border-blue-200 hover:border-blue-400'
                        }`}
                      >
                        <div className="text-sm">{option.label}</div>
                        <div className="text-xs mt-1">{calculateUpfrontAmount(option.months)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  To keep your website active and live online, your hosting and domain records need renewal.
                </p>

                <p>
                  Your hosting and domain provider (Salmin Abdalla) manages all DNS records, server renewals,
                  and technical configurations to keep your website accessible 24/7.
                </p>

                <p>
                  Please make your renewal payment through <span className="font-semibold">PayPal</span> or{' '}
                  <span className="font-semibold">Bank Transfer</span> using the details below. Once payment
                  is received, your website will be fully restored immediately.
                </p>
              </div>

              <div className="mt-8 space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500 text-white p-2 rounded-lg">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">PayPal Payment</h3>
                  </div>
                  {paymentType === 'one-time' && clientInfo.paypalLink ? (
                    <>
                      <p className="text-gray-700 mb-3 font-medium">
                        Amount: <span className="text-2xl font-bold text-blue-700">{clientInfo.amountDue}</span>
                      </p>
                      <a
                        href={clientInfo.paypalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-center"
                      >
                        Pay Now via PayPal
                      </a>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700 mb-2 font-medium">
                        {paymentType === 'upfront' ? `Amount for ${selectedMonths} months: ` : 'Amount: '}
                        <span className="text-xl font-bold text-blue-700">
                          {paymentType === 'upfront' ? calculateUpfrontAmount(selectedMonths) : clientInfo.amountDue}
                        </span>
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        Please contact Salmin Abdalla for the PayPal payment link for this amount.
                      </p>
                      <a
                        href={clientInfo.paypalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-center"
                      >
                        Open PayPal
                      </a>
                    </>
                  )}
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-500 text-white p-2 rounded-lg">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Bank Transfer</h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Alternatively, you can pay via bank transfer:
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-green-300 space-y-2">
                    <p className="text-green-700">
                      <span className="font-semibold">Account Name:</span> Salmin Abdalla
                    </p>
                    <p className="text-green-700">
                      <span className="font-semibold">Account Number:</span> [Insert Bank Number]
                    </p>
                    <p className="text-green-700">
                      <span className="font-semibold">Bank:</span> [Insert Bank Name]
                    </p>
                    <p className="text-green-700 pt-2 border-t border-green-200">
                      <span className="font-semibold">Amount:</span>{' '}
                      <span className="text-xl font-bold">
                        {paymentType === 'upfront' ? calculateUpfrontAmount(selectedMonths) : clientInfo.amountDue}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Why pay Salmin Abdalla?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Because Salmin is the registered hosting and domain administrator for your website,
                  responsible for purchasing, renewing, and setting up DNS records that make your website
                  available online. Without this renewal, your domain and hosting access remain paused.
                </p>
              </div>

              <div className="mt-8 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Next Step
                </h3>
                <p className="leading-relaxed">
                  After payment, please send proof via WhatsApp or email so that your website can be
                  reactivated immediately.
                </p>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
