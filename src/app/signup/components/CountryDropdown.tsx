import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 100;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(2px);
`;

const CountryList = styled.div`
  position: absolute;
  left: 0;
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  z-index: 100;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #bbb;
  }
  
  @media (max-width: 480px) {
    width: 90vw;
    max-width: 280px;
    max-height: 60vh;
    position: fixed;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%);
    margin-top: 0;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 360px) {
    width: 95vw;
    max-width: 250px;
  }
`;

const SearchContainer = styled.div`
  position: sticky;
  top: 0;
  padding: 0.5rem;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  z-index: 2;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.2s;
    
    &:focus {
      border-color: #FBCA1F;
      box-shadow: 0 0 0 3px rgba(251, 202, 31, 0.1);
    }
    
    @media (max-width: 480px) {
      padding: 0.75rem;
      font-size: 0.85rem;
      border-radius: 10px;
    }
  }
`;

const CountryOption = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  &.selected {
    background-color: #f5f5f5;
    font-weight: 500;
  }

  .country-flag {
    font-size: 1.5rem;
    margin-right: 0.75rem;
    
    @media (max-width: 480px) {
      font-size: 1.25rem;
      margin-right: 0.5rem;
    }
  }
  
  .country-name {
    flex: 1;
    font-size: 0.9rem;
    
    @media (max-width: 480px) {
      font-size: 0.85rem;
    }
  }
  
  .country-dial {
    color: #666;
    font-size: 0.85rem;
    font-weight: 500;
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const NoResults = styled.div`
  padding: 1.5rem 1rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
`;

export const countryCodes = [
  { name: "Nigeria", dial_code: "+234", code: "NG", flag: "🇳🇬" },
  { name: "South Africa", dial_code: "+27", code: "ZA", flag: "🇿🇦" },
  { name: "Ghana", dial_code: "+233", code: "GH", flag: "🇬🇭" },
  { name: "Kenya", dial_code: "+254", code: "KE", flag: "🇰🇪" },
  { name: "Egypt", dial_code: "+20", code: "EG", flag: "🇪🇬" },
  { name: "Morocco", dial_code: "+212", code: "MA", flag: "🇲🇦" },
  { name: "Tanzania", dial_code: "+255", code: "TZ", flag: "🇹🇿" },
  { name: "Ethiopia", dial_code: "+251", code: "ET", flag: "🇪🇹" },
  { name: "Uganda", dial_code: "+256", code: "UG", flag: "🇺🇬" },
  { name: "Algeria", dial_code: "+213", code: "DZ", flag: "🇩🇿" },
  { name: "Cameroon", dial_code: "+237", code: "CM", flag: "🇨🇲" },
  { name: "Côte d'Ivoire", dial_code: "+225", code: "CI", flag: "🇨🇮" },
  { name: "Senegal", dial_code: "+221", code: "SN", flag: "🇸🇳" },
  { name: "Rwanda", dial_code: "+250", code: "RW", flag: "🇷🇼" },
  { name: "Tunisia", dial_code: "+216", code: "TN", flag: "🇹🇳" },
  { name: "Mali", dial_code: "+223", code: "ML", flag: "🇲🇱" },
  { name: "Zambia", dial_code: "+260", code: "ZM", flag: "🇿🇲" },
  { name: "Zimbabwe", dial_code: "+263", code: "ZW", flag: "🇿🇼" },
  { name: "Angola", dial_code: "+244", code: "AO", flag: "🇦🇴" },
  { name: "Malawi", dial_code: "+265", code: "MW", flag: "🇲🇼" },
  { name: "Namibia", dial_code: "+264", code: "NA", flag: "🇳🇦" },
  { name: "Botswana", dial_code: "+267", code: "BW", flag: "🇧🇼" },
  { name: "Mozambique", dial_code: "+258", code: "MZ", flag: "🇲🇿" },
  { name: "Libya", dial_code: "+218", code: "LY", flag: "🇱🇾" },
  { name: "Mauritius", dial_code: "+230", code: "MU", flag: "🇲🇺" }
];

interface CountryDropdownProps {
  selectedCountry: typeof countryCodes[number];
  onSelect: (country: typeof countryCodes[number]) => void;
  showDropdown: boolean;
  onClose: () => void;
  dropdownPosition?: { top: number; left: number; width: number };
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  selectedCountry,
  onSelect,
  showDropdown,
  onClose,
  dropdownPosition
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
  
  useEffect(() => {
    if (showDropdown && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
    
    // Lock body scroll when dropdown is open on mobile
    if (isMobile && showDropdown) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [showDropdown, isMobile]);
  
  useEffect(() => {
    if (!showDropdown) {
      setSearchQuery('');
    }
  }, [showDropdown]);
  
  const filteredCountries = countryCodes.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    country.dial_code.includes(searchQuery)
  );
  
  const handleSelect = (country: typeof countryCodes[number]) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(country);
  };
  
  if (!showDropdown) return null;

  // Calculate appropriate position for desktop
  let dropdownStyles = {};
  if (isMobile) {
    // Mobile-centered positioning is handled by CSS
    dropdownStyles = {};
  } else if (dropdownPosition) {
    // Desktop positioning
    dropdownStyles = {
      top: `${dropdownPosition.top}px`,
      left: `${dropdownPosition.left}px`,
      width: `${dropdownPosition.width}px`
    };
  }
  
  return (
    <>
      <Overlay onClick={onClose} />
      <DropdownContainer>
        <CountryList style={dropdownStyles}>
          <SearchContainer>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country..."
              onClick={(e) => e.stopPropagation()}
            />
          </SearchContainer>
          
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <CountryOption
                key={country.code}
                className={selectedCountry.code === country.code ? 'selected' : ''}
                onClick={handleSelect(country)}
              >
                <span className="country-flag">{country.flag}</span>
                <span className="country-name">{country.name}</span>
                <span className="country-dial">{country.dial_code}</span>
              </CountryOption>
            ))
          ) : (
            <NoResults>No countries found</NoResults>
          )}
        </CountryList>
      </DropdownContainer>
    </>
  );
};

export default CountryDropdown; 