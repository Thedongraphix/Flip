import React from 'react';
import styled from 'styled-components';

const PhoneInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: relative;
  margin-bottom: 0.25rem;

  label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #444;
  }

  .phone-input {
    display: flex;
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
    overflow: hidden;
    background-color: #fafafa;
    position: relative;
    transition: all 0.2s;
  }
  
  .phone-input:focus-within {
    border-color: #FBCA1F;
    box-shadow: 0 0 0 3px rgba(251, 202, 31, 0.1);
    background-color: white;
  }
  
  .country-code {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1rem;
    background-color: #f3f3f3;
    border-right: 1px solid #e8e8e8;
    min-width: 7.5rem;
    height: 3rem;
    font-size: 0.9rem;
    cursor: pointer;
    user-select: none;
    z-index: 2;
    flex-shrink: 0;
    justify-content: space-between;
  }
  
  .country-code:hover {
    background-color: #ebebeb;
  }
  
  .chevron {
    transition: transform 0.2s;
  }
  
  .chevron.up {
    transform: rotate(180deg);
  }
  
  .country-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .phone-input input {
    border: none;
    border-radius: 0;
    flex: 1;
    width: 100%;
    height: 3rem;
    outline: none;
    background-color: #fafafa;
    font-size: 0.9rem;
    padding: 0 1rem;
  }
  
  .phone-input input:focus {
    background-color: white;
  }

  @media (max-width: 480px) {
    label {
      font-size: 0.8rem;
    }
    
    .phone-input,
    .country-code,
    .phone-input input {
      height: 2.75rem;
      font-size: 0.85rem;
    }
    
    .country-code {
      min-width: 6.5rem;
      padding: 0 0.75rem;
    }
  }

  @media (max-width: 360px) {
    .phone-input,
    .phone-input input {
      height: 2.5rem;
      font-size: 0.8rem;
    }
    
    .country-code {
      min-width: 6rem;
      padding: 0 0.5rem;
      font-size: 0.8rem;
    }
  }
`;

interface PhoneInputProps {
  selectedCountry: {
    flag: string;
    dial_code: string;
  };
  toggleCountryList: (e: React.MouseEvent<HTMLDivElement>) => void;
  showCountryList: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ 
  selectedCountry, 
  toggleCountryList,
  showCountryList
}) => {
  return (
    <PhoneInputContainer className="field-group">
      <label>Phone Number</label>
      <div className="phone-input">
        <div 
          className="country-code" 
          onClick={toggleCountryList}
        >
          <div className="country-selector">
            <span>{selectedCountry.flag}</span>
            <span>{selectedCountry.dial_code}</span>
          </div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`chevron ${showCountryList ? 'up' : ''}`}
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
        <input type="tel" placeholder="Phone number" />
      </div>
    </PhoneInputContainer>
  );
};

export default PhoneInput; 