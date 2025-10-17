import React from 'react';
import { LogIn, Clock, Globe, CreditCard } from 'lucide-react';
import { useNavigate } from './useNavigate';

export function ClientRenewalNotice() {
  const navigate = useNavigate();

  const handleProviderLogin = () => {
    navigate('/portal');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Header with Provider Login Icon */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Globe className="w-6 h-6 text-[#d4af37]" />
            <span className="text-xl font-bold text-gray-800">Website Services</span>
          </div>
          <button
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
              {/* Important Notice */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-[#d4af37] rounded-r-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-[#d4af37] rounded-full mr-3 animate-pulse"></span>
                  Action Required
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Your website hosting and domain services are scheduled to expire soon. To maintain uninterrupted access to your website, please complete your renewal payment at your earliest convenience.
                </p>
                <div className="bg-white/70 rounded-lg p-4 mt-4">
                  <p className="text-gray-600 text-sm">
                    <strong className="text-[#d4af37]">Note:</strong> Failure to renew may result in temporary suspension of your website services.
                  </p>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Service Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Website Hosting</span>
                    <span className="font-semibold text-gray-800">Annual Plan</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Domain Registration</span>
                    <span className="font-semibold text-gray-800">1 Year</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">SSL Certificate</span>
                    <span className="font-semibold text-gray-800">Included</span>
                  </div>
                  <div className="flex justify-between items-center py-3 mt-4 bg-[#d4af37]/10 rounded-lg px-4">
                    <span className="text-lg font-bold text-gray-800">Total Amount Due</span>
                    <span className="text-2xl font-bold text-[#d4af37]">$XX.XX</span>
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
                  Complete your payment securely using PayPal. Once your payment is confirmed, your services will be automatically renewed and your website will remain active.
                </p>

                {/* PayPal Button Placeholder */}
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="mb-4">
                    <svg className="w-32 h-12 mx-auto" viewBox="0 0 124 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M46.211 6.749h-6.839c-.468 0-.866.34-.939.803l-2.766 17.537c-.055.346.213.658.564.658h3.265c.468 0 .866-.34.939-.803l.746-4.73c.072-.463.471-.803.938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.747-4.985-1.747zM47.215 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583c.043-.277.283-.481.564-.481h.473c1.235 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM66.654 13.075h-3.275c-.281 0-.52.204-.564.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91c-.055.348.213.66.562.66h2.95c.469 0 .865-.34.939-.803l1.77-11.209c.055-.348-.213-.658-.56-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291c-.314 0-.609.156-.787.417l-4.539 6.686-1.924-6.425c-.121-.402-.492-.678-.912-.678h-3.234c-.393 0-.666.384-.541.754l3.625 10.638-3.408 4.811c-.268.379.002.9.465.9h3.287c.312 0 .604-.152.781-.408l10.946-15.8c.265-.378-.002-.895-.468-.895z" fill="#253B80"/>
                      <path d="M94.992 6.749h-6.84c-.467 0-.865.34-.938.803l-2.766 17.537c-.055.346.213.658.562.658h3.51c.326 0 .605-.238.656-.562l.785-4.971c.072-.463.471-.803.938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.747-4.983-1.747zm1.003 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583c.043-.277.281-.481.562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273c-.281 0-.52.204-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91c-.055.348.213.66.564.66h2.949c.467 0 .865-.34.938-.803l1.771-11.209c.055-.348-.212-.658-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858c-.055.346.213.658.562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536c.055-.346-.213-.659-.562-.659h-3.16c-.281.001-.52.204-.562.482z" fill="#179BD7"/>
                      <path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292c.023-.143.105-.273.218-.364.114-.09.257-.141.405-.141h9.574c3.186 0 5.385.662 6.537 1.965.532.6.861 1.225 1.006 1.917.155.728.167 1.602.034 2.672l-.013.091v.78l.61.346c.48.236.863.52 1.156.865.485.573.8 1.29.936 2.134.138.859.123 1.898-.042 3.089-.194 1.408-.534 2.631-1.009 3.632-.435.925-.994 1.713-1.661 2.337-.599.56-1.303 1.012-2.095 1.347-.76.322-1.612.576-2.535.752-.893.172-1.864.259-2.888.259h-.685c-.433 0-.853.17-1.167.472-.314.301-.503.712-.525 1.143l-.039.226-.586 3.722-.027.136c-.01.087-.041.172-.086.242-.042.072-.108.123-.184.125h-3.233z" fill="#253B80"/>
                      <path d="M23.048 7.667l-.028.179c-.966 4.957-4.273 6.67-8.497 6.67h-2.15c-.519 0-.961.379-1.041.898l-1.109 7.049-.314 1.994c-.046.291.165.554.459.554h3.22c.454 0 .84-.332.912-.786l.038-.197.723-4.586.047-.252c.072-.454.459-.786.912-.786h.575c3.695 0 6.589-1.501 7.433-5.843.353-1.813.17-3.326-.797-4.394-.294-.322-.654-.59-1.081-.798z" fill="#179BD7"/>
                      <path d="M21.754 7.151c-.189-.055-.384-.105-.584-.15-.201-.044-.407-.083-.619-.117-.742-.12-1.555-.177-2.426-.177h-7.352c-.181 0-.353.046-.507.131-.283.156-.491.438-.544.777L8.05 17.605l-.045.289c.08-.518.522-.898 1.041-.898h2.15c4.224 0 7.531-1.713 8.497-6.67l.028-.179c-.375-.155-.773-.283-1.193-.379-.213-.049-.43-.092-.651-.129z" fill="#222D65"/>
                      <path d="M9.614 7.699c.053-.339.261-.621.544-.777.155-.085.326-.131.507-.131h7.352c.871 0 1.684.057 2.426.177.212.034.418.073.619.117.2.045.395.095.584.15.42.096.818.224 1.193.379.335-2.127-.008-3.573-1.18-4.892C20.357 1.401 17.759.74 14.36.74H4.786c-.52 0-.963.383-1.042.902L.012 25.285c-.052.335.19.638.528.638h3.843l.964-6.117 1.672-10.607z" fill="#253B80"/>
                    </svg>
                  </div>
                  <button className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Pay Now with PayPal
                  </button>
                  <p className="text-xs text-gray-500 mt-4">Secure payment processed by PayPal</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Need Assistance?</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions or need help with your renewal, please contact your hosting provider:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong className="text-[#d4af37]">Provider:</strong> Salmin Abdalla</p>
                  <p><strong className="text-[#d4af37]">Support:</strong> Available via provider portal</p>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                <p>This is an automated renewal notice. Please do not reply to this page.</p>
                <p className="mt-2">© 2025 Website Services. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
