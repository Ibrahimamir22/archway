import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram } from 'react-icons/fa';
import { TeamMember } from '@/types/marketing';

interface TeamMemberCardProps {
  member: TeamMember;
  className?: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  className = '' 
}) => {
  // State to track image errors
  const [imgError, setImgError] = useState(false);
  
  // Get the correct image URL (handle both image and image_url properties)
  let imageUrl = member.image_url || member.image || '/images/team/placeholder.jpg';
  
  // If we've had an error loading the image, use the placeholder
  if (imgError) {
    imageUrl = '/images/team/placeholder.jpg';
  }
  
  // Debug output
  useEffect(() => {
    console.log('TeamMember data:', member);
    console.log('Using image URL:', imageUrl);
  }, [member, imageUrl]);
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 ${className}`}>
      <div className="aspect-w-3 aspect-h-2 w-full relative h-[250px]">
        {/* Check if the image URL is internal or external */}
        {imageUrl.startsWith('http') ? (
          // For external URLs, use an img tag
          <img
            src={imageUrl}
            alt={member.name}
            className="object-cover w-full h-full"
            onError={() => setImgError(true)}
          />
        ) : (
          // For internal or relative URLs, use Next.js Image
          <Image
            src={imageUrl}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold">{member.name}</h3>
        <p className="text-emerald-600 mb-4">{member.role}</p>
        <p className="text-gray-600 mb-6">{member.bio}</p>
        <div className="flex space-x-3">
          {member.linkedin && (
            <a 
              href={member.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
          )}
          {member.email && (
            <a 
              href={`mailto:${member.email}`}
              rel="noreferrer" 
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard; 