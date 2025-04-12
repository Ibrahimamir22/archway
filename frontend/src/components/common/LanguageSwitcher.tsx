import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
];

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const [isOpen, setIsOpen] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find current language
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Simple direct language change
  const handleLanguageChange = (langCode: string) => {
    if (langCode === locale) {
      setIsOpen(false);
      return; // No change needed
    }
    
    setIsChangingLanguage(true);
    // Change language with hard navigation for reliability
    const targetPath = `/${langCode}${asPath}`;
    window.location.href = targetPath;
  };

  // Show loading indicator if changing language
  if (isChangingLanguage) {
    return (
      <div className="relative">
        <div className="flex items-center">
          <span className="mx-1 font-medium opacity-50">{currentLanguage.code.toUpperCase()}</span>
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center hover:text-brand-blue focus:outline-none"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        <span className="mx-1 font-medium">{currentLanguage.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 ml-1 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 animate-fade-in">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  locale === language.code ? 'bg-gray-100 text-brand-blue' : 'text-gray-700'
                } hover:bg-gray-100 ${language.dir === 'rtl' ? 'text-right' : ''}`}
              >
                {language.nativeName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 