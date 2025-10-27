import { Webhook, Zap, Database, Mail } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Settings & Integration</h2>
        <p className="text-gray-400">Configure automation and future integrations</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span>Automation & n8n Integration</span>
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          Automatic monthly site management and n8n workflow integration for payment tracking and email notifications.
        </p>

        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-green-500 rounded-full mt-1 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">Automatic Monthly Deactivation</h4>
                <p className="text-gray-300 text-sm mb-2">
                  <span className="text-green-400 font-semibold">Active:</span> The system automatically checks daily and deactivates sites 30 days after their last payment date. Sites will be marked as "unpaid" and "inactive" unless manual override is enabled.
                </p>
                <code className="bg-gray-800 text-green-400 px-3 py-2 rounded text-xs block">
                  Endpoint: POST /functions/v1/check-expired-clients
                </code>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Webhook className="w-5 h-5 text-blue-500 mt-1" />
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">Payment Webhook</h4>
                <p className="text-gray-400 text-sm mb-2">
                  Configure your n8n workflow to send POST requests to this endpoint when payments are received. This will automatically reactivate suspended sites.
                </p>
                <code className="bg-gray-800 text-green-400 px-3 py-2 rounded text-xs block">
                  POST /functions/v1/n8n-payment-webhook
                </code>
                <p className="text-gray-400 text-xs mt-2">
                  Payload: {`{ "domain": "example.com", "payment_status": "paid", "payment_date": "2025-10-27" }`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Database className="w-5 h-5 text-purple-500 mt-1" />
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">Database Sync</h4>
                <p className="text-gray-400 text-sm mb-2">
                  Your n8n agent can query the Supabase database directly to check client payment status and update records.
                </p>
                <code className="bg-gray-800 text-green-400 px-3 py-2 rounded text-xs block mb-2">
                  SELECT * FROM clients WHERE payment_status = 'unpaid'
                </code>
                <code className="bg-gray-800 text-green-400 px-3 py-2 rounded text-xs block">
                  UPDATE clients SET payment_status = 'paid' WHERE id = '{'{client_id}'}'
                </code>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-red-500 mt-1" />
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">Email Automation</h4>
                <p className="text-gray-400 text-sm mb-2">
                  Configure your n8n workflow to automatically send email notifications to clients when:
                </p>
                <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                  <li>Payment is received and site is reactivated</li>
                  <li>Payment is due in 3 days</li>
                  <li>Site is suspended due to non-payment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            <span className="font-semibold">Integration Guide:</span> All the necessary API endpoints and database queries are documented above. Simply connect your n8n workflow to these integration points to enable full automation.
          </p>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Account Information</h3>
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-sm">Admin Email</label>
            <p className="text-white">admin@salminhosting.com</p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Business Name</label>
            <p className="text-white">Salmin Hosting & Domain Provider</p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Portal Version</label>
            <p className="text-white">v1.0.0</p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Active Clients</label>
            <p className="text-white">1 client (AquaBliss Water - $14.99/month)</p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Total Monthly Revenue</label>
            <p className="text-green-400 font-semibold text-lg">$14.99</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-2">Database Status</h3>
        <p className="text-blue-300 text-sm">
          ✓ Connected to Supabase Database
        </p>
        <p className="text-gray-400 text-xs mt-2">
          All client data is securely stored and automatically synced.
        </p>
      </div>
    </div>
  );
}
