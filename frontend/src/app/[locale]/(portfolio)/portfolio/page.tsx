import { getProjects } from '@/lib/api/portfolio';
import { getTranslations } from 'next-intl/server';
import ProjectGrid from '@/components/portfolio/list/ProjectGrid';
import FilterWrapper from './FilterWrapper';

export interface PortfolioPageProps {
  params: { locale: string };
  searchParams: { 
    category?: string;
    tag?: string;
    search?: string;
  };
}

export default async function PortfolioPage({
  params,
  searchParams
}: PortfolioPageProps) {
  const t = await getTranslations();
  const locale = params.locale || 'en';
  const isRtl = locale === 'ar';
  
  const { category, tag, search } = searchParams;
  
  // Fetch initial projects server-side
  const { projects, hasNextPage } = await getProjects(
    {
      category,
      tag,
      search,
      is_published: true,
      lang: locale,
      limit: 12
    },
    1
  ).catch(() => ({ projects: [], hasNextPage: false, totalPages: 0, totalCount: 0 }));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className={`text-center mb-16 ${isRtl ? 'rtl' : ''}`}>
        <h1 className="text-4xl font-heading font-bold mb-4">{t('portfolio.title')}</h1>
        <p className="text-xl text-gray-600">{t('portfolio.subtitle')}</p>
        <div className="w-24 h-1 bg-brand-accent mx-auto mt-8"></div>
      </div>
      
      <FilterWrapper 
        initialCategory={category}
        initialTag={tag}
        initialSearch={search}
        locale={locale}
      >
        <ProjectGrid 
          initialProjects={projects}
          category={category}
          tag={tag}
          search={search}
          lang={locale}
          hasNextPage={hasNextPage}
        />
      </FilterWrapper>
    </div>
  );
} 