import React from 'react';
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
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 ${className}`}>
      <div className="aspect-w-3 aspect-h-2 w-full">
        <Image
          src={member.profileImage}
          alt={member.name}
          width={400}
          height={300}
          className="object-cover w-full h-[250px]"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold">{member.name}</h3>
        <p className="text-emerald-600 mb-4">{member.position}</p>
        <p className="text-gray-600 mb-6">{member.bio}</p>
        <div className="flex space-x-3">
          {member.socialLinks?.linkedin && (
            <a 
              href={member.socialLinks.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
          )}
          {member.socialLinks?.twitter && (
            <a 
              href={member.socialLinks.twitter} 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <FaTwitter size={20} />
            </a>
          )}
          {member.socialLinks?.github && (
            <a 
              href={member.socialLinks.github} 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <FaGithub size={20} />
            </a>
          )}
          {member.socialLinks?.instagram && (
            <a 
              href={member.socialLinks.instagram} 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <FaInstagram size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard; 