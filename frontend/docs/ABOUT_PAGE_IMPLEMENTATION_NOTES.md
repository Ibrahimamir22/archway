# About Page Implementation Notes

## Page Component Structure

### Main Page Component (Server Component)

```tsx
// frontend/src/app/[locale]/(marketing)/about/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { notFound } from "next/navigation";
import { Pattern } from '@/components/ui/Pattern';
import AboutClient from './AboutClient';
import { locales } from "@/../i18n";

export async function generateMetadata(
  { params: { locale } }: { params: { locale: string } }
): Promise<Metadata> {
  let metaMessages;
  try {
    metaMessages = require(`@/../src/messages/${locale}.json`);
  } catch (e) {
    metaMessages = require(`@/../src/messages/${locales[0]}.json`);
  }
  const aboutNamespace = metaMessages?.about || {};
  
  return {
    title: aboutNamespace.pageTitle || 'About Us',
    description: aboutNamespace.pageDescription || 'Learn about Archway Interior Design'
  };
}

export default function AboutPage({ params: { locale } }: { params: { locale: string }}) {
  // Load messages for this page
  let messages;
  try {
    messages = require(`@/../src/messages/${locale}.json`);
  } catch (error) {
    console.error(`AboutPage: Failed loading messages for ${locale}`, error);
    messages = require(`@/../src/messages/${locales[0]}.json`);
  }
  
  const aboutMessages = messages?.about || {};
  const isRtl = locale === 'ar';

  return (
    <main 
      className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-[90vh]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10" aria-hidden="true">
        <Pattern />
      </div>
      
      {/* Decorative elements */}
      <div 
        className="absolute top-20 -left-20 w-64 h-64 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      <div 
        className="absolute bottom-20 -right-20 w-80 h-80 bg-brand-accent/10 dark:bg-brand-accent/20 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      
      {/* Client component wrapper */}
      <AboutClient locale={locale} messages={aboutMessages} />
    </main>
  );
}
```

### Client Component Wrapper

```tsx
// frontend/src/app/[locale]/(marketing)/about/AboutClient.tsx
'use client';

import React from 'react';
import { AboutHero } from '@/components/marketing/about/AboutHero';
import { MissionVision } from '@/components/marketing/about/MissionVision';
import { TeamSection } from '@/components/marketing/about/TeamSection';
import { TestimonialsSection } from '@/components/marketing/about/Testimonials';
import { CompanyHistory } from '@/components/marketing/about/CompanyHistory';
import { CoreValues } from '@/components/marketing/about/CoreValues';

interface AboutClientProps {
  locale: string;
  messages: Record<string, string>;
}

export default function AboutClient({ locale, messages }: AboutClientProps) {
  const isRtl = locale === 'ar';
  
  // Helper function to get translation
  const t = (key: string): string => {
    return messages[key] || key;
  };
  
  return (
    <div className="relative container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <AboutHero t={t} isRtl={isRtl} />
        
        {/* Mission and Vision */}
        <MissionVision t={t} isRtl={isRtl} />
        
        {/* Core Values */}
        <CoreValues t={t} isRtl={isRtl} />
        
        {/* Team Section */}
        <TeamSection t={t} isRtl={isRtl} locale={locale} />
        
        {/* Company History */}
        <CompanyHistory t={t} isRtl={isRtl} />
        
        {/* Testimonials */}
        <TestimonialsSection t={t} isRtl={isRtl} />
        
        {/* FAQ Section Teaser */}
        <section 
          className="mt-20 md:mt-24 text-center animate-fade-in p-8 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm shadow-sm border border-gray-100 dark:border-gray-800" 
          style={{ animationDelay: '0.5s' }}
          aria-labelledby="faq-heading"
        >
          <h2 id="faq-heading" className="text-2xl font-heading font-bold mb-4 text-brand-blue dark:text-white">
            {t('frequentlyAsked')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t('cannotFind')}</p>
          <a 
            href={`/${locale}/faq`} 
            className="inline-flex items-center justify-center px-5 py-3 bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-accent rounded-lg hover:bg-brand-blue/20 dark:hover:bg-brand-blue/30 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-accent focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {t('viewFaq')}
            <svg 
              className={`w-4 h-4 ${isRtl ? 'mr-2 rotate-180' : 'ml-2'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </section>
      </div>
    </div>
  );
}
```

## Key Components Implementation

### AboutHero Component

```tsx
// frontend/src/components/marketing/about/AboutHero.tsx
import React from 'react';

interface AboutHeroProps {
  t: (key: string) => string;
  isRtl: boolean;
}

