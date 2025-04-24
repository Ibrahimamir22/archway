import React from 'react';

const Pattern: React.FC = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.4"
          />
        </pattern>
        <pattern
          id="dots-pattern"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      <rect width="100%" height="100%" fill="url(#dots-pattern)" />
    </svg>
  );
};

export { Pattern };
export default Pattern; 