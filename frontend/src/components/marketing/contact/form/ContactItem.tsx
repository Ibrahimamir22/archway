'use client';

import React, { ReactNode } from 'react';
import { MdCheck, MdContentCopy } from 'react-icons/md';
import { motion } from 'framer-motion';

interface ContactItemProps {
  title: string;
  value: string;
  icon: ReactNode;
  isRtl: boolean;
  isCopied: boolean;
  onCopy: () => void;
  href?: string;
  isLtr?: boolean;
}

/**
 * Contact item component with icon, label and copy functionality
 */
const ContactItem = React.memo(({
  title,
  value,
  icon,
  isRtl,
  isCopied,
  onCopy,
  href,
  isLtr = false
}: ContactItemProps) => {
  if (!value) {
    return null;
  }

  return (
    <div 
      className={`flex items-start ${isRtl ? 'space-x-reverse space-x-4' : 'space-x-4'} group`}
      data-testid="contact-item"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center group-hover:bg-brand-blue/20 dark:group-hover:bg-brand-blue/30 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <p className="font-medium text-gray-900 dark:text-white">{title}</p>
          <motion.button
            type="button"
            aria-label={isCopied ? `${title} copied to clipboard` : `Copy ${title} to clipboard`}
            aria-pressed={isCopied}
            className="p-1.5 text-gray-500 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-accent rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-blue dark:focus:ring-brand-accent"
            onClick={onCopy}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isCopied ? (
              <MdCheck className="w-5 h-5 text-green-500" aria-hidden="true" />
            ) : (
              <MdContentCopy className="w-5 h-5" aria-hidden="true" />
            )}
            <span className="sr-only">{isCopied ? 'Copied' : 'Copy to clipboard'}</span>
          </motion.button>
        </div>
        
        {href ? (
          <a 
            href={href} 
            className="text-brand-blue dark:text-brand-accent hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-brand-blue dark:focus:ring-brand-accent focus:ring-offset-1"
            dir={isLtr ? 'ltr' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            target={href.startsWith('http') ? '_blank' : undefined}
          >
            {value}
          </a>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 mb-2">{value}</p>
        )}
      </div>
    </div>
  );
});

ContactItem.displayName = 'ContactItem';

export default ContactItem; 