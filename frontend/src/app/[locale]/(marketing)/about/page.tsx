import React from 'react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Metadata } from 'next';

// --- Metadata ---
// Define generateMetadata function to dynamically set metadata based on locale
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common' }); // Load common translations

  return {
    title: `${t('about.title')} | ${t('appName')}`,
    description: t('about.metaDescription', { default: 'Learn about Archway Interior Design, our mission, vision, and team.' }),
    // Add other metadata as needed
  };
}
// --- End Metadata ---

// --- Page Component (Server Component) ---
export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const tAbout = await getTranslations({ locale, namespace: 'about' });
  const tCommon = await getTranslations({ locale, namespace: 'common' }); // Keep for appName etc.
  const isRtl = locale === 'ar';

  // --- Data (Keys should NOT include the namespace prefix) ---
  interface TeamMember {
    nameKey: string; 
    roleKey: string; 
    bioKey: string;  
    image: string;
  }

  const teamMembers: TeamMember[] = [
    {
      nameKey: 'teamMember1Name', // Remove 'about.' prefix
      roleKey: 'teamMember1Role', 
      bioKey: 'teamMember1Bio',
      image: '/images/team/placeholder1.jpg',
    },
    {
      nameKey: 'teamMember2Name', // Remove 'about.' prefix
      roleKey: 'teamMember2Role',
      bioKey: 'teamMember2Bio',
      image: '/images/team/placeholder2.jpg',
    },
    {
      nameKey: 'teamMember3Name', // Remove 'about.' prefix
      roleKey: 'teamMember3Role',
      bioKey: 'teamMember3Bio',
      image: '/images/team/placeholder3.jpg',
    },
  ];

  interface Testimonial {
    id: number;
    clientNameKey: string;
    quoteKey: string;
    projectKey: string;
  }

  const testimonials: Testimonial[] = [
    {
      id: 1,
      clientNameKey: 'testimonial1Client', // Remove 'about.' prefix
      quoteKey: 'testimonial1Quote',
      projectKey: 'testimonial1Project',
    },
    {
      id: 2,
      clientNameKey: 'testimonial2Client', // Remove 'about.' prefix
      quoteKey: 'testimonial2Quote',
      projectKey: 'testimonial2Project',
    },
    {
      id: 3,
      clientNameKey: 'testimonial3Client', // Remove 'about.' prefix
      quoteKey: 'testimonial3Quote',
      projectKey: 'testimonial3Project',
    },
  ];
  // --- End Data ---

  return (
    // No need for <Head> or <>
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-heading font-bold mb-4">{tAbout('title')}</h1>
        <div className="w-24 h-1 bg-brand-accent mx-auto mb-8"></div>
      </div>

      {/* Mission and Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className={`bg-brand-light p-8 rounded-lg shadow-md ${isRtl ? 'text-right' : ''}`}>
          <h2 className="text-2xl font-heading font-semibold mb-4">{tAbout('mission')}</h2>
          <p className="text-gray-700 leading-relaxed">{tAbout('missionText')}</p>
        </div>
        
        <div className={`bg-brand-light p-8 rounded-lg shadow-md ${isRtl ? 'text-right' : ''}`}>
          <h2 className="text-2xl font-heading font-semibold mb-4">{tAbout('vision')}</h2>
          <p className="text-gray-700 leading-relaxed">{tAbout('visionText')}</p>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-20">
        <h2 className={`text-3xl font-heading font-semibold mb-12 ${isRtl ? 'text-right' : 'text-center'}`}>
          {tAbout('team')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="relative h-64 w-full">
                <Image 
                  src={member.image} 
                  alt={tAbout(member.nameKey, undefined, { default: 'Team member' })}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className={`p-6 ${isRtl ? 'text-right' : ''}`}>
                <h3 className="text-xl font-semibold mb-1">{tAbout(member.nameKey, undefined, { default: 'Team member' })}</h3>
                <p className="text-brand-accent font-medium mb-3">{tAbout(member.roleKey)}</p>
                <p className="text-gray-700">{tAbout(member.bioKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div>
        <h2 className={`text-3xl font-heading font-semibold mb-12 ${isRtl ? 'text-right' : 'text-center'}`}>
          {tAbout('testimonials')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-8 border-t-4 border-brand-accent">
              <div className={`mb-6 ${isRtl ? 'text-right' : ''}`}>
                <svg className={`h-8 w-8 text-brand-accent mb-4 ${isRtl ? 'me-0 ms-auto' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-700 italic mb-4">{tAbout(testimonial.quoteKey)}</p>
                <div className="font-semibold">{tAbout(testimonial.clientNameKey)}</div>
                <div className="text-sm text-gray-600">{tAbout(testimonial.projectKey)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// Note: You will need to add all the translation keys used here (e.g., 'about.title', 'about.mission', 'about.teamMember1Role', etc.) 
// to your common.json (or a new about.json namespace if preferred) for both 'en' and 'ar'. 