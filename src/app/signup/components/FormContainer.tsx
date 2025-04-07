import React from 'react';
import styled from 'styled-components';

const StyledFormContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1000px;
  background-color: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin: 0 auto;
  
  .form-side {
    flex: 3;
    padding: 2.5rem;
    overflow-y: auto;
    max-height: 85vh;
  }
  
  .image-side {
    flex: 2;
    position: relative;
    min-height: 100%;
  }
  
  .image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2rem;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    color: white;
  }
  
  .image-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .image-subtitle {
    font-size: 0.9rem;
    opacity: 0.9;
  }
  
  .form-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .form-subtitle {
    color: #666;
    margin-bottom: 1.5rem;
  }
  
  .signup-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .section-label {
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: #555;
  }
  
  .name-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    position: relative;
    margin-bottom: 0.25rem;
  }
  
  .field-group label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #444;
  }
  
  .field-group input, .field-group select {
    height: 3rem;
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
    padding: 0 1rem;
    font-size: 0.9rem;
    background-color: #fafafa;
    transition: all 0.2s;
  }
  
  .field-group input:focus, .field-group select:focus {
    outline: none;
    border-color: #FBCA1F;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(251, 202, 31, 0.1);
  }
  
  .select-wrapper {
    position: relative;
  }
  
  .select-wrapper select {
    width: 100%;
    appearance: none;
    cursor: pointer;
  }
  
  .select-arrow {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
  
  .terms-privacy {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #555;
    margin-top: 0.5rem;
  }
  
  .terms-privacy input {
    accent-color: #FBCA1F;
    margin-top: 3px;
  }
  
  .terms-link {
    color: #FBCA1F;
    text-decoration: underline;
  }
  
  .submit-button {
    background-color: #FBCA1F;
    color: #333;
    font-weight: 600;
    padding: 0.9rem;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 0.5rem;
    box-shadow: 0 2px 10px rgba(251, 202, 31, 0.2);
  }
  
  .submit-button:hover {
    background-color: #eabc18;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(251, 202, 31, 0.3);
  }
  
  .submit-button:active {
    transform: translateY(0);
  }
  
  .signin-link {
    text-align: center;
    font-size: 0.85rem;
    color: #666;
    margin-top: 0.5rem;
  }
  
  .login-link {
    color: #FBCA1F;
    font-weight: 500;
  }
  
  /* Enhanced mobile responsiveness */
  @media (max-width: 1024px) {
    max-width: 90%;
  }
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    max-height: none;
    margin: 1rem;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    
    .form-side {
      padding: 1.5rem;
      max-height: none;
    }
    
    .image-side {
      height: 180px;
    }
    
    .name-fields {
      grid-template-columns: 1fr;
    }
    
    .submit-button {
      margin-top: 1rem;
      height: 3.25rem;
    }
  }
  
  /* Small mobile devices */
  @media (max-width: 480px) {
    margin: 0.75rem;
    border-radius: 15px;
    
    .form-side {
      padding: 1.25rem;
    }
    
    .form-title {
      font-size: 1.5rem;
    }
    
    .form-subtitle {
      font-size: 0.9rem;
      margin-bottom: 1.25rem;
    }
    
    .field-group {
      margin-bottom: 0.5rem;
    }
    
    .field-group label {
      font-size: 0.8rem;
    }
    
    .field-group input, 
    .field-group select {
      height: 2.5rem;
      font-size: 0.8rem;
      border-radius: 10px;
    }
    
    .image-side {
      height: 160px;
    }
    
    .image-overlay {
      padding: 1.25rem;
    }
    
    .image-title {
      font-size: 1.2rem;
    }
    
    .image-subtitle {
      font-size: 0.8rem;
    }
    
    .submit-button {
      height: 3rem;
      font-size: 0.95rem;
      border-radius: 10px;
    }
    
    .terms-privacy {
      font-size: 0.8rem;
    }
  }
  
  /* Extra small devices */
  @media (max-width: 360px) {
    margin: 0.5rem;
    
    .form-side {
      padding: 1rem;
    }
    
    .field-group input, 
    .field-group select {
      height: 2.25rem;
      font-size: 0.8rem;
    }
    
    .image-side {
      height: 140px;
    }
  }
`;

interface FormContainerProps {
  children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <StyledFormContainer>
      {children}
    </StyledFormContainer>
  );
};

export default FormContainer; 