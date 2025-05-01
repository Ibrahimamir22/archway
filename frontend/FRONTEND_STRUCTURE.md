# Archway Project Structure (Next.js with App Router & src/ Directory)

This document outlines the current project structure for the Archway frontend, utilizing the Next.js `app` Router, a `src/` directory, and path-based internationalization with `next-intl`.

## Current Directory Structure

```
.
├── frontend/
│   ├── src/
│   │   ├── app/                            # Main application directory
│   │   │   ├── [locale]/                   # Dynamic locale segment (e.g., /en, /ar)
│   │   │   │   ├── page.tsx                # Home page --> /[locale]/
│   │   │   │   ├── layout.tsx              # Locale-specific root layout with font configurations
│   │   │   │   ├── not-found.tsx           # Locale-specific 404 page
│   │   │   │   ├── providers.tsx           # Client providers wrapper
│   │   │   │   ├── (marketing)/            # Route group for marketing pages
│   │   │   │   │   ├── about/              # --> /[locale]/about
│   │   │   │   │   │   ├── page.tsx        # About page server component
│   │   │   │   │   │   └── AboutClient.tsx # About page client component
│   │   │   │   │   ├── terms/              # --> /[locale]/terms
│   │   │   │   │   │   └── page.tsx        # Terms page component
│   │   │   │   │   ├── faq/                # --> /[locale]/faq
│   │   │   │   │   │   └── page.tsx        # FAQ page component
│   │   │   │   │   └── contact/            # --> /[locale]/contact
│   │   │   │   │       └── page.tsx        # Contact page component
│   │   │   │   ├── (portfolio)/            # Route group for portfolio features
│   │   │   │   │   ├── portfolio/
│   │   │   │   │   │   ├── page.tsx        # Portfolio listing page --> /[locale]/portfolio
│   │   │   │   │   │   ├── FilterWrapper.tsx  # Client component for portfolio filters
│   │   │   │   │   │   └── [slug]/         # --> /[locale]/portfolio/[slug]
│   │   │   │   │   │       ├── page.tsx    # Portfolio detail page
│   │   │   │   │   │       └── ProjectDetailClientLogic.tsx  # Client component for details page
│   │   │   │   ├── (services)/             # Route group for services features
│   │   │   │   │   ├── services/           
│   │   │   │   │   │   ├── page.tsx        # --> /[locale]/services
│   │   │   │   │   │   ├── services-client.tsx  # Client component for services listing
│   │   │   │   │   │   └── [slug]/         # --> /[locale]/services/[slug]
│   │   │   │   │   │       ├── page.tsx    # Service detail page
│   │   │   │   │   │       └── service-detail-client.tsx  # Client component for service details
│   │   │   │   └── (auth)/                 # Route group for authentication pages
│   │   │   │       ├── login/              # --> /[locale]/login
│   │   │   │       │   └── page.tsx        # Login page
│   │   │   │       └── signup/             # --> /[locale]/signup
│   │   │   │           └── page.tsx        # Signup page
│   │   │   │
│   │   │   ├── api/                        # API Route Handlers
│   │   │   │   ├── contact/                # Contact form API handlers
│   │   │   │   │   ├── route.ts            # Contact form API route
│   │   │   │   │   └── validation.ts       # Contact form validation logic
│   │   │   │   ├── contact-info/           # Contact information API
│   │   │   │   │   ├── route.ts            # Contact info API route
│   │   │   │   │   └── defaultData.ts      # Default contact information
│   │   │   │   ├── mock/                   # Mock data endpoints
│   │   │   │   │   ├── route.ts            # Main mock API route
│   │   │   │   │   └── marketing/          # Marketing mock data
│   │   │   │   │       ├── about/          # About page mock data
│   │   │   │   │       │   └── route.ts    # About page API
│   │   │   │   │       ├── company-stats/  # Company statistics mock data
│   │   │   │   │       │   └── route.ts    # Stats API
│   │   │   │   │       ├── company-history/ # Company history mock data
│   │   │   │   │       │   └── route.ts    # History API
│   │   │   │   │       ├── core-values/    # Core values mock data
│   │   │   │   │       │   └── route.ts    # Core values API
│   │   │   │   │       ├── team-members/   # Team members mock data
│   │   │   │   │       │   └── route.ts    # Team members API
│   │   │   │   │       └── testimonials/   # Testimonials mock data
│   │   │   │   │           └── route.ts    # Testimonials API
│   │   │   │   ├── portfolio/              # Portfolio-related APIs
│   │   │   │   │   ├── route.ts            # Portfolio listing API
│   │   │   │   │   ├── defaultData.ts      # Default portfolio data
│   │   │   │   │   └── [id]/               # Portfolio item by ID
│   │   │   │   │       └── route.ts        # Single portfolio item API
│   │   │   │   ├── faqs/                   # FAQs API endpoints
│   │   │   │   │   ├── route.ts            # Main FAQs API route
│   │   │   │   │   ├── languages/          # Language-specific FAQs
│   │   │   │   │   │   └── route.ts        # Language options API
│   │   │   │   │   └── by-category/        # Category-specific FAQs
│   │   │   │   │       └── route.ts        # FAQs by category API
│   │   │   │   ├── footer/                 # Footer content API
│   │   │   │   │   └── route.ts            # Footer data API route
│   │   │   │   └── image-proxy/            # Image proxy API
│   │   │   │       └── route.ts            # Image proxy API route
│   │   │   │
│   │   │   ├── layout.tsx                  # Absolute Root layout (minimal HTML/body)
│   │   │   ├── not-found.tsx               # Root 404 page
│   │   │   ├── page.tsx                    # Root page (typically redirects to localized route)
│   │   │   └── favicon.ico                 # Site favicon
│   │   │
│   │   ├── components/                     # Reusable UI components
│   │   │   ├── README.md                   # Components documentation
│   │   │   ├── common/                     # General-purpose components
│   │   │   │   ├── Button/                  # Button components
│   │   │   │   │   └── index.tsx            # Button component
│   │   │   │   ├── ErrorMessage/            # Error message components
│   │   │   │   │   └── index.tsx            # Error message component
│   │   │   │   ├── Footer/                  # Footer components
│   │   │   │   │   ├── Footer.tsx           # Main footer component
│   │   │   │   │   ├── FooterSection.tsx    # Section component for footer
│   │   │   │   │   ├── CompanyInfo.tsx      # Company information component
│   │   │   │   │   ├── ContactInfo.tsx      # Contact information component
│   │   │   │   │   ├── NewsletterForm.tsx   # Newsletter subscription form
│   │   │   │   │   ├── SocialMediaLink.tsx  # Social media link component
│   │   │   │   │   ├── README.md            # Footer documentation
│   │   │   │   │   └── index.tsx            # Footer barrel file
│   │   │   │   ├── FormInput/               # Form input components
│   │   │   │   │   └── index.tsx            # Form input component
│   │   │   │   ├── LanguageSwitcher/        # Language switcher component
│   │   │   │   │   └── index.tsx            # Language switcher component
│   │   │   │   ├── LoadingSpinner/          # Loading spinner components
│   │   │   │   │   └── index.tsx            # Loading spinner component
│   │   │   │   ├── LoadingState/            # Loading state components
│   │   │   │   │   └── index.tsx            # Loading state component
│   │   │   │   ├── Modal/                   # Modal components
│   │   │   │   │   └── index.tsx            # Modal component
│   │   │   │   ├── Navbar/                  # Navigation components
│   │   │   │   │   ├── Navbar.tsx           # Main navigation component
│   │   │   │   │   └── index.tsx            # Navigation barrel file
│   │   │   │   ├── OptimizedImage/          # Image optimization components
│   │   │   │   │   ├── OptimizedImage.tsx   # Optimized image component
│   │   │   │   │   └── index.tsx            # Image component barrel file
│   │   │   │   ├── PrefetchLink/            # Link prefetching components
│   │   │   │   │   ├── PrefetchLink.tsx     # Prefetch-enabled link component
│   │   │   │   │   └── index.tsx            # Prefetch link barrel file
│   │   │   │   └── ServiceLink/             # Service link components
│   │   │   │       └── index.tsx            # Service link component
│   │   │   ├── portfolio/                  # Portfolio-specific components
│   │   │   │   ├── card/                   # Portfolio card components
│   │   │   │   │   ├── ProjectCard.tsx     # Main card wrapper component
│   │   │   │   │   ├── ProjectCardImage.tsx # Image section with hover effects
│   │   │   │   │   └── ProjectCardContent.tsx # Content section with text
│   │   │   │   ├── detail/                 # Portfolio detail components
│   │   │   │   │   ├── ProjectHeader.tsx   # Server component for project header
│   │   │   │   │   ├── ProjectHeader.client.tsx # Client component for project header
│   │   │   │   │   ├── ProjectDetails.tsx  # Server component for project details
│   │   │   │   │   ├── ProjectDetails.client.tsx # Client component for project details
│   │   │   │   │   └── ProjectGallery.tsx  # Project gallery component
│   │   │   │   ├── list/                   # Portfolio listing components
│   │   │   │   │   ├── ProjectGrid.tsx     # Server component for project grid
│   │   │   │   │   ├── ProjectGrid.client.tsx # Client component for project grid
│   │   │   │   │   ├── ProjectGridLoader.tsx # Loading state for project grid
│   │   │   │   │   ├── ProjectFilters.tsx  # Project filters component
│   │   │   │   │   └── PlaceholderProjects.tsx # Placeholder projects component
│   │   │   │   ├── common/                 # Common portfolio components
│   │   │   │   │   └── DirectProjectImage.tsx # Direct project image component
│   │   │   │   └── REFACTORING_REPORT.md   # Documentation of the portfolio refactoring
│   │   │   │
│   │   │   ├── services/                   # Service-specific components
│   │   │   │   ├── card/                   # Modular service card components
│   │   │   │   │   ├── ServiceCard.tsx     # Main card wrapper component
│   │   │   │   │   ├── ServiceCardImage.tsx # Image section with hover effects
│   │   │   │   │   └── ServiceCardContent.tsx # Content section with title and desc
│   │   │   │   ├── common/                 # Common service utilities
│   │   │   │   │   ├── ServiceImage.tsx    # Shared image component with fallbacks
│   │   │   │   │   ├── ServiceLink.tsx     # Service link component
│   │   │   │   │   └── DirectServiceImage.tsx # Direct service image wrapper
│   │   │   │   ├── icons/                  # Service icons
│   │   │   │   │   ├── ServiceIcons.tsx    # Service icons collection
│   │   │   │   │   ├── ServiceIcon.tsx     # Individual service icon component
│   │   │   │   │   └── index.tsx           # Icons barrel file
│   │   │   │   ├── detail/                 # Service detail components
│   │   │   │   │   ├── ServiceDetail.tsx   # Server component for service detail
│   │   │   │   │   ├── ServiceDetail.client.tsx # Client component for service detail
│   │   │   │   │   └── index.tsx           # Detail barrel file
│   │   │   │   ├── list/                   # Service list components
│   │   │   │   │   ├── ServiceGrid.tsx     # Server component for service grid
│   │   │   │   │   ├── ServiceGrid.client.tsx # Client component for service grid
│   │   │   │   │   ├── ServiceGridLoader.tsx # Loading state for service grid
│   │   │   │   │   ├── ServiceFilters.tsx  # Service filters component
│   │   │   │   │   └── index.tsx           # List barrel file
│   │   │   │   └── REFACTORING_REPORT.md   # Documentation of the services refactoring
│   │   │   │
│   │   │   ├── marketing/                  # Marketing components
│   │   │   │   ├── common/                 # Common marketing components
│   │   │   │   │   ├── index.ts            # Common components barrel file
│   │   │   │   │   └── SectionHeader.tsx   # Reusable section header component
│   │   │   │   │
│   │   │   │   ├── about/                  # About page components
│   │   │   │   │   ├── index.ts            # About components barrel file
│   │   │   │   │   ├── AboutHero.tsx       # Hero section component
│   │   │   │   │   ├── CoreValues.tsx      # Core values section component
│   │   │   │   │   ├── FAQTeaser.tsx       # FAQ preview section component
│   │   │   │   │   ├── MissionVision.tsx   # Mission and vision section
│   │   │   │   │   ├── OptimizedAboutClient.tsx # Optimized client-side about component
│   │   │   │   │   ├── TeamSection.ts      # Team section component
│   │   │   │   │   ├── Testimonials.tsx    # Testimonials section component
│   │   │   │   │   ├── ClientLogos/        # Client logos components
│   │   │   │   │   │   ├── index.ts        # Client logos barrel file
│   │   │   │   │   │   ├── ClientLogoCard.tsx # Individual logo card component
│   │   │   │   │   │   ├── ClientLogosSection.tsx # Logos section wrapper
│   │   │   │   │   │   └── LogoItem.tsx    # Individual logo item component
│   │   │   │   │   ├── TeamSection/        # Team section components
│   │   │   │   │   │   ├── index.ts        # Team section barrel file
│   │   │   │   │   │   ├── TeamMemberCard.tsx # Individual team member card
│   │   │   │   │   │   ├── TeamSection.tsx # Team section wrapper component
│   │   │   │   │   │   └── TeamGrid.tsx    # Grid layout for team members
│   │   │   │   │   ├── Stats/              # Statistics components
│   │   │   │   │   │   ├── index.ts        # Stats barrel file
│   │   │   │   │   │   ├── StatsSection.tsx # Stats section wrapper
│   │   │   │   │   │   ├── StatCard.tsx    # Individual stat card component
│   │   │   │   │   │   └── AnimatedCounter.tsx # Animated number counter
│   │   │   │   │   ├── CompanyHistory/     # Company history components
│   │   │   │   │   │   ├── index.ts        # Company history barrel file
│   │   │   │   │   │   ├── CompanyHistory.tsx # History section wrapper
│   │   │   │   │   │   ├── TimelineDivider.tsx # Timeline visual divider
│   │   │   │   │   │   └── TimelineItem.tsx # Individual timeline item
│   │   │   │   │   ├── NavLinks/           # Navigation links components
│   │   │   │   │   │   ├── index.tsx       # Navigation links barrel file
│   │   │   │   │   │   └── AboutNavLinks.tsx # About page navigation links
│   │   │   │   │   └── Testimonials/       # Testimonials components
│   │   │   │   │       ├── index.ts        # Testimonials barrel file
│   │   │   │   │       ├── TestimonialCard.tsx # Individual testimonial card
│   │   │   │   │       ├── TestimonialGrid.tsx # Grid layout for testimonials
│   │   │   │   │       └── TestimonialsSection.tsx # Testimonials section wrapper
│   │   │   │   │
│   │   │   │   ├── contact/                # Contact page components
│   │   │   │   │   ├── ContactForm.tsx     # Contact form component
│   │   │   │   │   ├── ContactInfo.tsx     # Contact information component
│   │   │   │   │   ├── ContactInfo.client.tsx # Client-side contact info component
│   │   │   │   │   ├── form/               # Modular contact form components
│   │   │   │   │   │   ├── FormField.tsx   # Input field component
│   │   │   │   │   │   ├── TextareaField.tsx # Textarea component
│   │   │   │   │   │   ├── SubmitButton.tsx # Submit button component
│   │   │   │   │   │   ├── StatusMessage.tsx # Form status message component
│   │   │   │   │   │   ├── PrivacyNote.tsx # Privacy note component
│   │   │   │   │   │   ├── MapDisplay.tsx  # Map display component
│   │   │   │   │   │   ├── SocialLinks.tsx # Social links component
│   │   │   │   │   │   ├── BusinessHours.tsx # Server business hours component
│   │   │   │   │   │   ├── BusinessHours.client.tsx # Client business hours component
│   │   │   │   │   │   ├── ContactItem.tsx # Contact item component
│   │   │   │   │   │   └── index.ts        # Form components barrel file
│   │   │   │   │   └── index.ts            # Contact components barrel file
│   │   │   │   │
│   │   │   │   └── faq/                   # FAQ page components
│   │   │   │       ├── FAQ.tsx            # Server FAQ component
│   │   │   │       ├── FAQ.client.tsx     # Client FAQ component
│   │   │   │       ├── FAQServer.tsx      # Server-specific FAQ component
│   │   │   │       ├── FAQCategory.tsx    # Server category component
│   │   │   │       ├── FAQCategory.client.tsx # Client category component
│   │   │   │       ├── FAQItem.tsx        # Expandable FAQ item
│   │   │   │       ├── FAQSearch.tsx      # Search component
│   │   │   │       └── index.ts           # FAQ components barrel file
│   │   │   │
│   │   │   ├── auth/                       # Authentication components
│   │   │   │   ├── LoginForm.tsx          # Login form component
│   │   │   │   ├── SignupForm.tsx         # Signup form component
│   │   │   │   └── index.ts               # Auth components barrel file
│   │   │   ├── home/                       # Homepage components
│   │   │   │   ├── HomeClient.tsx          # Client-side home component
│   │   │   │   └── index.ts                # Home components barrel file
│   │   │   ├── admin/                      # Admin dashboard components (empty/placeholder)
│   │   │   ├── chatbot/                    # Chatbot components (empty/placeholder)
│   │   │   ├── 3d/                         # 3D/360 view components (empty/placeholder)
│   │   │   ├── ui/                         # Base UI primitives
│   │   │   │   ├── Pattern.tsx             # Pattern background component
│   │   │   │   ├── LoadingSpinner.tsx      # Loading spinner component
│   │   │   │   ├── LoadingState.tsx        # Loading state wrapper component
│   │   │   │   ├── ErrorMessage.tsx        # Error message component
│   │   │   │   ├── ScrollReveal.tsx        # Animation reveal component
│   │   │   │   ├── skeleton.tsx            # Skeleton loading component
│   │   │   │   └── index.ts                # UI components barrel file
│   │   │   ├── content/                    # CMS content components (empty/placeholder)
│   │   │   └── providers/                  # Provider components
│   │   │       └── Providers.tsx           # Main providers wrapper
│   │   │
│   │   ├── lib/                            # Core logic and utilities
│   │   │   ├── api.ts                      # Legacy API file (for compatibility)
│   │   │   ├── hooks.ts                    # Legacy hooks file (for compatibility)
│   │   │   ├── images.ts                   # Legacy image utilities (for compatibility)
│   │   │   ├── config.ts                   # Configuration settings
│   │   │   ├── imageLoader.ts              # Image loading and optimization utilities
│   │   │   ├── index.ts                    # Main lib barrel file
│   │   │   ├── api/                        # API functionality
│   │   │   │   ├── core.ts                 # Core API functions
│   │   │   │   ├── fetcher.ts              # API fetching utilities
│   │   │   │   ├── urls.ts                 # URL utility functions
│   │   │   │   ├── portfolio.ts            # Portfolio API functions
│   │   │   │   ├── services.ts             # Services API functions
│   │   │   │   ├── contact.ts              # Contact form API functions
│   │   │   │   ├── faq.ts                  # FAQ API functions
│   │   │   │   ├── footer.ts               # Footer API functions
│   │   │   │   └── index.ts                # API barrel file
│   │   │   ├── hooks/                      # React hooks
│   │   │   │   ├── index.ts                # Main hooks barrel file with namespace exports
│   │   │   │   ├── auth/                   # Authentication hooks
│   │   │   │   │   ├── useAuth.ts          # Authentication hook
│   │   │   │   │   └── index.ts            # Auth hooks barrel file
│   │   │   │   ├── footer/                 # Footer-related hooks
│   │   │   │   │   ├── useFooter.ts        # Footer customization hook
│   │   │   │   │   └── index.ts            # Footer hooks barrel file
│   │   │   │   ├── i18n/                   # Internationalization hooks
│   │   │   │   │   ├── useLanguagePrefetch.ts # Language prefetching hook
│   │   │   │   │   └── index.ts            # i18n hooks barrel file
│   │   │   │   ├── portfolio/              # Portfolio hooks
│   │   │   │   │   ├── types.ts            # Portfolio hook types
│   │   │   │   │   ├── useProjects.ts      # Basic projects hook
│   │   │   │   │   ├── useProjectList.ts   # Project listing hook
│   │   │   │   │   ├── useProjectDetail.ts # Project detail hook
│   │   │   │   │   ├── useProjectFilters.ts # Project filters hook
│   │   │   │   │   ├── useProjectTags.ts   # Project tags hook
│   │   │   │   │   ├── useProjectCategories.ts # Project categories hook
│   │   │   │   │   ├── useProjectImages.tsx # Project images hook
│   │   │   │   │   └── index.ts            # Portfolio hooks barrel file
│   │   │   │   ├── marketing/              # Marketing hooks
│   │   │   │   │   ├── useNewsletterSubscription.ts # Newsletter subscription hook
│   │   │   │   │   ├── index.ts            # Marketing hooks barrel file
│   │   │   │   │   ├── about/              # About page hooks 
│   │   │   │   │   │   ├── useAboutData.ts # Main about page data hook
│   │   │   │   │   │   ├── useCoreValues.ts # Company core values hook
│   │   │   │   │   │   ├── useCompanyStats.ts # Company statistics hook
│   │   │   │   │   │   ├── useTeamMembers.ts # Team members data hook
│   │   │   │   │   │   ├── useTestimonials.ts # Testimonials data hook
│   │   │   │   │   │   ├── useClientLogos.ts # Client logos hook
│   │   │   │   │   │   ├── useCompanyHistory.ts # Company history timeline hook
│   │   │   │   │   │   └── index.ts        # About hooks barrel file
│   │   │   │   │   ├── contact/            # Contact-related hooks
│   │   │   │   │   │   ├── useContactForm.ts # Contact form state/validation hook
│   │   │   │   │   │   ├── useContactInfo.ts # Contact info fetch hook
│   │   │   │   │   │   ├── useClipboard.ts # Clipboard utility hook
│   │   │   │   │   │   └── index.ts        # Contact hooks barrel file
│   │   │   │   │   └── faq/                # FAQ-related hooks
│   │   │   │   │       ├── useFAQs.ts      # FAQ data fetching hook
│   │   │   │   │       ├── useFAQPrefetch.ts # FAQ prefetching hook
│   │   │   │   │       ├── useFAQLanguages.ts # FAQ languages hook
│   │   │   │   │       └── index.ts        # FAQ hooks barrel file
│   │   │   │   ├── services/               # Services hooks
│   │   │   │   │   ├── types.ts            # Service type definitions
│   │   │   │   │   ├── useServiceDetail.ts # Hook for fetching service details
│   │   │   │   │   ├── useServiceList.ts   # Hook for fetching service list
│   │   │   │   │   ├── useServices.ts      # Main services hook
│   │   │   │   │   ├── useServicesList.ts  # Hook for services listing
│   │   │   │   │   ├── useServiceCategories.ts # Hook for service categories
│   │   │   │   │   └── index.ts            # Service hooks exports
│   │   │   │   ├── ui/                     # UI-related hooks
│   │   │   │   │   ├── useIntersectionObserver.ts # Intersection observer hook
│   │   │   │   │   ├── usePrefetch.ts      # UI-specific prefetching hook
│   │   │   │   │   └── index.ts            # UI hooks barrel file
│   │   │   │   └── utils/                  # Utility hooks
│   │   │   │       ├── useApi.ts           # API utilities hook
│   │   │   │       ├── errorHandling.ts    # Error handling utilities
│   │   │   │       ├── usePrefetch.ts      # Resource prefetching hook
│   │   │   │       └── index.ts            # Utils hooks barrel file
│   │   │   ├── fixtures/                   # Mock data for development
│   │   │   │   ├── index.ts                # Fixtures barrel file
│   │   │   │   ├── portfolio/              # Portfolio fixtures
│   │   │   │   │   └── projects.ts         # Mock project data
│   │   │   │   └── footer/                 # Footer fixtures
│   │   │   │       ├── footerData.ts       # Mock footer data
│   │   │   │       └── index.ts            # Footer fixtures barrel file
│   │   │   ├── images/                     # Image utilities
│   │   │   │   └── index.ts                # Image utility functions with preloading
│   │   │   └── utils/                      # General utilities
│   │   │       ├── api.ts                  # API utility functions
│   │   │       ├── categoryDisplay.ts      # Category display utilities
│   │   │       ├── footerUtils.ts          # Footer utility functions
│   │   │       ├── formatting.ts           # Formatting utilities
│   │   │       ├── prefetch.ts             # Prefetching utilities
│   │   │       ├── socialMediaColors.ts    # Social media color utilities
│   │   │       └── index.ts                # Utils barrel file
│   │   │
│   │   ├── styles/                         # Styling configuration
│   │   │   └── globals.css                 # Global CSS
│   │   │
│   │   ├── messages/                       # i18n language files
│   │   │   ├── en.json                     # English translations
│   │   │   └── ar.json                     # Arabic translations
│   │   │
│   │   ├── types/                          # TypeScript types
│   │   │   ├── README.md                   # Types documentation
│   │   │   ├── index.ts                    # Types barrel file
│   │   │   ├── portfolio/                  # Portfolio types
│   │   │   │   ├── project.ts              # Project type definitions
│   │   │   │   └── index.ts                # Portfolio types barrel file
│   │   │   ├── services/                   # Services types
│   │   │   │   └── index.d.ts              # Service type definitions
│   │   │   ├── marketing/                  # Marketing-related types
│   │   │   │   ├── about.ts                # About page type definitions
│   │   │   │   ├── contact.ts              # Contact form and info types
│   │   │   │   ├── faq.ts                  # FAQ types
│   │   │   │   └── index.ts                # Marketing types barrel file
│   │   │   ├── api/                        # API types (empty/placeholder)
│   │   │   ├── pages/                      # Page-specific types (empty/placeholder)
│   │   │   ├── vendor/                     # Third-party library types (empty/placeholder)
│   │   │   └── @types/                     # Module declarations
│   │   │       ├── utility-types.d.ts      # Utility type definitions
│   │   │       ├── next-environment.d.ts   # Next.js environment declarations
│   │   │       ├── next-env.d.ts           # Next.js env declarations
│   │   │       └── declarations.d.ts       # General type declarations
│   │   │
│   │   └── docs/                           # Documentation
│   │       └── CLEANUP_PLAN.md             # Migration documentation
│   │
│   ├── public/                             # Static assets
│   │   ├── images/                         # Image assets
│   │   │   ├── placeholders/               # Placeholder images
│   │   │   ├── team/                       # Team member images
│   │   │   ├── projects/                   # Project image assets
│   │   │   ├── logo.svg                    # Site logo
│   │   │   ├── Archway.png                 # Archway logo/brand image
│   │   │   ├── hero-bg.jpg                 # Hero section background
│   │   │   ├── placeholder.jpg             # Generic placeholder image
│   │   │   ├── service-placeholder.jpg     # Service placeholder image
│   │   │   ├── project-1.jpg               # Sample project image 1
│   │   │   ├── project-2.jpg               # Sample project image 2
│   │   │   ├── project-3.jpg               # Sample project image 3
│   │   │   ├── project-4.jpg               # Sample project image 4
│   │   │   └── project-5.jpg               # Sample project image 5
│   │   ├── icons/                          # SVG icons
│   │   │   ├── next.svg                    # Next.js logo icon
│   │   │   ├── vercel.svg                  # Vercel logo icon
│   │   │   ├── window.svg                  # Window icon
│   │   │   ├── file.svg                    # File icon
│   │   │   └── globe.svg                   # Globe icon
│   │   ├── fonts/                          # Font files (preloaded in root layout)
│   │   │   └── inter-var-latin.woff2       # Inter font file
│   │   └── robots.txt                      # SEO configuration
│   │
│   ├── docs/                               # Project documentation
│   │   └── CLEANUP_PLAN.md                 # Migration documentation
│   ├── middleware.ts                       # Next.js middleware for i18n
│   ├── i18n.ts                             # next-intl configuration
│   ├── next.config.js                      # Next.js configuration
│   ├── tsconfig.json                       # TypeScript configuration
│   ├── tailwind.config.ts                  # Tailwind CSS configuration
│   ├── postcss.config.mjs                  # PostCSS configuration
│   ├── eslint.config.mjs                   # ESLint configuration
│   ├── Dockerfile                          # Docker configuration
│   ├── .env                                # Environment variables
│   └── .env.local                          # Local environment variables
├── backend/                               # Django backend
├── docker-compose.yml                     # Docker compose for development
├── docker-compose.prod.yml                # Docker compose for production
├── wireframes.md                          # Wireframes documentation
├── erd.md                                 # Entity Relationship Diagram
├── api-spec.md                            # API specifications
└── README.md                              # Project README
```

