import React from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Sarah Ahmed',
    role: 'Lead Designer',
    bio: 'Sarah has over 10 years of experience in interior design, specializing in luxury residential spaces.',
    image: '/images/team/placeholder1.jpg',
  },
  {
    name: 'Mohammed Hassan',
    role: 'Project Manager',
    bio: 'Mohammed ensures all projects are delivered on time and within budget while maintaining highest quality standards.',
    image: '/images/team/placeholder2.jpg',
  },
  {
    name: 'Nour El-Din',
    role: '3D Visualization Specialist',
    bio: 'Nour transforms design concepts into stunning 3D visualizations that help clients envision their future spaces.',
    image: '/images/team/placeholder3.jpg',
  },
];

interface Testimonial {
  id: number;
  clientName: string;
  quote: string;
  project: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    clientName: 'Amira Mahmoud',
    quote: 'Working with Archway transformed our home completely. Their attention to detail and understanding of our needs was exceptional.',
    project: 'Residential Villa, Cairo',
  },
  {
    id: 2,
    clientName: 'Cairo Central Bank',
    quote: 'The Archway team delivered a sophisticated office space that perfectly balances functionality and aesthetic appeal.',
    project: 'Corporate Office, New Cairo',
  },
  {
    id: 3,
    clientName: 'Layla\'s Boutique',
    quote: 'Our retail space needed to reflect our brand identity, and Archway delivered beyond our expectations.',
    project: 'Retail Design, Alexandria',
  },
];

const AboutPage: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';

  return (
    <>
      <Head>
        <title>About Us | Archway Interior Design</title>
        <meta name="description" content="Learn about Archway Interior Design, our mission, vision, team, and what our clients say about us." />
      </Head>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-heading font-bold mb-4">{t('about.title')}</h1>
          <div className="w-24 h-1 bg-brand-accent mx-auto mb-8"></div>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className={`bg-brand-light p-8 rounded-lg shadow-md ${isRtl ? 'text-right' : ''}`}>
            <h2 className="text-2xl font-heading font-semibold mb-4">{t('about.mission')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('about.missionText')}</p>
          </div>
          
          <div className={`bg-brand-light p-8 rounded-lg shadow-md ${isRtl ? 'text-right' : ''}`}>
            <h2 className="text-2xl font-heading font-semibold mb-4">{t('about.vision')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('about.visionText')}</p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className={`text-3xl font-heading font-semibold mb-12 ${isRtl ? 'text-right' : 'text-center'}`}>
            {t('about.team')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                <div className="relative h-64 w-full">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className={`p-6 ${isRtl ? 'text-right' : ''}`}>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-brand-accent font-medium mb-3">{member.role}</p>
                  <p className="text-gray-700">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div>
          <h2 className={`text-3xl font-heading font-semibold mb-12 ${isRtl ? 'text-right' : 'text-center'}`}>
            {t('about.testimonials')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-8 border-t-4 border-brand-accent">
                <div className={`mb-6 ${isRtl ? 'text-right' : ''}`}>
                  <svg className={`h-8 w-8 text-brand-accent mb-4 ${isRtl ? 'me-0 ms-auto' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-700 italic mb-4">{testimonial.quote}</p>
                  <div className="font-semibold">{testimonial.clientName}</div>
                  <div className="text-sm text-gray-600">{testimonial.project}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default AboutPage; 