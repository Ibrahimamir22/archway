import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram, FaEnvelope } from 'react-icons/fa';
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
  
  // Determine if the member is a leader (has "lead" or "director" or "manager" in their role)
  const isLeader = member.role?.toLowerCase().includes('lead') || 
                   member.role?.toLowerCase().includes('director') || 
                   member.role?.toLowerCase().includes('manager') ||
                   member.role?.toLowerCase().includes('ceo') ||
                   member.role?.toLowerCase().includes('cto') ||
                   member.role?.toLowerCase().includes('head');
  
  return (
    <div className="transform-gpu h-full">
      <div 
        className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 
          hover:-translate-y-2 group relative ${className} h-full flex flex-col
          ${isLeader ? 'ring-2 ring-brand-accent' : 'hover:ring-1 hover:ring-brand-blue-light'}
        `}
        style={{
          transformOrigin: 'center bottom',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget;
          target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }}
      >
        {/* Image container with overlay - overflow hidden to contain the scaling effect */}
        <div className="aspect-w-1 aspect-h-1 w-full relative h-80 overflow-hidden flex-shrink-0">
          {/* Gradient overlay that appears on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"/>
          
          {/* Check if the image URL is internal or external */}
          {imageUrl.startsWith('http') ? (
            // For external URLs, use an img tag
            <img
              src={imageUrl}
              alt={member.name}
              className="object-cover w-full h-full transition-transform duration-500 transform-gpu"
              style={{
                transformOrigin: 'center center',
                transition: 'transform 0.5s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            // For internal or relative URLs, use Next.js Image with controlled scaling
            <div className="relative w-full h-full transition-transform duration-500 transform-gpu"
              style={{
                transformOrigin: 'center center',
                transition: 'transform 0.5s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Image
                src={imageUrl}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          )}
        </div>
        
        {/* Leader badge (conditional) */}
        {isLeader && (
          <div className="absolute top-4 right-4 bg-brand-accent text-white px-3 py-1 rounded-full text-xs font-semibold z-20">
            {member.role?.includes('Lead') ? 'Lead' : 'Leadership'}
          </div>
        )}
        
        {/* Content container */}
        <div className="p-6 relative flex flex-col flex-grow">
          {/* Decorative element */}
          <div className="absolute -top-5 left-6 w-10 h-10 bg-brand-blue dark:bg-brand-accent rotate-45 transform-gpu"></div>
          
          {/* Name and role */}
          <div className="relative flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
            <p className="text-brand-accent dark:text-brand-accent font-medium mb-4">{member.role}</p>
            
            {/* Bio with line clamp */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 text-sm flex-grow">{member.bio}</p>
            
            {/* Social links with branded colors */}
            <div className="flex space-x-4 mt-auto">
              {member.linkedin && (
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#0077b5] hover:text-[#0077b5]/80 transition-colors"
                  aria-label={`${member.name}'s LinkedIn`}
                >
                  <FaLinkedin size={20} />
                </a>
              )}
              {member.twitter && (
                <a 
                  href={member.twitter} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#1DA1F2] hover:text-[#1DA1F2]/80 transition-colors"
                  aria-label={`${member.name}'s Twitter`}
                >
                  <FaTwitter size={20} />
                </a>
              )}
              {member.github && (
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                  aria-label={`${member.name}'s GitHub`}
                >
                  <FaGithub size={20} />
                </a>
              )}
              {member.instagram && (
                <a 
                  href={member.instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#E1306C] hover:text-[#E1306C]/80 transition-colors"
                  aria-label={`${member.name}'s Instagram`}
                >
                  <FaInstagram size={20} />
                </a>
              )}
              {member.email && (
                <a 
                  href={`mailto:${member.email}`}
                  rel="noreferrer" 
                  className="text-gray-600 dark:text-gray-300 hover:text-brand-accent dark:hover:text-brand-accent transition-colors"
                  aria-label={`Email ${member.name}`}
                >
                  <FaEnvelope size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard; 