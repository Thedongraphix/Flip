'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

type VerificationFlowProps = {
  accountType?: 'individual' | 'business';
  onComplete?: () => void;
  allowSkip?: boolean;
};

export default function VerificationFlow({ 
  accountType = 'individual', 
  onComplete, 
  allowSkip = true 
}: VerificationFlowProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startingKyc, setStartingKyc] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const verificationSections = [
    {
      title: "Identity Verification",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
      description: "We need to verify your identity to comply with regulations and ensure platform security."
    },
    {
      title: "What You'll Need",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: "Before starting, please have the following ready:"
    },
    {
      title: "Data Protection",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      description: "Your data is encrypted and protected according to the highest security standards."
    }
  ];

  useEffect(() => {
    async function getUser() {
      setLoading(true);
      
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        console.error('Error fetching user:', error);
        router.push('/login');
        return;
      }
      
      setUser(data.user);
      setLoading(false);
    }
    
    getUser();
  }, [router]);

  const startVerification = async () => {
    setStartingKyc(true);
    setError(null);
    
    try {
      // Get the session for auth token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Call the API to start verification
      const response = await fetch('/api/kyc/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start verification');
      }
      
      // Redirect to verification page with applicant ID
      router.push(`/verification?applicantId=${data.applicantId}`);
      
    } catch (err: any) {
      console.error('Error starting verification:', err);
      setError(err.message || 'Could not start verification. Please try again.');
      setStartingKyc(false);
    }
  };

  const skipVerification = () => {
    if (onComplete) {
      onComplete();
    } else {
      router.push('/dashboard');
    }
  };

  // Auto advance sections every 5 seconds if not on last section
  useEffect(() => {
    if (activeSection < verificationSections.length - 1) {
      const timer = setTimeout(() => {
        setActiveSection(activeSection + 1);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [activeSection, verificationSections.length]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="relative h-16 w-16">
          <div className="animate-spin absolute top-0 left-0 h-16 w-16 rounded-full border-[3px] border-transparent border-t-[#001F3F] border-r-[#001F3F]"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-[3px] border-[#001F3F] opacity-20"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading verification...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header with progress indicators */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#001F3F] to-[#00407F]">
          <h2 className="text-2xl font-semibold text-white">
            {accountType === 'individual' ? 'Individual Verification' : 'Business Verification'}
          </h2>
          <p className="text-blue-100 mt-1">Secure your account with identity verification</p>
        </div>
        
        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - info sections */}
            <div className="md:w-1/2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-[#001F3F]/10 flex items-center justify-center text-[#001F3F]">
                        {verificationSections[activeSection].icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {verificationSections[activeSection].title}
                      </h3>
                      <p className="text-gray-600">
                        {verificationSections[activeSection].description}
                      </p>
                      
                      {activeSection === 1 && (
                        <ul className="mt-4 space-y-3">
                          <li className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-[#001F3F]/10 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#001F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-gray-700">A valid government-issued ID (passport, driver's license)</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-[#001F3F]/10 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#001F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-gray-700">Access to your device's camera for a selfie</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-[#001F3F]/10 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#001F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-gray-700">A stable internet connection (WiFi recommended)</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-[#001F3F]/10 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#001F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-gray-700">Approximately 5 minutes of your time</span>
                          </li>
                        </ul>
                      )}
                      
                      {activeSection === 2 && (
                        <ul className="mt-4 space-y-3">
                          <li className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-[#001F3F]/10 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#001F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <span className="text-gray-700">End-to-end encryption for all personal data</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-[#001F3F]/10 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#001F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <span className="text-gray-700">Compliance with GDPR and data protection regulations</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-[#001F3F]/10 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#001F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <span className="text-gray-700">Secure processing by our trusted KYC partner</span>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Progress dots */}
              <div className="flex justify-center space-x-2 mb-6">
                {verificationSections.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      activeSection === index ? 'bg-[#001F3F] w-8' : 'bg-gray-300'
                    }`}
                    onClick={() => setActiveSection(index)}
                  />
                ))}
              </div>
              
              {/* Action buttons */}
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startVerification}
                    disabled={startingKyc}
                    className="flex-1 py-3 px-6 rounded-lg bg-[#001F3F] text-white font-medium 
                              shadow-md hover:bg-[#00295B] transition-all duration-300 
                              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001F3F] 
                              disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {startingKyc ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Starting verification...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                        Start Verification
                      </div>
                    )}
                  </motion.button>
                  
                  {allowSkip && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={skipVerification}
                      className="flex-1 py-3 px-6 rounded-lg border border-gray-300 text-gray-700 font-medium 
                                bg-white hover:bg-gray-50 transition-all duration-300 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Skip for now
                    </motion.button>
                  )}
                </div>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 bg-red-50 p-4 rounded-lg"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Right side - illustration/animation */}
            <div className="md:w-1/2 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full max-w-sm"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/80 to-[#00407F]/80 rounded-2xl transform rotate-3"></div>
                  <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-8">
                      <div className="w-16 h-2.5 bg-gray-200 rounded-full"></div>
                      <div className="w-6 h-6 bg-[#001F3F]/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#001F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mb-6">
                      <div className="w-28 h-28 rounded-full bg-[#001F3F]/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#001F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="w-full h-3 bg-gray-100 rounded-full"></div>
                      <div className="w-3/4 h-3 bg-gray-100 rounded-full"></div>
                      <div className="w-5/6 h-3 bg-gray-100 rounded-full"></div>
                    </div>
                    
                    <div className="h-10 bg-[#001F3F] rounded-lg text-white flex items-center justify-center font-medium">
                      Verify Identity
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    <span className="text-[#001F3F] font-medium">93%</span> of our users complete verification in less than 5 minutes
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}