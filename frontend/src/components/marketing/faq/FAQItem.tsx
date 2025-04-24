'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAdd, MdRemove } from 'react-icons/md';

interface FAQItemProps {
  question: string;
  answer: string;
  isRtl: boolean;
}

/**
 * Expandable FAQ item component with animations and content prefetching
 */
export default function FAQItem({ question, answer, isRtl }: FAQItemProps) {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [prefetched, setPrefetched] = useState(false);
  const answerContentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set client-side state to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleOpen = () => {
    if (isClient) {
      setIsOpen(!isOpen);
    }
  };

  // Prefetch and prepare answer content on hover
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    if (isHovering && !prefetched) {
      try {
        timeoutRef.current = setTimeout(() => {
          // Pre-render the answer in the DOM but keep it hidden
          // This loads any images or complex markup in the answer
          if (answerContentRef.current) {
            // Set HTML content during prefetch phase
            answerContentRef.current.innerHTML = answer;
            setPrefetched(true);
          }
        }, 100);
      } catch (error) {
        console.error("Error prefetching FAQ content:", error);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovering, prefetched, answer, isClient]);

  // To prevent hydration mismatch, render a simplified version on server
  if (!isClient) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="w-full flex items-center justify-between p-4 md:p-6 text-left bg-white">
          <h3 className={`flex-1 font-medium text-lg ${isRtl ? 'text-right' : 'text-left'}`}>{question}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        className={`w-full flex items-center justify-between p-4 md:p-6 text-left bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group ${
          isOpen ? 'border-b border-gray-200 dark:border-gray-700' : ''
        }`}
        onClick={toggleOpen}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-expanded={isOpen}
      >
        <h3 className={`flex-1 font-medium text-lg text-gray-900 dark:text-white ${isRtl ? 'text-right' : 'text-left'}`}>
          {question}
        </h3>
        <div className="flex-shrink-0 ml-4 rtl:mr-4 rtl:ml-0">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
            {isOpen ? <MdRemove className="text-gray-600 dark:text-gray-300" /> : <MdAdd className="text-gray-600 dark:text-gray-300" />}
          </span>
        </div>
      </button>
      
      {/* Hidden container for prefetching content */}
      {!isOpen && prefetched && (
        <div className="hidden" ref={answerContentRef} />
      )}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div 
              className="p-4 md:p-6 pt-3 md:pt-4 bg-white dark:bg-gray-800 prose prose-sm md:prose-base max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 