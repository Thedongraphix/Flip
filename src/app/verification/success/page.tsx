'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const VerificationSuccessPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-hero-background flex flex-col">
      <div className="py-8 px-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Image 
            src="/images/logos/flip logo.png" 
            alt="Flip Logo" 
            width={40} 
            height={40}
            className="w-8 h-8 object-contain"
            priority
          />
          <span className="space-grotesk text-lg font-semibold">Flip</span>
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center py-10">
        <SuccessContainer>
          <div className="success-icon">✓</div>
          <h1 className="text-2xl font-bold text-center mb-4">Verification Submitted</h1>
          <p className="text-center mb-8">
            Thank you for submitting your verification details. We're currently reviewing your information. 
            This process typically takes 24-48 hours. You'll receive an email once your verification is complete.
          </p>
          
          <button 
            onClick={() => router.push('/dashboard')} 
            className="success-button"
          >
            Go to Dashboard
          </button>
        </SuccessContainer>
      </div>
    </div>
  );
};

const SuccessContainer = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  .success-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #4CAF50;
    color: white;
    font-size: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
  }
  
  .success-button {
    background-color: #FBCA1F;
    color: black;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .success-button:hover {
    background-color: #eabc18;
    transform: translateY(-1px);
  }
`;

export default VerificationSuccessPage;