export const AboutHero: React.FC<AboutHeroProps> = ({ t, isRtl }) => {
  return (
    <header className="text-center mb-16 animate-fade-in">
      <span className="inline-block px-4 py-1.5 bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-accent rounded-full text-sm font-medium mb-6">
        {t('aboutUs')}
      </span>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-brand-blue dark:text-white">
        {t('title')}
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
        {t('subtitle')}
      </p>
    </header>
  );
};
```

### MissionVision Component

```tsx
// frontend/src/components/marketing/about/MissionVision.tsx
import React from 'react';

interface MissionVisionProps {
  t: (key: string) => string;
  isRtl: boolean;
}

export const MissionVision: React.FC<MissionVisionProps> = ({ t, isRtl }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
        <div className="mb-4">
          <div className="w-12 h-12 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-brand-blue dark:text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-heading font-semibold mb-4 text-brand-blue dark:text-white">{t('mission')}</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('missionText')}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
        <div className="mb-4">
          <div className="w-12 h-12 bg-brand-accent/10 dark:bg-brand-accent/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-heading font-semibold mb-4 text-brand-blue dark:text-white">{t('vision')}</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('visionText')}</p>
      </div>
    </div>
  );
};
```

### TeamMemberCard Component

```tsx
// frontend/src/components/marketing/about/TeamSection/TeamMemberCard.tsx
import React from 'react';
import Image from 'next/image';

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  isRtl: boolean;
}

export const TeamMemberCard: React.FC<TeamMemberProps> = ({ name, role, bio, image, isRtl }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-4px]">
      <div className="relative h-64 w-full overflow-hidden">
        <Image 
          src={image} 
          alt={name}
          className="object-cover transition-transform hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className={`p-6 ${isRtl ? 'text-right' : ''}`}>
        <h3 className="text-xl font-semibold mb-1 text-brand-blue dark:text-white">{name}</h3>
        <p className="text-brand-accent dark:text-brand-accent font-medium mb-3">{role}</p>
        <p className="text-gray-600 dark:text-gray-300">{bio}</p>
      </div>
    </div>
  );
};
```

### Data Hooks

```tsx
// frontend/src/lib/hooks/marketing/about/useTeamMembers.ts
import { useState, useEffect } from 'react';
import { TeamMember } from '@/types/marketing/about';

