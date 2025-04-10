import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type ProjectDetailPageProps = {
  params: {
    slug: string;
  };
};

// This would be replaced with a real API call in production
const getProjectBySlug = (slug: string) => {
  // Sample project data
  const projects = {
    'minimalist-apartment': {
      title: 'Minimalist Apartment',
      description: 'A clean, modern design that maximizes space and light in this urban 800 sq ft apartment. The neutral color palette with subtle pops of color creates a calm yet visually interesting environment.',
      client: 'Sarah Johnson',
      location: 'New York, NY',
      area: 800,
      year: 2023,
      services: ['Interior Design', 'Furniture Selection', '3D Visualization'],
      mainImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1974&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    'gourmet-kitchen': {
      title: 'Gourmet Kitchen Remodel',
      description: 'A chef\'s dream kitchen with premium finishes and smart appliances. This kitchen remodel transformed an outdated space into a functional cooking area with plenty of storage and prep space.',
      client: 'Michael Chen',
      location: 'Chicago, IL',
      area: 350,
      year: 2022,
      services: ['Space Planning', 'Kitchen Design', 'Lighting Design'],
      mainImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556912173-3bb406ef7e97?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596079890744-c1a0462d0975?q=80&w=2071&auto=format&fit=crop'
      ]
    },
    'creative-agency-office': {
      title: 'Creative Agency Office',
      description: 'A versatile workspace designed to foster creativity and collaboration. The open-plan layout with distinct zones caters to different work styles and encourages team interaction.',
      client: 'Design Forward Agency',
      location: 'San Francisco, CA',
      area: 2500,
      year: 2023,
      services: ['Commercial Design', 'Space Planning', 'Furniture Selection'],
      mainImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1974&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1533750446969-255bbf191920?q=80&w=2070&auto=format&fit=crop'
      ]
    }
  };

  return slug in projects ? projects[slug as keyof typeof projects] : null;
};

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = getProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }

  return (
    <div className="bg-white py-12 md:py-16">
      <div className="container-custom">
        {/* Project Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-dark mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            {project.description}
          </p>
        </div>

        {/* Main Image */}
        <div className="relative h-[400px] md:h-[600px] rounded-lg overflow-hidden mb-12">
          <Image 
            src={project.mainImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Project Details and Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Details */}
          <div className="md:col-span-1">
            <div className="bg-brand-light p-6 rounded-lg">
              <h2 className="text-2xl font-heading font-bold mb-6 text-brand-dark">Project Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-brand-dark">Client</h3>
                  <p>{project.client}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-brand-dark">Location</h3>
                  <p>{project.location}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-brand-dark">Area</h3>
                  <p>{project.area} sq ft</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-brand-dark">Year</h3>
                  <p>{project.year}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-brand-dark">Services</h3>
                  <ul className="list-disc list-inside">
                    {project.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Gallery */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-heading font-bold mb-6 text-brand-dark">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery.map((image, index) => (
                <div key={index} className="relative h-60 rounded-lg overflow-hidden">
                  <Image 
                    src={image}
                    alt={`${project.title} gallery image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12">
          <Link href="/portfolio" className="btn btn-secondary inline-flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
} 