## Development Status

The following indicates the implementation status of key features:

1. ✅ **Core Structure**
   - Implemented Next.js app Router with src/ directory
   - Set up internationalization with next-intl
   - Created necessary routing structure for all main sections

2. ✅ **Component Organization**
   - Implemented domain-specific component folders
   - Created reusable UI components with consistent naming
   - Refactored larger components into smaller, focused ones

3. ✅ **API Infrastructure**
   - Implemented Route Handlers for core functionality
   - Created data fetching utilities and hooks
   - Set up image proxy and form submission handlers

4. ✅ **Performance Optimizations**
   - Added PrefetchLink component for route and data prefetching on hover
   - Implemented image preloading utilities
   - Added font preloading in root layout
   - Enhanced navigation with hover-based prefetching

5. 🔲 **Admin Dashboard**
   - Created placeholder structure for admin components
   - Implementation of admin dashboard routes pending
   - Admin API endpoints need to be created

6. 🔲 **Preview Mode**
   - Add CMS preview capabilities with `(preview)` route group
   - Implement preview-specific components and layouts

7. 🔲 **Server Actions**
   - Add `lib/actions/` directory for server actions
   - Implement form submissions using server actions

8. 🔲 **Testing Infrastructure**
   - Add `tests/` directory with testing framework
   - Create component, hook, and API tests

