import React from 'react';
import styled from 'styled-components';

const PasswordContainer = styled.div`
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

  .password-input-container {
    position: relative;
    width: 100%;
  }
  
  .password-input-container input {
    width: 100%;
    height: 3rem;
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
    padding: 0 1rem;
    font-size: 0.9rem;
    background-color: #fafafa;
    transition: all 0.2s;
    padding-right: 3rem; /* Make space for the eye icon */
  }
  
  .password-input-container input:focus {
    outline: none;
    border-color: #FBCA1F;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(251, 202, 31, 0.1);
  }
  
  .password-toggle {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    padding: 0.25rem;
    z-index: 1; /* Ensure the button stays above the input */
  }

  @media (max-width: 480px) {
    label {
      font-size: 0.8rem;
    }
    
    .password-input-container input {
      height: 2.75rem;
      font-size: 0.85rem;
      border-radius: 10px;
    }
  }

  @media (max-width: 360px) {
    .password-input-container input {
      height: 2.5rem;
      font-size: 0.8rem;
    }
  }
`;

interface PasswordInputProps {
  label: string;
  placeholder: string;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ 
  label, 
  placeholder, 
  showPassword, 
  setShowPassword 
}) => {
  return (
    <PasswordContainer className="field-group">
      <label>{label}</label>
      <div className="password-input-container">
        <input 
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z" fill="currentColor"/>
              <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 18C8.13 18 4.83 15.69 3.18 12.5C4.83 9.31 8.13 7 12 7C15.87 7 19.17 9.31 20.82 12.5C19.17 15.69 15.87 18 12 18Z" fill="currentColor"/>
              <path d="M2 2L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 18C8.13 18 4.83 15.69 3.18 12.5C4.83 9.31 8.13 7 12 7C15.87 7 19.17 9.31 20.82 12.5C19.17 15.69 15.87 18 12 18Z" fill="currentColor"/>
              <path d="M12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9ZM12 13C11.45 13 11 12.55 11 12C11 11.45 11.45 11 12 11C12.55 11 13 11.45 13 12C13 12.55 12.55 13 12 13Z" fill="currentColor"/>
            </svg>
          )}
        </button>
      </div>
    </PasswordContainer>
  );
};

export default PasswordInput; 