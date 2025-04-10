import Image from 'next/image';
import Link from 'next/link';

export default function PortfolioPage() {
  // Sample projects array - would be fetched from API in production
  const projects = [
    {
      id: 1,
      slug: 'minimalist-apartment',
      title: 'Minimalist Apartment',
      description: 'A clean, modern design that maximizes space and light.',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1974&auto=format&fit=crop'
    },
    {
      id: 2,
      slug: 'gourmet-kitchen',
      title: 'Gourmet Kitchen Remodel',
      description: 'A chef\'s dream kitchen with premium finishes and smart appliances.',
      category: 'Renovation',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932&auto=format&fit=crop'
    },
    {
      id: 3,
      slug: 'creative-agency-office',
      title: 'Creative Agency Office',
      description: 'A versatile workspace designed to foster creativity and collaboration.',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1974&auto=format&fit=crop'
    },
    {
      id: 4,
      slug: 'coastal-villa',
      title: 'Coastal Villa Redesign',
      description: 'A luxurious beach house with panoramic ocean views and comfortable living spaces.',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop'
    },
    {
      id: 5,
      slug: 'urban-loft',
      title: 'Urban Industrial Loft',
      description: 'An eclectic mix of industrial elements and comfort in this urban loft conversion.',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1600607687644-c7ddd0d73f2c?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 6,
      slug: 'boutique-hotel',
      title: 'Boutique Hotel Lobby',
      description: 'A welcoming and distinctive hotel lobby design that creates a memorable first impression.',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  // Sample categories
  const categories = ['All', 'Residential', 'Commercial', 'Renovation'];

  return (
    <div className="py-16 md:py-24">
      <div className="container-custom">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-dark mb-4">
            Our Portfolio
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our diverse collection of interior design projects, ranging from residential spaces to commercial environments.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button 
              key={category}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${category === 'All' ? 'bg-brand-blue text-white' : 'bg-brand-light text-brand-dark hover:bg-brand-blue/10'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div key={project.id} className="group overflow-hidden rounded-lg shadow-md bg-white">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={project.image}
                  alt={project.title} 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 text-brand-dark px-3 py-1 rounded-full text-sm font-medium">
                  {project.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <Link href={`/portfolio/${project.slug}`} className="text-brand-blue font-medium hover:underline">
                  View Project →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 