9. 🔲 **Advanced Features**
   - Placeholder structure for 3D visualization components (directory created)
   - Chatbot functionality structure in place (directory created)
   - Basic UI primitives added (Pattern.tsx component)
   - Animations and transitions to be implemented

## Recent Performance Optimizations

The application has been optimized for better performance with the following enhancements:

1. ✅ **Resource Prefetching**
   - Created `usePrefetch` hook for routes, data, and images
   - Implemented `PrefetchLink` component as a drop-in replacement for Next.js Link
   - Added prefetching on hover to navigation and card components

2. ✅ **Image Optimization**
   - Enhanced image preloading with utilities in `lib/imageLoader.ts`
   - Added caching to prevent redundant preloading
   - Optimized project cards to use prefetching for detail pages

3. ✅ **Font Preloading**
   - Added font preloading in root layout for critical web fonts
   - Ensures fonts are ready when components render

4. ✅ **Navigation Enhancements**
   - Updated Navbar to prefetch both routes and associated data
   - Added data prefetching for project cards when hovering
   - Reduced delay for prefetching on frequently used components

5. ✅ **Service Cards Prefetching**
   - Enhanced `ServiceCard` to prefetch service details when hovering
   - Implemented related services prefetching for category-based browsing
   - Added image preloading for visible and neighboring services

