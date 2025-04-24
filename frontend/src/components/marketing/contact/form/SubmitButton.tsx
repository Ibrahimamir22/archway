'use client';

import { motion } from 'framer-motion';
import { MdSend } from 'react-icons/md';

interface SubmitButtonProps {
  isSubmitting: boolean;
  isPending: boolean;
  isRtl?: boolean;
  sendText: string;
  sendingText: string;
}

/**
 * Animated submit button with loading state
 */
const SubmitButton = ({
  isSubmitting,
  isPending,
  isRtl = false,
  sendText,
  sendingText,
}: SubmitButtonProps) => {
  return (
    <motion.button
      type="submit"
      disabled={isSubmitting || isPending}
      whileHover={{ scale: 1.02, backgroundColor: '#d97706' }} // Amber-600 hover color
      whileTap={{ scale: 0.98 }}
      className="w-full px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-800
               disabled:opacity-50 disabled:cursor-not-allowed transition-colors
               flex items-center justify-center"
      aria-busy={isSubmitting || isPending ? 'true' : 'false'}
    >
      <span className={isRtl && !isSubmitting ? 'ml-2' : 'mr-2'}>
        {isSubmitting || isPending ? sendingText : sendText}
      </span>
      {!isSubmitting && !isPending && (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 3, repeatType: "reverse", repeatDelay: 5 }}
        >
          <MdSend className="w-5 h-5" aria-hidden="true" />
        </motion.div>
      )}
      {(isSubmitting || isPending) && (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
    </motion.button>
  );
}; 

export default SubmitButton; 