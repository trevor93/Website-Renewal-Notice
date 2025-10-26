
import React from 'react';
import { LogIn, Clock, Globe, CreditCard } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons, OnApproveData, CreateOrderData } from '@paypal/react-paypal-js';

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

export function ClientRenewalNotice() {
  const paypalClientId = "AVEcap7j8lMceYkDoAkfQus7Q4Ll3UozdGnW9O8J1rNn0cE_XR89OM3X_t6fzzRxybV79OZcjmmpeMmC";
  const renewalAmount = "10.00"; // IMPORTANT: Replace with the actual dynamic amount

  const handleProviderLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Provider Login clicked - navigating to admin portal');
    window.location.hash = '/portal';
  };

  const createOrder = (data: CreateOrderData, actions: any) => {
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

  const onApprove = (data: OnApproveData, actions: any) => {
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
    <PayPalScriptProvider options={{ "client-id": paypalClientId, currency: "USD" }}>
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
              <span className="text-white font-medium text-sm">Provider Login</span>
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
                {/* ... (rest of the content is the same) ... */}

                {/* Service Details */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Service Details</h3>
                  <div className="space-y-3">
                    {/* ... service items ... */}
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

                {/* ... (rest of the component) ... */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </PayPalScriptProvider>
  );
}

