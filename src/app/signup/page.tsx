'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FormContainer, 
  AccountTypeSelector, 
  PasswordInput, 
  PhoneInput, 
  CountryDropdown 
} from './components';
import { countryCodes, referralSources } from './data';
import './global.css';

export default function SignupPage() {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryList, setShowCountryList] = useState(false);
  const [accountType, setAccountType] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number, left: number, width: number } | undefined>(undefined);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const handleCountrySelect = (country: typeof countryCodes[number]) => {
    setSelectedCountry(country);
    setShowCountryList(false);
  };

  const toggleCountryList = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!showCountryList && countryDropdownRef.current) {
      const countryCodeElement = e.currentTarget;
      const countryCodeRect = countryCodeElement.getBoundingClientRect();

      if (isMobile) {
        // For mobile, we'll position it in the middle of the screen
        setDropdownPosition({
          top: 0, // This will be ignored on mobile as we use CSS to center
          left: 0, // This will be ignored on mobile
          width: 300 // Width will be controlled by CSS on mobile
        });
      } else {
        // For desktop, position below the country code selector
        setDropdownPosition({
          top: countryCodeRect.height + 4,
          left: 0,
          width: 300
        });
      }
    }
    
    setShowCountryList(!showCountryList);
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

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [countryDropdownRef]);

  // Handle window resize to detect mobile devices
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && showCountryList) {
        // Reset position for mobile
        setDropdownPosition({
          top: 0,
          left: 0,
          width: 300
        });
      } else if (countryDropdownRef.current && showCountryList) {
        // Update position for desktop
        const rect = countryDropdownRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.height + 4,
          left: 0,
          width: 300
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showCountryList]);

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
        <FormContainer>
          {/* Left side - Form */}
          <div className="form-side">
            <h1 className="form-title">Get Started with Flip</h1>
            <p className="form-subtitle">Start your financial journey today</p>
            
            <form className="signup-form" onClick={(e) => e.stopPropagation()}>
              <AccountTypeSelector 
                accountType={accountType}
                onChange={handleAccountTypeChange}
              />
              
              <p className="section-label">My details are</p>
              
              <div className="name-fields">
                <div className="field-group">
                  <label>Legal first name *</label>
                  <input type="text" placeholder="First name" className="name-input" />
                </div>
                
                <div className="field-group">
                  <label>Legal last name *</label>
                  <input type="text" placeholder="Last name" className="name-input" />
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
              
              <div ref={countryDropdownRef}>
                <PhoneInput 
                  selectedCountry={selectedCountry}
                  toggleCountryList={toggleCountryList}
                  showCountryList={showCountryList}
                />
                
                <CountryDropdown 
                  selectedCountry={selectedCountry}
                  onSelect={handleCountrySelect}
                  showDropdown={showCountryList}
                  onClose={() => setShowCountryList(false)}
                  dropdownPosition={dropdownPosition}
                />
              </div>
              
              <PasswordInput 
                label="Password *"
                placeholder="Create a strong password"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              
              <PasswordInput 
                label="Password Confirmation *"
                placeholder="Confirm your password"
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />
              
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
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                <label htmlFor="terms">
                  I agree to Flip &apos;s <Link href="/terms" className="terms-link">Terms and Conditions</Link> and <Link href="/privacy" className="terms-link">Privacy Policy</Link>
                </label>
              </div>
              
              <button 
                className="submit-button"
                disabled={!termsAccepted}
                style={{ opacity: termsAccepted ? 1 : 0.7, cursor: termsAccepted ? 'pointer' : 'not-allowed' }}
              >
                Get Started today
              </button>
              
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