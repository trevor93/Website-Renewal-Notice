
import React from 'react';
import { LogIn, Clock, Globe, CreditCard } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

// Define the structure for the payment details to be sent to the webhook
interface PaymentDetails {
  paymentStatus: string;
  amount: string;
  payerEmail: string;
}

// Function to send payment details to the n8n webhook
const notifyWebhook = async (details: PaymentDetails) => {
  const webhookUrl = 'https://naimtech-n8n.up.railway.app/webhook-test/402127e2-5918-4dc6-ab6c-f796a6e9cb9f/webhook';
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      throw new Error(`Webhook response was not ok: ${response.statusText}`);
    }

    console.log('Webhook notified successfully!');
  } catch (error) {
    console.error('Failed to notify webhook:', error);
    // You might want to add more robust error handling here
  }
};

interface ClientRenewalNoticeProps {
  monthlyFee: number;
  siteName: string;
}

export function ClientRenewalNotice({ monthlyFee, siteName }: ClientRenewalNoticeProps) {
  const paypalClientId = "AVEcap7j8lMceYkDoAkfQus7Q4Ll3UozdGnW9O8J1rNn0cE_XR89OM3X_t6fzzRxybV79OZcjmmpeMmC";
  const renewalAmount = monthlyFee.toFixed(2);

  const handleProviderLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Provider Login clicked - navigating to admin portal');
    window.location.hash = '/portal';
  };

  const createOrder = (_data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          description: "Website Services Renewal",
          amount: {
            currency_code: "USD", // Change currency if needed
            value: renewalAmount,
          },
        },
      ],
    });
  };

  const onApprove = (_data: any, actions: any) => {
    return actions.order.capture().then(async (details: any) => {
      console.log('Payment Successful:', details);

      const paymentData: PaymentDetails = {
        paymentStatus: 'completed',
        amount: details.purchase_units[0].amount.value,
        payerEmail: details.payer.email_address,
      };

      // Notify the n8n webhook
      await notifyWebhook(paymentData);

      // Redirect to the confirmation page
      window.location.hash = '/payment-confirmation';
    }).catch((err: any) => {
      console.error('Payment capture failed:', err);
      // Handle payment failure (e.g., show an error message)
    });
  };

  return (
    <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD" }}>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
        {/* Header with Provider Login Icon */}
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Globe className="w-6 h-6 text-[#d4af37]" />
              <span className="text-xl font-bold text-gray-800">Website Services</span>
            </div>
            <button
              type="button"
              onClick={handleProviderLogin}
              className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#d4af37] hover:bg-[#c9a533] transition-all duration-300 shadow-lg hover:shadow-xl"
              title="Provider Login"
            >
              <LogIn className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="text-white font-medium text-sm">Admin Only</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 pb-12 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Renewal Notice Card */}
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#d4af37] overflow-hidden animate-fade-in">
              {/* Gold Header Bar */}
              <div className="bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] p-1">
                <div className="bg-white m-1 rounded-lg py-6 px-8">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <Clock className="w-8 h-8 text-[#d4af37]" />
                    <h1 className="text-4xl font-bold text-gray-800">Website Renewal Notice</h1>
                  </div>
                  <p className="text-center text-gray-600 text-lg">Your hosting and domain renewal is due</p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-12 space-y-8">
                {/* Important Notice */}
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-800 mb-2">Website Temporarily Suspended</h3>
                      <p className="text-red-700 leading-relaxed">
                        Your website <span className="font-semibold">{siteName}</span> has been temporarily suspended due to unpaid renewal.
                        Please complete the payment below to reactivate your site immediately.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Service Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Website Hosting</span>
                      </div>
                      <span className="text-gray-800 font-medium">${renewalAmount}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-gray-700">SSL Certificate</span>
                      </div>
                      <span className="text-green-600 font-medium">Included</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                        <span className="text-gray-700">Domain Management</span>
                      </div>
                      <span className="text-green-600 font-medium">Included</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="text-gray-700">24/7 Support</span>
                      </div>
                      <span className="text-green-600 font-medium">Included</span>
                    </div>
                    <div className="flex justify-between items-center py-3 mt-4 bg-[#d4af37]/10 rounded-lg px-4">
                      <span className="text-lg font-bold text-gray-800">Total Amount Due</span>
                      <span className="text-2xl font-bold text-[#d4af37]">${renewalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 text-white shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <CreditCard className="w-7 h-7 text-[#d4af37]" />
                    <h3 className="text-2xl font-bold">Secure Payment</h3>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Complete your payment securely using PayPal. Once your payment is confirmed, your services will be automatically renewed.
                  </p>

                  {/* PayPal Button */}
                  <div className="bg-white rounded-lg p-8 text-center">
                    <PayPalButtons
                      style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' }}
                      createOrder={createOrder}
                      onApprove={onApprove}
                    />
                    <p className="text-xs text-gray-500 mt-4">Secure payment processed by PayPal.</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Need Assistance?</h3>
                  <p className="text-gray-700 mb-3">
                    If you have any questions about your renewal or need help with payment, please contact us:
                  </p>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:websiterenewalnetlify@gmail.com" className="font-medium hover:underline">
                      websiterenewalnetlify@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-gray-800 text-white py-6">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-gray-300 text-sm">
              Powered by Salmin Hosting Services
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Secure payment processing and reliable hosting solutions
            </p>
          </div>
        </footer>
      </div>
    </PayPalScriptProvider>
  );
}

