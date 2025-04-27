import React from 'react';
import Image from 'next/image';
import { ClientLogo } from '@/types/marketing';

interface ClientLogoCardProps {
  logo: ClientLogo;
  className?: string;
}

const ClientLogoCard: React.FC<ClientLogoCardProps> = ({ 
  logo, 
  className = '' 
}) => {
  // Get the correct image URL (handle both logo and logo_url properties)
  const imageUrl = logo.logo_url || logo.logo || '/images/clients/placeholder.jpg';
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow ${className}`}>
      {logo.url ? (
        <a 
          href={logo.url} 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center justify-center h-32"
        >
          <Image
            src={imageUrl}
            alt={logo.name}
            width={150}
            height={80}
            className="max-h-16 w-auto object-contain"
          />
        </a>
      ) : (
        <div className="flex items-center justify-center h-32">
          <Image
            src={imageUrl}
            alt={logo.name}
            width={150}
            height={80}
            className="max-h-16 w-auto object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ClientLogoCard; 