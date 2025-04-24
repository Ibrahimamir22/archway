'use client';

/**
 * Privacy note component displayed below the contact form
 */
const PrivacyNote = ({ text }: { text: string }) => {
  return (
    <p className="text-xs text-center text-gray-400 mt-4">
      {text}
    </p>
  );
}; 

export default PrivacyNote; 