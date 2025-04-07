import React from 'react';
import styled from 'styled-components';

const TypeSelectorContainer = styled.div`
  margin-bottom: 0.5rem;

  .type-options {
    display: flex;
    gap: 0.75rem;
  }
  
  .type-option {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    background: #fafafa;
  }
  
  .type-option:hover {
    border-color: #FBCA1F;
    background: white;
  }
  
  .type-option.active {
    border-color: #FBCA1F;
    background: white;
    box-shadow: 0 2px 8px rgba(251, 202, 31, 0.15);
  }
  
  .type-option input {
    accent-color: #FBCA1F;
    width: 16px;
    height: 16px;
  }
  
  .option-label {
    font-weight: 500;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    .type-option {
      padding: 0.6rem 0.5rem;
    }
    
    .option-label {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 360px) {
    .type-options {
      gap: 0.5rem;
    }
    
    .type-option {
      padding: 0.5rem;
    }
  }
`;

interface AccountTypeSelectorProps {
  accountType: string;
  onChange: (type: 'personal' | 'business') => void;
}

const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({ accountType, onChange }) => {
  return (
    <TypeSelectorContainer className="account-type">
      <p className="section-label">I want to sign up as the following type</p>
      <div className="type-options">
        <label 
          className={`type-option ${accountType === 'personal' ? 'active' : ''}`}
          onClick={() => onChange('personal')}
        >
          <input 
            type="radio" 
            name="accountType" 
            checked={accountType === 'personal'} 
            onChange={() => {}}
          />
          <span className="option-label">Personal</span>
        </label>
        <label 
          className={`type-option ${accountType === 'business' ? 'active' : ''}`}
          onClick={() => onChange('business')}
        >
          <input 
            type="radio" 
            name="accountType" 
            checked={accountType === 'business'} 
            onChange={() => {}}
          />
          <span className="option-label">Business</span>
        </label>
      </div>
    </TypeSelectorContainer>
  );
};

export default AccountTypeSelector; 