'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function VerificationFlow() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const startVerification = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate a unique ID for this verification attempt
      const userId = "user-" + Date.now() + "-" + Math.random().toString(36).substring(2, 10);
      
      const userData = {
        userId: userId,
        userInfo: {
          firstName: "John", // Replace with actual user data
          lastName: "Doe",
          email: "test@example.com",
          phone: "+1234567890",
          accountType: "personal"
        },
        levelName: "id-and-liveness"
      };
      
      // Create or get applicant in SumSub
      const response = await fetch('/api/sumsub/applicant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create applicant');
      }
      
      // Get the applicant ID
      const applicantId = data.applicant.id;
      
      // Get access token for the SumSub SDK
      const tokenResponse = await fetch('/api/sumsub/access-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          applicantId,
          levelName: "id-and-liveness"
        })
      });
      
      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        throw new Error(tokenData.error || 'Failed to get access token');
      }

      // Store the token and applicant ID
      localStorage.setItem('sumsubToken', tokenData.token);
      localStorage.setItem('sumsubApplicantId', applicantId);
      
      // Redirect to verification page
      router.push(`/verification?applicantId=${applicantId}`);
      
    } catch (err: any) {
      console.error('Error starting verification:', err);
      setError(err.message || 'Failed to start verification process');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Identity Verification Required</h2>
        <p className="text-gray-600">To ensure the security of your account, we need to verify your identity.</p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">Government ID</h3>
            <p className="text-gray-600">Upload a valid government-issued ID (passport, driver's license, or national ID)</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">Selfie Verification</h3>
            <p className="text-gray-600">Take a selfie to match with your ID document</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">Liveness Check</h3>
            <p className="text-gray-600">Complete a quick liveness check to verify you're a real person</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={startVerification}
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
            Starting Verification...
          </div>
        ) : (
          'Start Verification'
        )}
      </button>

      <p className="text-sm text-gray-500 text-center mt-4">
        Your information is encrypted and secure. We never share your data with third parties.
      </p>
    </motion.div>
  );
} 