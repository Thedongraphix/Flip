'use client';

import React from 'react';
import styled from 'styled-components';

interface VerificationStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'none';
}

const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({ status }) => {
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Verification Pending';
      case 'approved':
        return 'Verified';
      case 'rejected':
        return 'Verification Failed';
      case 'none':
      default:
        return 'Not Verified'; 
    }
  };

  return (
    <BadgeContainer status={status}>
      {getStatusText()}
    </BadgeContainer>
  );
};

const BadgeContainer = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return `
          background-color: #ebf8ff;
          color: #3182ce;
        `;
      case 'approved':
        return `
          background-color: #f0fff4;
          color: #38a169;
        `;
      case 'rejected':
        return `
          background-color: #fff5f5;
          color: #e53e3e;
        `;
      case 'none':
      default:
        return `
          background-color: #f7fafc;
          color: #718096;
        `;
    }
  }}
`;

export default VerificationStatusBadge;