'use client';

import Link from "next/link";
import { useLocale } from 'next-intl';
import OptimizedImage from "@/components/common/OptimizedImage";

// Generate an array of placeholder projects
const generatePlaceholders = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i.toString(),
    title: { en: `Sample Project ${i + 1}`, ar: `مشروع عينة ${i + 1}` },
    description: { 
      en: 'This is a placeholder for a project description that will be loaded from the API.',
      ar: 'هذا مكان مخصص لوصف المشروع الذي سيتم تحميله من واجهة برمجة التطبيقات.'
    },
    slug: `placeholder-${i + 1}`,
    thumbnail: `/images/placeholders/project-${(i % 3) + 1}.jpg`,
    area: 120 + (i * 10),
    category: {
      id: i.toString(),
      name: { en: 'Sample Category', ar: 'فئة العينة' }
    }
  }));
};

interface PlaceholderProjectsProps {
  count?: number;
}

// Helper function to safely get localized content
const getLocalizedContent = (content: Record<string, string>, locale: string): string => {
  return content[locale as keyof typeof content] || content.en || Object.values(content)[0] || '';
};

/**
 * Component that renders placeholder project cards when no real projects are available
 * Uses direct data from fixtures without relying on translations
 */
export default function PlaceholderProjects({ count = 3 }: PlaceholderProjectsProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const placeholders = generatePlaceholders(count).slice(0, count);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {placeholders.map((project) => (
        <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
          <Link href={`/${locale}/portfolio/${project.slug}`} className="block">
            <div className="relative h-60 w-full">
              <OptimizedImage
                src={project.thumbnail}
                alt={getLocalizedContent(project.title, locale)}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className={`text-xl font-semibold mb-2 ${isRtl ? 'font-tajawal' : 'font-playfair'}`}>
                {getLocalizedContent(project.title, locale)}
              </h3>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {getLocalizedContent(project.description, locale)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {locale === 'ar' ? `${project.area} متر مربع` : `${project.area} sqm`}
                </span>
                <span className="text-sm text-primary">
                  {getLocalizedContent(project.category.name, locale)}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
} 