6. ✅ **FAQ Content Preloading**
   - Optimized FAQ components to prerender answer content on hover
   - Added `useFAQPrefetch` hook for intelligent category prefetching
   - Implemented hover-based category data loading for faster transitions
   - Added client-side hydration protection to prevent rendering errors
   - Implemented low-priority fetch requests to avoid blocking critical resources
   - Added prefetch request detection with custom headers

7. ✅ **Gallery Image Preloading**
   - Added smart preloading for gallery images in project details
   - Implemented hover-based image prefetching for thumbnails
   - Added tracking to prevent redundant image preloading

8. ✅ **Footer Link Prefetching**
   - Enhanced footer links with data and route prefetching
   - Added intelligent prefetching based on link type and context
   - Implemented prefetch delay configuration for optimal performance

9. ✅ **Language Switching Optimization**
   - Implemented `useLanguagePrefetch` hook for optimized language switching
   - Added prefetching for translations when hovering language selector
   - Implemented delayed background loading for translations on initial page load
   - Added a loading indicator during language changes for better user experience
   - Prevented hydration mismatches with client-side rendering protections

## Recent Refactoring: Contact Components

The contact form section has been refactored to follow best practices:

1. ✅ **Component Breakdown**
   - Split `ContactForm.tsx` into smaller, focused components
   - Created reusable form field components
   - Separated UI concerns from logic

