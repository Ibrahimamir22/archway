'use client';

import { motion } from 'framer-motion';
import { SubmitStatus } from '@/types/marketing/contact';

interface StatusMessageProps {
  status: SubmitStatus;
}

/**
 * Displays form submission status messages with animations
 */
const StatusMessage = ({ status }: StatusMessageProps) => {
  if (!status.type) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`p-5 rounded-lg mb-6 ${
        status.type === 'success' 
          ? 'bg-green-900/20 text-green-300 border border-green-800/50' 
          : 'bg-red-900/20 text-red-300 border border-red-800/50'
      }`}
      role="alert"
      aria-live="polite"
    >
      {status.message}
    </motion.div>
  );
}; 

export default StatusMessage; 