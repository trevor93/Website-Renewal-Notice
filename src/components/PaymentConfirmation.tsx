
import React from 'react';

const PaymentConfirmation: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <svg 
          className="w-20 h-20 mx-auto text-green-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mt-3">
          Thank you for your renewal. We've received your payment and are processing the reactivation of your website.
        </p>
        <p className="text-gray-600 mt-2">
          You will receive an email confirmation shortly.
        </p>
        <div className="mt-8">
          <a 
            href="/" 
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