2. ✅ **Custom Hooks**
   - Created `useContactForm` for form state management and validation
   - Created `useContactInfo` for contact information fetching and clipboard handling
   - Placed hooks in domain-specific locations following project structure

3. ✅ **Type Safety**
   - Added comprehensive type definitions in `types/marketing/contact.ts`
   - Improved props interfaces for better component integration

4. ✅ **Improved Organization**
   - Applied folder structure that aligns with the rest of the project
   - Made components more maintainable and extensible

## Backend Structure

The backend is implemented using Django and follows a modular approach with apps organized by functionality. Detailed backend structure can be found in the `backend/BACKEND_STRUCTURE.md` file. The main components include:

- `apps/` - Django apps for different functionality domains
- `interior_platform/` - Main project settings and configuration
- `utils/` - Shared utility functions and helpers
- `templates/` - Django templates (if used alongside API functionality)
- `static/` and `media/` - Static files and user-uploaded content
- `requirements.txt` - Python dependencies for the project

## Performance Optimization Plan

This section outlines the complete performance optimization strategy for the Archway frontend, prioritized by impact and implementation complexity. Items marked with ✅ have been completed, while those with 🔲 are still pending.

### Critical Path Optimizations (Highest Priority)

1. ✅ **Link Prefetching Implementation**
   - Created reusable `PrefetchLink` component for navigation prefetching
   - Implemented `usePrefetch` hook for route, data, and image prefetching
   - Applied to main navigation to reduce perceived page load times

