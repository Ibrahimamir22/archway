import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  showCloseButton?: boolean;
  rtl?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  centered = true,
  className = '',
  titleClassName = '',
  bodyClassName = '',
  showCloseButton = true,
  rtl = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  const alignmentClass = centered ? 'items-center' : 'items-start pt-24';

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50 overflow-y-auto animate-fade-in">
      <div className={`flex min-h-full w-full ${alignmentClass} p-4`}>
        <div 
          ref={modalRef} 
          className={`relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl animate-slide-up ${className}`}
          dir={rtl ? 'rtl' : 'ltr'}
        >
          {showCloseButton && (
            <button 
              onClick={onClose}
              className={`absolute top-3 ${rtl ? 'left-3' : 'right-3'} text-gray-400 hover:text-gray-600 focus:outline-none`}
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {title && (
            <div className={`px-6 py-4 border-b border-gray-200 ${rtl ? 'text-right' : 'text-left'} ${titleClassName}`}>
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            </div>
          )}
          
          <div className={`p-6 ${rtl ? 'text-right' : 'text-left'} ${bodyClassName}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal; 