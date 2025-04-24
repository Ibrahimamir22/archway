'use client';

import React from 'react';
import { motion } from 'framer-motion';
import FAQItem from './FAQItem';
import { FAQ } from '@/types/marketing/faq';

interface FAQCategoryClientProps {
  title: string;
  faqs: FAQ[];
  isRtl: boolean;
}

/**
 * Client component for FAQ category with animations and interactivity
 */
const FAQCategoryClient = React.memo(({ 
  title, 
  faqs, 
  isRtl 
}: FAQCategoryClientProps) => {
  // No FAQs to display
  if (!faqs.length) {
    return null;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="pb-10"
      initial="hidden"
      animate="show"
      variants={containerVariants}
      dir={isRtl ? 'rtl' : 'ltr'}
      data-testid="faq-category"
    >
      <h2 
        className={`text-2xl font-heading font-bold mb-6 text-brand-blue dark:text-brand-accent border-b border-gray-200 dark:border-gray-700 pb-3 ${
          isRtl ? 'text-right' : 'text-left'
        }`}
      >
        {title}
      </h2>
      <div className="space-y-6">
        {faqs.map((faq) => (
          <motion.div 
            key={faq.id} 
            variants={itemVariants} 
            className="transform-gpu"
          >
            <FAQItem 
              question={faq.question}
              answer={faq.answer}
              isRtl={isRtl}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

FAQCategoryClient.displayName = 'FAQCategoryClient';

export default FAQCategoryClient; 