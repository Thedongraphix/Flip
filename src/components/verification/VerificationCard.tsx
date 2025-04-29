'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

interface VerificationCardProps {
  userId: string;
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    accountType?: 'personal' | 'business';
  };
  verificationStatus?: 'pending' | 'approved' | 'rejected' | 'none';
}

const VerificationCard: React.FC<VerificationCardProps> = ({
  userId,
  userInfo,
  verificationStatus = 'none'
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startVerification = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, create a SumSub applicant
      const createResponse = await fetch('/api/sumsub/applicant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userInfo
        }),
      });
      
      if (!createResponse.ok) {
        throw new Error('Failed to create applicant');
      }
      
      const { applicant } = await createResponse.json();
      
      // Redirect to the verification page with the applicant ID
      router.push(`/verification?applicantId=${applicant.id}`);
    } catch (err) {
      console.error('Error starting verification:', err);
      setError('Failed to start verification process. Please try again later.');
      setIsLoading(false);
    }
  };

  const renderStatusContent = () => {
    switch (verificationStatus) {
      case 'pending':
        return (
          <PendingStatus>
            <h3>Verification in Progress</h3>
            <p>We're currently reviewing your submitted documents. This typically takes 24-48 hours.</p>
          </PendingStatus>
        );
      case 'approved':
        return (
          <ApprovedStatus>
            <h3>Verification Complete</h3>
            <p>Your identity has been successfully verified. You now have full access to all features.</p>
          </ApprovedStatus>
        );
      case 'rejected':
        return (
          <RejectedStatus>
            <h3>Verification Failed</h3>
            <p>There was an issue with your verification. Please try again with valid documents.</p>
            <button onClick={startVerification} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Try Again'}
            </button>
          </RejectedStatus>
        );
      case 'none':
      default:
        return (
          <NoneStatus>
            <h3>Verify Your Identity</h3>
            <p>Complete identity verification to unlock all features of your account.</p>
            <button onClick={startVerification} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Start Verification'}
            </button>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </NoneStatus>
        );
    }
  };

  return (
    <VerificationCardContainer>
      <CardHeader>
        <VerificationIcon>
          {verificationStatus === 'approved' ? '✓' : '!'}
        </VerificationIcon>
        <CardTitle>Identity Verification</CardTitle>
      </CardHeader>
      <CardContent>
        {renderStatusContent()}
      </CardContent>
    </VerificationCardContainer>
  );
};

const VerificationCardContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const VerificationIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #FBCA1F;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const CardContent = styled.div`
  padding-left: 3rem;
`;

const StatusBase = styled.div`
  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
  
  button {
    background-color: #FBCA1F;
    color: black;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background-color: #eabc18;
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;

const NoneStatus = styled(StatusBase)``;

const PendingStatus = styled(StatusBase)`
  h3 {
    color: #3182ce;
  }
`;

const ApprovedStatus = styled(StatusBase)`
  h3 {
    color: #38a169;
  }
`;

const RejectedStatus = styled(StatusBase)`
  h3 {
    color: #e53e3e;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

export default VerificationCard;