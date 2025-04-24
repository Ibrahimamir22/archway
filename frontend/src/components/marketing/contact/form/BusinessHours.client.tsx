'use client';

import React from 'react';
import { MdAccessTime, MdCheck, MdContentCopy } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useClipboard } from '@/lib/hooks/marketing/contact';

interface BusinessHoursClientProps {
  title: string;
  hours: string;
  isRtl: boolean;
  isCopied: boolean;
  onCopy: () => void;
}

/**
 * Client component for business hours with copy functionality
 */
const BusinessHoursClient = React.memo(({
  title,
  hours,
  isRtl,
  isCopied,
  onCopy
}: BusinessHoursClientProps) => {
  if (!hours) {
    return null;
  }

  return (
    <div 
      className={`flex items-start ${isRtl ? 'space-x-reverse space-x-4' : 'space-x-4'} group`}
      data-testid="business-hours"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center group-hover:bg-brand-blue/20 dark:group-hover:bg-brand-blue/30 transition-colors">
        <MdAccessTime className="w-6 h-6 text-brand-blue dark:text-brand-accent" aria-hidden="true" />
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
        <div 
          className="text-gray-600 dark:text-gray-300 whitespace-pre-line prose-sm"
          dangerouslySetInnerHTML={{ __html: hours.replace(/\n/g, '<br />') }}
          aria-label="Business hours"
        />
      </div>
    </div>
  );
});

BusinessHoursClient.displayName = 'BusinessHoursClient';

export default BusinessHoursClient; 