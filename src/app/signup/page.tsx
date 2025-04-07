'use client'
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';

// Country codes data
const countryCodes = [
  { code: 'NG', dial_code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'US', dial_code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dial_code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'GH', dial_code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: 'KE', dial_code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: 'ZA', dial_code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: 'EG', dial_code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: 'ET', dial_code: '+251', flag: '🇪🇹', name: 'Ethiopia' },
  { code: 'CD', dial_code: '+243', flag: '🇨🇩', name: 'DR Congo' },
  { code: 'TZ', dial_code: '+255', flag: '🇹🇿', name: 'Tanzania' },
  { code: 'MA', dial_code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: 'UG', dial_code: '+256', flag: '🇺🇬', name: 'Uganda' },
  { code: 'DZ', dial_code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: 'SD', dial_code: '+249', flag: '🇸🇩', name: 'Sudan' },
  { code: 'AO', dial_code: '+244', flag: '🇦🇴', name: 'Angola' },
  { code: 'MZ', dial_code: '+258', flag: '🇲🇿', name: 'Mozambique' },
  { code: 'CM', dial_code: '+237', flag: '🇨🇲', name: 'Cameroon' },
  { code: 'CI', dial_code: '+225', flag: '🇨🇮', name: 'Côte d\'Ivoire' },
  { code: 'SN', dial_code: '+221', flag: '🇸🇳', name: 'Senegal' },
  { code: 'ZW', dial_code: '+263', flag: '🇿🇼', name: 'Zimbabwe' },
];

// How did you find us options
const referralSources = [
  { value: '', label: 'Select an option' },
  { value: 'social', label: 'Social Media' },
  { value: 'search', label: 'Search Engine' },
  { value: 'friend', label: 'Friend Recommendation' },
  { value: 'ad', label: 'Advertisement' },
  { value: 'other', label: 'Other' }
];