export function useTeamMembers(locale: string) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        setLoading(true);
        
        // For now, use hardcoded data
        // In the future, this will fetch from the API
        const mockTeamMembers: TeamMember[] = [
          {
            id: 1,
            name: 'Sarah Ahmed',
            role: 'Principal Designer',
            bio: 'Over 10 years of experience in interior design, specializing in residential spaces.',
            image: '/images/team/placeholder1.jpg',
          },
          {
            id: 2,
            name: 'Mohammed Hassan',
            role: 'Project Manager',
            bio: 'Ensures all projects are delivered on time and within budget while maintaining the highest quality standards.',
            image: '/images/team/placeholder2.jpg',
          },
          {
            id: 3,
            name: 'Nour Eldin',
            role: '3D Visualization Specialist',
            bio: 'Transforms design concepts into stunning 3D visualizations that help clients envision their future spaces.',
            image: '/images/team/placeholder3.jpg',
          },
        ];
        
        setTeamMembers(mockTeamMembers);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch team members'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchTeamMembers();
  }, [locale]);
  
  return { teamMembers, loading, error };
}
```

## Animation Snippets

### CSS Animation Classes

Add these to your Tailwind CSS config:

```js
// tailwind.config.js
module.exports = {
  // ...other config
  theme: {
    extend: {
      // ...other extensions
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'counter': 'counter 2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        counter: {
          '0%': { 'counter-increment': 'count 0' },
          '100%': { 'counter-increment': 'count var(--target-count)' },
        },
      },
    },
  },
  plugins: [
    // Additional plugin for counter animations
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.counter-ready': {
          'counter-reset': 'count',
        },
        '.counter::after': {
          'content': 'counter(count)',
          'counter-reset': 'none',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
```

## Translation Keys

Add these keys to your localization files:

```json
// src/messages/en.json
{
  "about": {
    "pageTitle": "About Us | Archway Innovations",
    "pageDescription": "Learn about Archway Innovations, our mission, vision, and the team behind our interior design expertise.",
    "aboutUs": "About Us",
    "title": "Transforming Spaces, Enhancing Lives",
    "subtitle": "We're a team of passionate designers dedicated to creating exceptional interior spaces that reflect your personality and lifestyle.",
    "mission": "Our Mission",
    "missionText": "To create innovative interior designs that balance aesthetics, functionality, and sustainability while exceeding client expectations.",
    "vision": "Our Vision",
    "visionText": "To be the leading interior design firm in Egypt, recognized for our exceptional designs and sustainable practices that enhance quality of life.",
    "team": "Meet Our Team",
    "values": "Our Core Values",
    "value1Title": "Excellence",
    "value1Text": "We strive for excellence in every project, paying meticulous attention to detail.",
    "value2Title": "Innovation",
    "value2Text": "We embrace innovative ideas and cutting-edge design techniques.",
    "value3Title": "Sustainability",
    "value3Text": "We're committed to sustainable design practices and environmentally friendly solutions.",
    "value4Title": "Client-Centered",
    "value4Text": "We listen closely to our clients to deliver spaces that truly reflect their needs and aspirations.",
    "history": "Our Journey",
    "testimonials": "What Our Clients Say",
    "statistics": "By The Numbers",
    "statProjects": "Projects Completed",
    "statClients": "Happy Clients",
    "statAwards": "Design Awards",
    "statYears": "Years of Experience",
    "frequentlyAsked": "Have Questions?",
    "cannotFind": "Explore our frequently asked questions to learn more about our services and process.",
    "viewFaq": "View FAQ"
  }
}
```

## Backend Integration Reference

```python
# Future Django models for about page

from django.db import models
from django.utils.translation import gettext_lazy as _

class TeamMember(models.Model):
    name = models.CharField(_("Name"), max_length=100)
    role = models.CharField(_("Role"), max_length=100)
    bio = models.TextField(_("Biography"))
    image = models.ImageField(_("Profile Image"), upload_to="team/")
    order = models.PositiveIntegerField(_("Display Order"), default=0)
    is_active = models.BooleanField(_("Active"), default=True)
    
    # For multilingual support
    name_ar = models.CharField(_("Name (Arabic)"), max_length=100)
    role_ar = models.CharField(_("Role (Arabic)"), max_length=100)
    bio_ar = models.TextField(_("Biography (Arabic)"))
    
    class Meta:
        ordering = ["order"]
        verbose_name = _("Team Member")
        verbose_name_plural = _("Team Members")
    
    def __str__(self):
        return self.name

class Testimonial(models.Model):
    client_name = models.CharField(_("Client Name"), max_length=100)
    quote = models.TextField(_("Testimonial Quote"))
    project = models.CharField(_("Project"), max_length=100)
    is_featured = models.BooleanField(_("Featured"), default=False)
    
    # For multilingual support
    client_name_ar = models.CharField(_("Client Name (Arabic)"), max_length=100)
    quote_ar = models.TextField(_("Testimonial Quote (Arabic)"))
    project_ar = models.CharField(_("Project (Arabic)"), max_length=100)
    
    class Meta:
        ordering = ["-id"]
        verbose_name = _("Testimonial")
        verbose_name_plural = _("Testimonials")
    
    def __str__(self):
        return f"{self.client_name} - {self.project}"

class CompanyHistory(models.Model):
    year = models.PositiveIntegerField(_("Year"))
    title = models.CharField(_("Title"), max_length=200)
    description = models.TextField(_("Description"))
    
    # For multilingual support
    title_ar = models.CharField(_("Title (Arabic)"), max_length=200)
    description_ar = models.TextField(_("Description (Arabic)"))
    
    class Meta:
        ordering = ["-year"]
        verbose_name = _("Company History")
        verbose_name_plural = _("Company History")
    
    def __str__(self):
        return f"{self.year}: {self.title}"

class CoreValue(models.Model):
    title = models.CharField(_("Title"), max_length=100)
    description = models.TextField(_("Description"))
    icon = models.CharField(_("Icon"), max_length=50, help_text=_("Icon name or identifier"))
    order = models.PositiveIntegerField(_("Display Order"), default=0)
    
    # For multilingual support
    title_ar = models.CharField(_("Title (Arabic)"), max_length=100)
    description_ar = models.TextField(_("Description (Arabic)"))
    
    class Meta:
        ordering = ["order"]
        verbose_name = _("Core Value")
        verbose_name_plural = _("Core Values")
    
    def __str__(self):
        return self.title
```

## Next Steps and Recommendations

1. **Start with structure**: Begin by implementing the page structure and basic components.
2. **Focus on visuals first**: Implement the UI patterns and styling before adding complex functionality.
3. **Progressive enhancement**: Add animations after the basic components are working properly.
4. **Mobile-first approach**: Design for mobile devices first, then enhance for larger screens.
5. **Test RTL thoroughly**: Ensure all components work correctly in both LTR and RTL modes.
6. **Accessibility first**: Implement proper ARIA attributes and keyboard navigation from the start.
7. **Mock data structure**: Create mock data that matches the expected API response format.