// app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import VerificationFlow from '@/components/verification/VerificationFlow';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const [isVerified, setIsVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if verification was just completed
    const verificationComplete = searchParams.get('verification') === 'complete';
    if (verificationComplete) {
      setIsVerified(true);
      // Remove the query parameter from the URL
      window.history.replaceState({}, '', '/profile');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">John Doe</h2>
                  <p className="text-gray-600">john.doe@example.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {isVerified ? (
                  <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-700 font-medium">Verified</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowVerification(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Verify Identity
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="text-gray-800">John Doe</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="text-gray-800">john.doe@example.com</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="text-gray-800">+1 234 567 890</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Verification Status</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Identity Verification</label>
                    <div className="flex items-center space-x-2">
                      {isVerified ? (
                        <>
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-700">Verified</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-gray-600">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Last Updated</label>
                    <p className="text-gray-800">{isVerified ? 'Just now' : 'Never'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {showVerification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <VerificationFlow />
          </motion.div>
        )}
      </div>
    </div>
  );
}