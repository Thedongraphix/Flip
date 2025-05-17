'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SumsubWebSdk from '@sumsub/websdk-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import VerificationFlow from '@/components/verification/VerificationFlow';
import { supabase } from '@/utils/supabase';

export default function VerificationPage() {
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'processing' | 'complete'>('pending');
  const [showVerificationFlow, setShowVerificationFlow] = useState(true);
  const [user, setUser] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const applicantId = searchParams.get('applicantId');

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        console.error('Error fetching user:', error);
        router.push('/login');
        return;
      }
      
      setUser(data.user);
      
      if (!applicantId) {
        setIsLoading(false);
        return;
      }
      
      await getAccessToken();
    }
    
    getUser();
  }, [applicantId, router]);

  const getAccessToken = async () => {
    if (!applicantId) {
      setError('No applicant ID provided');
      setIsLoading(false);
      return;
    }

    try {
      // Get the session for auth token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch('/api/sumsub/access-token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          applicantId, 
          levelName: 'id-and-liveness' 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get access token');
      }

      setAccessToken(data.token);
      setShowVerificationFlow(false);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error getting access token:', err);
      setError(err.message || 'Failed to initialize verification');
      setIsLoading(false);
    }
  };

  // Function to get a new token when the current one expires
  const accessTokenExpirationHandler = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      const response = await fetch('/api/sumsub/access-token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          applicantId, 
          levelName: 'id-and-liveness' 
        })
      });

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  };

  // SDK configuration options
  const config = {
    lang: 'en',
    theme: 'light',
    uiConf: {
      customCssStr: `
        .sumsub-websdk-container {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
      `
    }
  };

  // SDK initialization options
  const options = {
    addViewportTag: true,
    adaptIframeHeight: true
  };

  // Event handlers
  const messageHandler = (type: string, payload: any) => {
    console.log('WebSDK Message:', type, payload);
    
    // Handle specific events
    if (type === 'idCheck.applicantStatus') {
      setVerificationStatus('processing');
      console.log('Applicant status updated:', payload);
    }
    
    // When verification is complete
    if (type === 'idCheck.onComplete') {
      setVerificationStatus('complete');
      console.log('Verification completed!');
      
      // Update the user profile with kyc_status=pending
      updateUserKycStatus();
      
      // Redirect to success page
      setTimeout(() => {
        router.push('/verification/success');
      }, 2000);
    }
  };
  
  const updateUserKycStatus = async () => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          kyc_status: 'pending',
          kyc_last_updated: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating profile KYC status:', error);
      }
    } catch (err) {
      console.error('Failed to update KYC status:', err);
    }
  };

  const errorHandler = (error: any) => {
    console.error('WebSDK Error:', error);
    setError('An error occurred during verification. Please try again.');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#001F3F] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Initializing verification...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full mx-4"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Verification Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-[#001F3F] hover:bg-[#00295B] text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show verification flow if no applicant ID
  if (showVerificationFlow) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image 
                src="/images/logos/flip logo.png" 
                alt="Flip Logo" 
                width={64} 
                height={64}
                className="mx-auto h-16 w-16"
              />
            </Link>
          </div>
          <VerificationFlow 
            allowSkip={true} 
            onComplete={() => router.push('/dashboard')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image 
              src="/images/logos/flip logo.png" 
              alt="Flip Logo" 
              width={64} 
              height={64}
              className="mx-auto h-16 w-16"
            />
          </Link>
        </div>
      
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Identity Verification</h1>
            <p className="text-gray-600 mt-2">Please complete the verification process to continue</p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  verificationStatus === 'pending' ? 'bg-[#001F3F]' : 'bg-green-500'
                }`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Verification Started</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  verificationStatus === 'processing' ? 'bg-[#001F3F]' : verificationStatus === 'complete' ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  {verificationStatus === 'processing' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : verificationStatus === 'complete' ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : null}
                </div>
                <span className="text-sm font-medium text-gray-700">Processing</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  verificationStatus === 'complete' ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  {verificationStatus === 'complete' && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">Complete</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4" style={{ height: '600px' }}>
              {accessToken ? (
                <SumsubWebSdk
                  accessToken={accessToken}
                  expirationHandler={accessTokenExpirationHandler}
                  config={config}
                  options={options}
                  onMessage={messageHandler}
                  onError={errorHandler}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#001F3F]"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}