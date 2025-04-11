import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  image: string;
  alt_text: string;
  is_cover: boolean;
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
        // Build query parameters
        const params = new URLSearchParams();
        
        if (options.category) {
          params.append('category__slug', options.category);
        }
        
        if (options.tag) {
          params.append('tags__slug', options.tag);
        }
        
        if (options.search) {
          params.append('search', options.search);
        }
        
        if (options.featured) {
          params.append('is_featured', 'true');
        }
        
        if (options.limit) {
          params.append('limit', options.limit.toString());
        }
        
        // Add language parameter
        params.append('lang', locale || 'en');
        
        // Fetch data from API
        const response = await axios.get(`${API_BASE_URL}/projects/?${params.toString()}`);
        
        // For Pagination response structure
        let projectsData = response.data;
        if (response.data.results) {
          projectsData = response.data.results;
        }
        
        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching projects:', err);
        // Fallback to mock data if API is not available (for development)
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
        
        // Filter the mock data based on options
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
        setError(locale === 'ar' ? "جاري استخدام بيانات تجريبية - فشل الاتصال بواجهة برمجة التطبيقات" : "Using mock data - API connection failed");
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
        // Add language parameter
        const params = new URLSearchParams();
        params.append('lang', locale || 'en');
        
        // Fetch data from API
        const response = await axios.get(`${API_BASE_URL}/projects/categories/?${params.toString()}`);
        
        // For Pagination response structure
        let categoriesData = response.data;
        if (response.data.results) {
          categoriesData = response.data.results;
        }
        
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Fallback to mock data
        const mockCategories: Category[] = [
          { id: '1', name: locale === 'ar' ? 'سكني' : 'Residential', slug: 'residential' },
          { id: '2', name: locale === 'ar' ? 'تجاري' : 'Commercial', slug: 'commercial' },
          { id: '3', name: locale === 'ar' ? 'تجزئة' : 'Retail', slug: 'retail' },
          { id: '4', name: locale === 'ar' ? 'ضيافة' : 'Hospitality', slug: 'hospitality' }
        ];
        
        setCategories(mockCategories);
        setError(locale === 'ar' ? "جاري استخدام بيانات تجريبية - فشل الاتصال بواجهة برمجة التطبيقات" : "Using mock data - API connection failed");
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
        // Add language parameter
        const params = new URLSearchParams();
        params.append('lang', locale || 'en');
        
        // Fetch data from API
        const response = await axios.get(`${API_BASE_URL}/projects/tags/?${params.toString()}`);
        
        // For Pagination response structure
        let tagsData = response.data;
        if (response.data.results) {
          tagsData = response.data.results;
        }
        
        setTags(tagsData);
      } catch (err) {
        console.error('Error fetching tags:', err);
        // Fallback to mock data
        const mockTags: Tag[] = [
          { id: '1', name: locale === 'ar' ? 'حديث' : 'Modern', slug: 'modern' },
          { id: '2', name: locale === 'ar' ? 'ساحلي' : 'Coastal', slug: 'coastal' },
          { id: '3', name: locale === 'ar' ? 'مكتب' : 'Office', slug: 'office' },
          { id: '4', name: locale === 'ar' ? 'شركة' : 'Corporate', slug: 'corporate' },
          { id: '5', name: locale === 'ar' ? 'فاخر' : 'Luxury', slug: 'luxury' },
          { id: '6', name: locale === 'ar' ? 'متجر' : 'Boutique', slug: 'boutique' }
        ];
        
        setTags(mockTags);
        setError(locale === 'ar' ? "جاري استخدام بيانات تجريبية - فشل الاتصال بواجهة برمجة التطبيقات" : "Using mock data - API connection failed");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTags();
  }, [locale]);
  
  return { tags, loading, error };
}; 