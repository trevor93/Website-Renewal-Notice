import { useEffect } from 'react';
import { X, Mail, CheckCircle } from 'lucide-react';

interface EmailNotificationProps {
  clientName: string;
  domain: string;
  onClose: () => void;
}

export function EmailNotification({ clientName, domain, onClose }: EmailNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 animate-slide-up">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Email Sent</h3>
                <p className="text-gray-400 text-sm">Payment Confirmation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 mb-4">
            <div className="flex items-start space-x-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-semibold">To:</span> {clientName}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-semibold">Domain:</span> {domain}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3 mt-3">
              <p className="text-sm text-gray-400 mb-2">
                <span className="font-semibold text-gray-300">Subject:</span> Payment Received - Website Reactivation Confirmation
              </p>
              <div className="bg-gray-800 rounded p-3 text-sm text-gray-300 leading-relaxed">
                <p className="mb-2">Dear {clientName},</p>
                <p className="mb-2">
                  Payment received successfully. Your website will be reactivated shortly by your hosting and domain provider, <span className="font-semibold text-white">Salmin Abdalla</span>.
                </p>
                <p className="text-gray-400 text-xs mt-3">
                  Thank you for your continued business.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              <span className="font-semibold">Note:</span> This is a simulated email notification. In production, this would be sent via your n8n AI agent automation workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