2. ✅ **Image Loading Strategy**
   - Added proper image preloading utilities in `lib/imageLoader.ts`
   - Fixed hydration errors by separating client-side image logic
   - Implemented lazy loading with priority settings for critical images

3. ✅ **Hydration Error Prevention**
   - Added client-side detection to prevent mismatches
   - Implemented simplified server-side rendering for dynamic components
   - Fixed webpack bundling issues with module imports

4. ✅ **Service Card Prefetching**
   - Enhanced cards with related service preloading
   - Added hover-based prefetching for details pages
   - Implemented image preloading for cross-category browsing

5. ✅ **FAQ Content Preloading**
   - Created custom `useFAQPrefetch` hook for category prefetching
   - Optimized content loading with hidden DOM placeholders
   - Improved transition smoothness with prerendered content

6. ✅ **Language Switching Optimization**
   - Implemented translation prefetching for faster language switching
   - Added delayed background loading for alternative locale content
   - Improved UX with loading indicators during transitions

7. 🟡 **Server Component Migration**
   - Started converting applicable components to React Server Components
   - Completed 5/8 priority migrations: ProjectGrid, ProjectHeader, ProjectDetails, ServiceGrid, and ServiceDetail
   - Created server-side data fetching utilities in api/ directory
   - Established client/server component separation pattern
   - Added thin server components that delegate to client components for interactivity
   - Improved localization handling with explicit locale passing
   - Enhanced pagination patterns with server-rendered first page
   - Standardized component structure across portfolio and services domains

