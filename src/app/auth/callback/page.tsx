'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { handleOAuthCallback, ensureUserProfile } from '@/utils/google-auth';
import { motion } from 'framer-motion';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Process the OAuth callback
        const session = await handleOAuthCallback();
        
        if (!session) {
          throw new Error('Authentication failed. Please try again.');
        }
        
        // Ensure user profile exists in our database
        const user = session.user;
        await ensureUserProfile(user.id, user.user_metadata);
        
        // Get user profile to check verification status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('kyc_status, account_type')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        // Redirect based on KYC status
        if (profile?.kyc_status === 'pending') {
          router.push('/verification');
        } else if (profile?.kyc_status === 'not_started' || !profile?.kyc_status) {
          router.push('/verification');
        } else {
          router.push('/dashboard');
        }
      } catch (err: any) {
        console.error('Error in auth callback:', err);
        setError(err.message || 'An error occurred during authentication');
        
        // Redirect to login page after a delay
        setTimeout(() => {
          router.push('/login');
        }, 5000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center"
      >
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-gray-500 text-sm">Redirecting to login page...</p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="relative h-16 w-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 h-16 w-16 rounded-full border-[3px] border-transparent border-t-[#001F3F] border-r-[#001F3F]"
                ></motion.div>
                <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-[3px] border-[#001F3F] opacity-20"></div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authenticating</h2>
            <p className="text-gray-600">Please wait while we complete your authentication...</p>
          </>
        )}
      </motion.div>
    </div>
  );
}