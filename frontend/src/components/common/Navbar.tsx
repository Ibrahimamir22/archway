'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-[180px] h-[60px] hover:scale-105 transition-transform">
              <Image 
                src="/images/Archway.png" 
                alt="Archway Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="font-medium hover:text-brand-blue">
              Home
            </Link>
            <Link href="/portfolio" className="font-medium hover:text-brand-blue">
              Portfolio
            </Link>
            <Link href="/services" className="font-medium hover:text-brand-blue">
              Services
            </Link>
            <Link href="/about" className="font-medium hover:text-brand-blue">
              About
            </Link>
            <Link href="/contact" className="font-medium hover:text-brand-blue">
              Contact
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/contact" className="btn btn-primary">
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-4 animate-fade-in">
            <Link href="/" className="block font-medium hover:text-brand-blue py-2">
              Home
            </Link>
            <Link href="/portfolio" className="block font-medium hover:text-brand-blue py-2">
              Portfolio
            </Link>
            <Link href="/services" className="block font-medium hover:text-brand-blue py-2">
              Services
            </Link>
            <Link href="/about" className="block font-medium hover:text-brand-blue py-2">
              About
            </Link>
            <Link href="/contact" className="block font-medium hover:text-brand-blue py-2">
              Contact
            </Link>
            <Link href="/contact" className="btn btn-primary mt-4 block text-center">
              Get a Quote
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 