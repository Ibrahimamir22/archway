import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  description,
  alignment = 'center',
  className = '',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`mb-12 ${alignmentClasses[alignment]} ${className}`}>
      <h4 className="text-lg font-medium text-emerald-600 mb-2">{subtitle}</h4>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
      {description && (
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader; 