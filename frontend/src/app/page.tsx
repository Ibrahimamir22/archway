import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-brand-light py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-brand-dark mb-6">
                Transform Your <span className="text-brand-blue-light">Space</span>, Elevate Your Life
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Archway Design brings your interior vision to life with exceptional design, 3D visualization, and personalized consultations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/portfolio" className="btn btn-primary">
                  View Our Work
                </Link>
                <Link href="/contact" className="btn btn-secondary">
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl animate-fade-in">
              <Image 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2400&auto=format&fit=crop"
                alt="Modern interior design" 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive range of interior design services to meet your every need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Cards */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Residential Design</h3>
              <p className="text-gray-600 mb-4">
                Transform your home into a personalized sanctuary that reflects your style and meets your needs.
              </p>
              <Link href="/services/residential" className="text-brand-blue-light font-medium hover:underline">
                Learn More →
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Commercial Design</h3>
              <p className="text-gray-600 mb-4">
                Create functional and inspiring workspaces that enhance productivity and impress clients.
              </p>
              <Link href="/services/commercial" className="text-brand-blue-light font-medium hover:underline">
                Learn More →
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">3D Visualization</h3>
              <p className="text-gray-600 mb-4">
                Experience your design before construction with realistic 3D renders and virtual walkthroughs.
              </p>
              <Link href="/services/3d-visualization" className="text-brand-blue-light font-medium hover:underline">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="bg-brand-light py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore some of our recent work and get inspired for your next project.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project cards */}
            <div className="group overflow-hidden rounded-lg shadow-md bg-white">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1974&auto=format&fit=crop"
                  alt="Minimalist Living Room" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Minimalist Apartment</h3>
                <p className="text-gray-600 mb-4">A clean, modern design that maximizes space and light.</p>
                <Link href="/portfolio/minimalist-apartment" className="text-brand-blue-light font-medium hover:underline">
                  View Project →
                </Link>
              </div>
            </div>
            
            <div className="group overflow-hidden rounded-lg shadow-md bg-white">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932&auto=format&fit=crop"
                  alt="Luxury Kitchen" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Gourmet Kitchen Remodel</h3>
                <p className="text-gray-600 mb-4">A chef's dream kitchen with premium finishes and smart appliances.</p>
                <Link href="/portfolio/gourmet-kitchen" className="text-brand-blue-light font-medium hover:underline">
                  View Project →
                </Link>
              </div>
            </div>
            
            <div className="group overflow-hidden rounded-lg shadow-md bg-white">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1974&auto=format&fit=crop"
                  alt="Corporate Office" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Creative Agency Office</h3>
                <p className="text-gray-600 mb-4">A versatile workspace designed to foster creativity and collaboration.</p>
                <Link href="/portfolio/creative-agency-office" className="text-brand-blue-light font-medium hover:underline">
                  View Project →
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/portfolio" className="btn btn-primary">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-blue-light py-16 md:py-20">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">Ready to Transform Your Space?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact us today to schedule a consultation and take the first step toward your dream interior.
          </p>
          <Link href="/contact" className="btn bg-white text-brand-blue hover:bg-blue-50">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
