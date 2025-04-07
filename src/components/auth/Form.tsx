// src/components/auth/Form.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

interface FormProps {
  isSignIn?: boolean;
}

const Form: React.FC<FormProps> = ({ isSignIn = true }) => {
  return (
    <StyledWrapper>
      <form className="form">
        {!isSignIn && (
          <>
            <div className="flex-column">
              <label>Full Name</label>
            </div>
            <div className="inputForm">
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input placeholder="Enter your full name" className="input" type="text" />
            </div>
          </>
        )}

        <div className="flex-column">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <input placeholder="Enter your email" className="input" type="email" />
        </div>

        <div className="flex-column">
          <label>Password</label>
        </div>
        <div className="inputForm">
          <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <input placeholder="Enter your password" className="input" type="password" />
        </div>

        {isSignIn && (
          <div className="flex-row">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link href="/forgot-password" className="span">Forgot password?</Link>
          </div>
        )}

        {!isSignIn && (
          <div className="terms-privacy">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              I agree to the <Link href="/terms" className="span">Terms of Service</Link> and <Link href="/privacy" className="span">Privacy Policy</Link>
            </label>
          </div>
        )}

        <button className="button-submit">{isSignIn ? 'Sign In' : 'Create Account'}</button>
        
        <p className="p">
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <Link href={isSignIn ? "/signup" : "/login"} className="span">
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
        
        <div className="divider">
          <span>Or continue with</span>
        </div>
        
        <div className="social-buttons">
          <button type="button" className="btn google">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4"/>
            </svg>
            <span>Google</span>
          </button>
          <button type="button" className="btn apple">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#000000" />
            </svg>
            <span>Apple</span>
          </button>
        </div>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    background-color: #ffffff;
    padding: 28px;
    width: 100%;
    max-width: 430px;
    border-radius: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    margin: 0 auto;
  }

  ::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #8a8a8a;
  }

  .flex-column > label {
    color: #333;
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 4px;
    display: block;
  }

  .inputForm {
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 14px;
    transition: 0.2s ease-in-out;
    background-color: #fafafa;
  }

  .inputForm svg {
    color: #8a8a8a;
  }

  .input {
    margin-left: 10px;
    border-radius: 12px;
    border: none;
    width: 100%;
    height: 100%;
    font-size: 15px;
    background-color: transparent;
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #FBCA1F;
    background-color: white;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 4px 0;
  }

  .remember-me {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .remember-me label, .terms-privacy label {
    font-size: 14px;
    color: #505050;
    font-weight: 400;
  }

  .terms-privacy {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin: 4px 0;
    font-size: 14px;
    color: #505050;
  }

  .terms-privacy input {
    margin-top: 3px;
  }

  .span {
    font-size: 14px;
    color: #FBCA1F;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
  }

  .span:hover {
    text-decoration: underline;
  }

  .button-submit {
    margin: 12px 0;
    background-color: #FBCA1F;
    border: none;
    color: #000;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    height: 50px;
    width: 100%;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .button-submit:hover {
    background-color: #eabc18;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }

  .p {
    text-align: center;
    color: #505050;
    font-size: 14px;
    margin: 10px 0;
  }

  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 15px 0;
  }

  .divider span {
    color: #8a8a8a;
    font-size: 14px;
    padding: 0 10px;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e8e8e8;
  }

  .social-buttons {
    display: flex;
    gap: 12px;
    width: 100%;
  }

  .btn {
    flex: 1;
    height: 50px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #e8e8e8;
    background-color: white;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    font-size: 15px;
    color: #333;
  }

  .btn:hover {
    background-color: #f7f7f7;
    border: 1px solid #d9d9d9;
  }

  @media (max-width: 480px) {
    .form {
      padding: 22px;
      width: 92%;
      max-width: 380px;
      gap: 12px;
    }

    .social-buttons {
      flex-direction: column;
    }

    .inputForm, .button-submit, .btn {
      height: 48px;
    }

    .button-submit {
      font-size: 15px;
    }
  }
`;

export default Form;