8. 🔲 **Core Web Vitals Optimization**
   - Eliminate Cumulative Layout Shift (CLS) issues
   - Improve Largest Contentful Paint (LCP) times
   - Enhance First Input Delay (FID) by optimizing JavaScript execution

### Performance Enhancement Tier 1

9. 🔲 **Data Fetching Optimization**
   - Implement proper SWR or React Query caching throughout
   - Add stale-while-revalidate patterns for all data endpoints
   - Set up optimistic UI updates for form submissions

10. 🔲 **Form Validation Prefetching**
    - Preload validation logic when form fields are focused
    - Implement client-side validation caching
    - Add predictive error correction suggestions

11. 🔲 **Bundle Size Reduction**
    - Analyze bundle with webpack-bundle-analyzer
    - Implement code splitting for route-based chunking
    - Reduce dependencies and treeshake unused code

12. 🔲 **Static Generation Improvements**
    - Convert applicable pages to Static Site Generation (SSG)
    - Implement Incremental Static Regeneration (ISR) for semi-dynamic content
    - Add revalidation strategies based on content type

### Performance Enhancement Tier 2

13. 🔲 **Advanced Image Optimization**
    - Convert images to WebP/AVIF with proper fallbacks
    - Implement responsive image sizing with srcset
    - Add blurhash/LQIP (Low Quality Image Placeholders) for instant loading

