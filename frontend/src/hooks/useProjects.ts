import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: Category;
  client?: string;
  location?: string;
  area?: number;
  completed_date?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  cover_image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface UseProjectsOptions {
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
}

export const useProjects = (options: UseProjectsOptions = {}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In actual implementation, this would fetch from the API
        // For now, let's simulate an API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulated data - will be replaced with actual API call
        const mockProjects: Project[] = [
          {
            id: '1',
            title: locale === 'ar' ? 'فيلا ساحلية حديثة' : 'Modern Coastal Villa',
            slug: 'modern-coastal-villa',
            description: locale === 'ar' ? 'فيلا ساحلية مع إطلالات خلابة على البحر الأبيض المتوسط.' : 'A coastal villa with stunning views of the Mediterranean Sea.',
            category: { id: '1', name: locale === 'ar' ? 'سكني' : 'Residential', slug: 'residential' },
            location: 'Alexandria, Egypt',
            area: 450,
            is_featured: true,
            created_at: '2023-01-15T00:00:00Z',
            updated_at: '2023-01-15T00:00:00Z',
            tags: [
              { id: '1', name: locale === 'ar' ? 'حديث' : 'Modern', slug: 'modern' },
              { id: '2', name: locale === 'ar' ? 'ساحلي' : 'Coastal', slug: 'coastal' }
            ],
            cover_image: 'https://via.placeholder.com/800x600/102339/FFFFFF?text=Coastal+Villa'
          },
          {
            id: '2',
            title: locale === 'ar' ? 'مكتب شركة القاهرة' : 'Cairo Corporate Office',
            slug: 'cairo-corporate-office',
            description: locale === 'ar' ? 'مساحة مكتبية عصرية تجمع بين الوظائف والأناقة لشركة تكنولوجيا في القاهرة الجديدة.' : 'A modern office space that combines functionality and elegance for a tech company in New Cairo.',
            category: { id: '2', name: locale === 'ar' ? 'تجاري' : 'Commercial', slug: 'commercial' },
            location: 'New Cairo, Egypt',
            area: 1200,
            is_featured: true,
            created_at: '2023-02-20T00:00:00Z',
            updated_at: '2023-02-20T00:00:00Z',
            tags: [
              { id: '3', name: locale === 'ar' ? 'مكتب' : 'Office', slug: 'office' },
              { id: '4', name: locale === 'ar' ? 'شركة' : 'Corporate', slug: 'corporate' }
            ],
            cover_image: 'https://via.placeholder.com/800x600/102339/FFFFFF?text=Corporate+Office'
          },
          {
            id: '3',
            title: locale === 'ar' ? 'متجر أزياء راقي' : 'Luxury Fashion Boutique',
            slug: 'luxury-fashion-boutique',
            description: locale === 'ar' ? 'تصميم داخلي فاخر لمتجر أزياء راقٍ في وسط القاهرة.' : 'Luxurious interior design for a high-end fashion boutique in downtown Cairo.',
            category: { id: '3', name: locale === 'ar' ? 'تجزئة' : 'Retail', slug: 'retail' },
            location: 'Cairo, Egypt',
            area: 250,
            is_featured: false,
            created_at: '2023-03-10T00:00:00Z',
            updated_at: '2023-03-10T00:00:00Z',
            tags: [
              { id: '5', name: locale === 'ar' ? 'فاخر' : 'Luxury', slug: 'luxury' },
              { id: '6', name: locale === 'ar' ? 'متجر' : 'Boutique', slug: 'boutique' }
            ],
            cover_image: 'https://via.placeholder.com/800x600/102339/FFFFFF?text=Fashion+Boutique'
          }
        ];
        
        // Filter projects based on options
        let filteredProjects = [...mockProjects];
        
        if (options.category) {
          filteredProjects = filteredProjects.filter(
            project => project.category.slug === options.category
          );
        }
        
        if (options.tag) {
          filteredProjects = filteredProjects.filter(
            project => project.tags.some(tag => tag.slug === options.tag)
          );
        }
        
        if (options.search) {
          const searchLower = options.search.toLowerCase();
          filteredProjects = filteredProjects.filter(
            project => 
              project.title.toLowerCase().includes(searchLower) ||
              project.description.toLowerCase().includes(searchLower) ||
              (project.location && project.location.toLowerCase().includes(searchLower))
          );
        }
        
        if (options.featured) {
          filteredProjects = filteredProjects.filter(project => project.is_featured);
        }
        
        if (options.limit && options.limit > 0) {
          filteredProjects = filteredProjects.slice(0, options.limit);
        }
        
        setProjects(filteredProjects);
      } catch (err) {
        setError('Failed to fetch projects. Please try again later.');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [options.category, options.tag, options.search, options.featured, options.limit, locale]);
  
  return { projects, loading, error };
};

export const useProjectCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - will be replaced with actual API call
        const mockCategories: Category[] = [
          { id: '1', name: locale === 'ar' ? 'سكني' : 'Residential', slug: 'residential' },
          { id: '2', name: locale === 'ar' ? 'تجاري' : 'Commercial', slug: 'commercial' },
          { id: '3', name: locale === 'ar' ? 'تجزئة' : 'Retail', slug: 'retail' },
          { id: '4', name: locale === 'ar' ? 'ضيافة' : 'Hospitality', slug: 'hospitality' }
        ];
        
        setCategories(mockCategories);
      } catch (err) {
        setError('Failed to fetch categories. Please try again later.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [locale]);
  
  return { categories, loading, error };
};

export const useProjectTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - will be replaced with actual API call
        const mockTags: Tag[] = [
          { id: '1', name: locale === 'ar' ? 'حديث' : 'Modern', slug: 'modern' },
          { id: '2', name: locale === 'ar' ? 'ساحلي' : 'Coastal', slug: 'coastal' },
          { id: '3', name: locale === 'ar' ? 'مكتب' : 'Office', slug: 'office' },
          { id: '4', name: locale === 'ar' ? 'شركة' : 'Corporate', slug: 'corporate' },
          { id: '5', name: locale === 'ar' ? 'فاخر' : 'Luxury', slug: 'luxury' },
          { id: '6', name: locale === 'ar' ? 'متجر' : 'Boutique', slug: 'boutique' }
        ];
        
        setTags(mockTags);
      } catch (err) {
        setError('Failed to fetch tags. Please try again later.');
        console.error('Error fetching tags:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTags();
  }, [locale]);
  
  return { tags, loading, error };
}; 