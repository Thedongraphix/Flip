'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';

export default function ForgotPasswordPage() {
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
        <div className="w-full max-w-md px-4">
          <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
          <StyledWrapper>
            <form className="form">
              <p className="p mb-6">Enter your email address and we&apos;ll send you a link to reset your password.</p>
              
              <div className="flex-column">
                <label>Email</label>
              </div>
              <div className="inputForm">
                <svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="0 0 32 32" height={20}>
                  <g data-name="Layer 3" id="Layer_3">
                    <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                  </g>
                </svg>
                <input placeholder="Enter your Email" className="input" type="text" />
              </div>

              <button className="button-submit">Send Reset Link</button>
              
              <p className="p mt-4">
                <Link href="/login" className="span">
                  Back to Login
                </Link>
              </p>
            </form>
          </StyledWrapper>
        </div>
      </div>
    </div>
  );
}

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 25px;
    width: 100%;
    max-width: 420px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
  }

  ::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .flex-column > label {
    color: #151717;
    font-weight: 600;
    font-size: 14px;
  }

  .inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 46px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 100%;
    height: 100%;
    font-size: 14px;
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #FBCA1F;
  }

  .p {
    text-align: center;
    color: black;
    font-size: 13px;
    margin: 5px 0;
  }

  .span {
    font-size: 13px;
    margin-left: 5px;
    color: #FBCA1F;
    font-weight: 500;
    cursor: pointer;
  }

  .button-submit {
    margin: 15px 0 10px 0;
    background-color: #FBCA1F;
    border: none;
    color: black;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 46px;
    width: 100%;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .button-submit:hover {
    background-color: #eabc18;
  }
  
  @media (max-width: 480px) {
    .form {
      padding: 20px;
      width: 92%;
      max-width: 380px;
    }
    
    .button-submit {
      height: 44px;
    }

    .inputForm {
      height: 44px;
    }
  }
`; 