14. 🔲 **Runtime Performance Optimization**
    - Implement React.memo for expensive components
    - Add virtualization for long lists (projects, services)
    - Use web workers for CPU-intensive operations

15. 🔲 **Animation Performance**
    - Convert CSS animations to GPU-accelerated transforms
    - Implement requestAnimationFrame for JavaScript animations
    - Add will-change hints for elements that will animate

16. 🔲 **Service Worker Integration**
    - Add offline support with service worker caching
    - Implement background sync for form submissions
    - Set up push notifications for enhanced engagement

### Infrastructure & Build Optimizations

17. 🔲 **CDN Integration**
    - Set up Cloudflare or similar CDN for static assets
    - Implement proper cache headers for optimal edge caching
    - Add automatic image optimization through CDN

18. 🔲 **Build Pipeline Optimization**
    - Enable persistent build caching
    - Implement parallel processing for build steps
    - Add differential loading for modern browsers

19. 🔲 **Monitoring & Analytics**
    - Implement Real User Monitoring (RUM)
    - Set up Core Web Vitals tracking
    - Add performance budgets and automated alerts

20. 🔲 **HTTP/3 & Advanced Protocols**
    - Enable HTTP/3 support for faster connections
    - Implement preload, prefetch, and preconnect resource hints
    - Set up server push for critical resources

### Specialized Optimizations

21. 🔲 **3D/VR Content Optimization**
    - Implement progressive loading for 3D models
    - Add level-of-detail (LOD) control for complex models
    - Optimize textures with mipmapping and compression

22. 🔲 **Internationalization Performance**
    - Implement locale-specific code splitting
    - Add translation chunk loading
    - Optimize RTL layout transitions

23. 🔲 **Accessibility Performance**
    - Ensure screen reader performance optimization
    - Implement efficient focus management
    - Reduce motion for users with relevant preferences

24. 🔲 **Print Layout Optimization**
    - Add print-specific stylesheets loaded only when printing
    - Implement on-demand media styles
    - Optimize image resolution for print output

### Implementation Progress Tracking

- **Critical Path**: 8/8 completed (100%)
- **Tier 1 Enhancements**: 0/4 completed (0%)
- **Tier 2 Enhancements**: 0/4 completed (0%)
- **Infrastructure**: 0/4 completed (0%)
- **Specialized**: 0/4 completed (0%)
- **Overall Progress**: 8/24 completed (33.3%)

