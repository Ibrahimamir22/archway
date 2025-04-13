import React from 'react';
import Link from 'next/link';
import type { FooterSection as FooterSectionType } from '../../../hooks/ui/useFooter';

interface FooterLink {
  id: string;
  text: string;
  url: string;
  open_in_new_tab?: boolean;
}

export interface FooterSectionProps {
  section: FooterSectionType;
  isRtl: boolean;
}

const FooterSection = ({ section, isRtl }: FooterSectionProps): JSX.Element => {
  return (
    <div className={`col-span-1 ${isRtl ? 'text-right' : ''}`}>
      <h3 className="text-xl font-bold mb-4">{section.title}</h3>
      {section.links && section.links.length > 0 && (
        <ul className="space-y-2">
          {section.links.map((link: FooterLink) => (
            <li key={link.id}>
              {link.url.startsWith('/') || link.url.startsWith('#') ? (
                <Link 
                  href={link.url} 
                  className="text-gray-300 hover:text-white transition-colors"
                  target={link.open_in_new_tab ? '_blank' : undefined}
                  rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
                >
                  {link.text}
                </Link>
              ) : (
                <a 
                  href={link.url} 
                  className="text-gray-300 hover:text-white transition-colors"
                  target={link.open_in_new_tab ? '_blank' : '_self'}
                  rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
                >
                  {link.text}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FooterSection; 