export default function SignupPage() {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryList, setShowCountryList] = useState(false);
  const [accountType, setAccountType] = useState('personal');
  
  const countryDropdownRef = useRef(null);
  
  // Add this state for tracking dropdown position
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  
  // In your component, add a search state
  const [searchQuery, setSearchQuery] = useState('');

  // Add a function to filter countries
  const filteredCountries = searchQuery 
    ? countryCodes.filter(country => 
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        country.dial_code.includes(searchQuery)
      )
    : countryCodes;

  // Add these new states at the top of your component
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCountrySelect = (country: typeof countryCodes[number]) => {
    setSelectedCountry(country);
    setShowCountryList(false);
  };

  const toggleCountryList = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    // If we're opening the dropdown, calculate position
    if (!showCountryList) {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
    
    setShowCountryList(!showCountryList);
    console.log("Toggle dropdown:", !showCountryList); // Debug logging
  };

  const handleAccountTypeChange = (type: 'personal' | 'business') => {
    setAccountType(type);
  };

  // Close country dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !(countryDropdownRef.current as HTMLElement).contains(event.target as Node)) {
        setShowCountryList(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [countryDropdownRef]);

  return (
    <div className="min-h-screen bg-hero-background flex flex-col">
      <div className="py-8 px-6">
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
      
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <FormContainer className="form-with-image-container">
          {/* Left side - Form */}
          <div className="form-side">
            <h1 className="form-title">Get Started with Flip</h1>
            <p className="form-subtitle">Start your financial journey today</p>
            
            <form className="signup-form" onClick={(e) => e.stopPropagation()}>
              <div className="account-type">
                <p className="section-label">I want to sign up as the following type</p>
                <div className="type-options">
                  <label 
                    className={`type-option ${accountType === 'personal' ? 'active' : ''}`}
                    onClick={() => handleAccountTypeChange('personal')}
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
                    onClick={() => handleAccountTypeChange('business')}
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
              </div>
              
              <p className="section-label">My details are</p>
              
              <div className="name-fields">
                <div className="field-group">
                  <label>Legal first name *</label>
                  <input type="text" placeholder="First name" />
                </div>
                
                <div className="field-group">
                  <label>Legal last name *</label>
                  <input type="text" placeholder="Last name" />
                </div>
              </div>
              
              {accountType === 'business' && (
                <div className="field-group">
                  <label>Business Name *</label>
                  <input type="text" placeholder="Enter your business name" />
                </div>
              )}
              
              <div className="field-group">
                <label>Email *</label>
                <input type="email" placeholder="yourname@example.com" />
              </div>
              
              <div className="field-group">
                <label>Phone Number</label>
                <div className="phone-input">
                  <div 
                    className="country-code" 
                    onClick={toggleCountryList}
                  >
                    <span>{selectedCountry.flag} {selectedCountry.dial_code}</span>
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
              </div>
              
              {/* Portal the dropdown to body to avoid positioning issues */}
              {showCountryList && (
                <div 
                  className="country-list-overlay"
                  onClick={() => setShowCountryList(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999
                  }}
                >
                  <div 
                    className="country-list"
                    onClick={e => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: `${dropdownPosition.top}px`,
                      left: `${dropdownPosition.left}px`,
                      width: '270px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      backgroundColor: 'white',
                      border: '1.5px solid #e8e8e8',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      zIndex: 10000
                    }}
                  >
                    <div style={{ 
                      padding: '10px', 
                      position: 'sticky', 
                      top: 0, 
                      backgroundColor: 'white', 
                      borderBottom: '1px solid #eee',
                      zIndex: 1
                    }}>
                      <input
                        type="text"
                        placeholder="Search country..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          height: '36px',
                          padding: '0 10px',
                          border: '1.5px solid #e8e8e8',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          backgroundColor: '#fafafa',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <div
                          key={country.code}
                          className={`country-option ${selectedCountry.code === country.code ? 'selected' : ''}`}
                          onClick={() => handleCountrySelect(country)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.75rem 1rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            backgroundColor: selectedCountry.code === country.code ? 'rgba(251, 202, 31, 0.1)' : 'transparent'
                          }}
                        >
                          <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>{country.flag}</span>
                          <span style={{ flex: 1, textAlign: 'left', fontSize: '0.9rem' }}>{country.name}</span>
                          <span style={{ color: '#666', fontWeight: 500, fontSize: '0.85rem' }}>{country.dial_code}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                        No countries found
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="field-group">
                <label>Password *</label>
                <div className="password-input-container">
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password" 
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      padding: '0.25rem'
                    }}
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
              </div>
              
              <div className="field-group">
                <label>Password Confirmation *</label>
                <div className="password-input-container">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password" 
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      padding: '0.25rem'
                    }}
                  >
                    {showConfirmPassword ? (
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
              </div>
              
              <div className="field-group">
                <label>How did you find us?</label>
                <div className="select-wrapper">
                  <select>
                    {referralSources.map((source) => (
                      <option key={source.value} value={source.value}>
                        {source.label}
                      </option>
                    ))}
                  </select>
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
                    className="select-arrow"
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>
              </div>
              
              <div className="terms-privacy">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">
                  I agree to Flip &apos;s <Link href="/terms" className="terms-link">Terms and Conditions</Link> and <Link href="/privacy" className="terms-link">Privacy Policy</Link>
                </label>
              </div>
              
              <button className="submit-button">Get Started today</button>
              
              <p className="signin-link">
                Already have an account? <Link href="/login" className="login-link">Sign In</Link>
              </p>
            </form>
          </div>
          
          {/* Right side - Image */}
          <div className="image-side">
            <Image 
              src="/images/signup photo.jpg"
              alt="Sign up illustration"
              fill
              className="object-cover"
              priority
            />
            <div className="image-overlay">
              <h3 className="image-title">Financial Freedom Awaits</h3>
              <p className="image-subtitle">Join thousands of users who are already managing their finances with Flip</p>
            </div>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}

const FormContainer = styled.div`
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
  
  .account-type {
    margin-bottom: 0.5rem;
  }
  
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
  
  .country-list {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 250px;
    max-height: 200px;
    overflow-y: auto;
    background-color: white;
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    scrollbar-width: thin;
  }
  
  .country-list::-webkit-scrollbar {
    width: 6px;
  }
  
  .country-list::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
  }
  
  .country-option {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .country-option:hover {
    background-color: #f9f9f9;
  }
  
  .country-option.selected {
    background-color: rgba(251, 202, 31, 0.1);
  }
  
  .country-flag {
    margin-right: 8px;
    font-size: 1.2rem;
  }
  
  .country-name {
    flex: 1;
    text-align: left;
    font-size: 0.9rem;
  }
  
  .country-dial {
    color: #666;
    font-weight: 500;
    font-size: 0.85rem;
  }
  
  .phone-input input {
    border: none;
    border-radius: 0;
    flex: 1;
    height: 3rem;
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
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    max-height: none;
    margin: 1rem;
    
    .form-side {
      padding: 1.5rem;
      max-height: none;
    }
    
    .image-side {
      height: 200px;
    }
    
    .name-fields {
      grid-template-columns: 1fr;
    }
    
    .country-list {
      max-height: 160px;
    }
  }
`;