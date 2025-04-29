import React from 'react';
import TestVerification from '@/components/TestVerification';

export default function TestVerificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Verification Testing Portal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Use this secure environment to test the KYC verification flow before implementing in production.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-800">Identity Verification Test</h2>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-4">
                This test will simulate the complete KYC verification process. Your test data will be securely processed
                through our verification provider.
              </p>
            </div>
            
            <TestVerification />
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>For testing purposes only. No real personal data will be stored.</p>
        </div>
      </div>
    </div>
  );
} 