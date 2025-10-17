import React from 'react';
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
          <span>n8n AI Agent Integration</span>
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          Connect your n8n automation workflow to enable automatic payment checking, email notifications, and site status updates.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Webhook className="w-5 h-5 text-blue-500 mt-1" />
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">Webhook Endpoint</h4>
                <p className="text-gray-400 text-sm mb-2">
                  Configure your n8n workflow to send POST requests to this endpoint when payments are received.
                </p>
                <code className="bg-gray-800 text-green-400 px-3 py-2 rounded text-xs block">
                  POST /api/webhook/payment-received
                </code>
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
        </div>
      </div>
    </div>
  );
}
