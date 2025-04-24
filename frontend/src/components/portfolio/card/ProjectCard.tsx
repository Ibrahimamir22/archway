'use client';

import React from 'react';
import { Project } from '@/lib/hooks';
import ProjectCardImage from './ProjectCardImage';
import ProjectCardContent from './ProjectCardContent';

interface ProjectCardProps {
  project: Project;
  onSaveToFavorites?: (projectId: string) => void;
  isAuthenticated?: boolean;
  className?: string;
}

/**
 * A modular project card component that composes the image and content sections
 */
const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSaveToFavorites,
  isAuthenticated = false,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg h-full flex flex-col ${className}`}>
      <ProjectCardImage project={project} />
      <ProjectCardContent 
        project={project} 
        onSaveToFavorites={onSaveToFavorites}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default ProjectCard; 