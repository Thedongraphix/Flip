'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VerificationFlow from '@/components/verification/VerificationFlow';
import { motion } from 'framer-motion';

export default function BusinessVerification() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Business Verification
          </h1>
          <p className="text-lg text-gray-600">
            Complete your business verification to access all features
          </p>
        </div>

        <VerificationFlow accountType="business" />
      </motion.div>
    </div>
  );
} 