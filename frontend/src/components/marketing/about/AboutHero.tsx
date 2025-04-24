import React from 'react';
import { ScrollReveal } from '@/components/ui';

interface AboutHeroProps {
  t: (key: string) => string;
  isRtl: boolean;
}

const AboutHero: React.FC<AboutHeroProps> = ({ t, isRtl }) => {
  return (
    <header className="text-center mb-16">
      <ScrollReveal animation="fade-in" duration={1}>
        <span className="inline-block px-4 py-1.5 bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-accent rounded-full text-sm font-medium mb-6">
          {t('aboutUs')}
        </span>
      </ScrollReveal>
      
      <ScrollReveal animation="fade-in" delay={0.2} duration={1}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-brand-blue dark:text-white">
          {t('title')}
        </h1>
      </ScrollReveal>
      
      <ScrollReveal animation="fade-in" delay={0.4} duration={1}>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
      </ScrollReveal>
    </header>
  );
};

export default AboutHero; 