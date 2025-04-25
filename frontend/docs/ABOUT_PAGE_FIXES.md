# About Page Fixes and Improvements Plan

## 1. Current Issues

### 1.1 Build Errors
- Module resolution errors for `@/i18n` path in layout.tsx
- Import path inconsistencies causing compilation failures
- Duplicate font imports in layout.tsx

### 1.2 Component Integration Issues
- TeamMemberCard imported incorrectly in TeamGrid component
- Incorrect default exports in TeamSection/index.ts
- Misplaced files in wrong directory structure (projects vs portfolio)

### 1.3 Content Problems
- Hardcoded content in OptimizedAboutClient component
- Missing translation keys in locale files
- Missing data fetching in some components

## 2. Fix Plan

### Phase 1: Structure & Dependencies (Priority: Critical)

#### 1. Fix Import Paths
- ✅ Update i18n import to use `@/../i18n` instead of `@/i18n`
- ✅ Remove duplicate font imports in layout.tsx
- ✅ Fix TeamMemberCard import in TeamGrid.tsx

#### 2. Fix Directory Structure
- ✅ Move files from incorrect projects/ directory to portfolio/ directory
- ✅ Delete deprecated directories and components
- ✅ Update imports across the codebase

#### 3. Fix Export Patterns
- ✅ Update TeamSection/index.ts to use correct export syntax
- Ensure consistent use of named vs default exports
- Update imports to use named imports where applicable

### Phase 2: Remove Hardcoded Content (Priority: High)

#### 1. Identify Hardcoded Content
- OptimizedAboutClient currently has hardcoded mission/vision data
- TeamSection may have hardcoded strings
- Any other components with static text should be identified

#### 2. Implement Proper Data Fetching
- Replace hardcoded data with proper useTranslations hooks
- Implement data fetching for team members via useTeamMembers hook
- Ensure all displayed text comes from translation files or API data

#### 3. Update Translation Files
- Add all required keys to en.json and ar.json translation files
- Organize translations in logical sections
- Verify RTL behavior for Arabic text

### Phase 3: Component Integration (Priority: High)

#### 1. Fix TeamSection Integration
- Ensure TeamGrid receives correct props from TeamSection
- Fix isLoading prop propagation from useTeamMembers hook
- Handle error states properly with ErrorMessage component
- Implement loading skeleton with proper styling

#### 2. Update TeamMemberCard
- Add hover effects and animations
- Ensure responsive behavior on all screen sizes
- Optimize image loading with priority for above-fold content
- Add proper accessibility attributes

#### 3. Implement ScrollReveal for Animations
- Add fade-in and slide-up animations
- Implement reduced motion alternatives
- Optimize animation timing and offsets

### Phase 4: Performance Optimization (Priority: Medium)

#### 1. Implement Component Memoization
- Add React.memo to expensive components
- Use useMemo for computed values
- Optimize re-renders with useCallback for event handlers

#### 2. Image Optimization
- Use Next.js Image component with proper sizing
- Implement responsive images with srcSet
- Add loading priority for critical images
- Implement lazy loading for below-fold content

#### 3. Data Prefetching
- Add prefetching for team data on page load
- Implement SWR for data caching
- Add stale-while-revalidate patterns

## 3. Testing Strategy

### 3.1 Component Testing

- **OptimizedAboutClient**
  - Test with translation props
  - Verify RTL layout
  - Test dark mode appearance
  - Verify responsive behavior

- **TeamSection**
  - Test loading state
  - Test error state with mock error
  - Test empty state with empty array
  - Test with mock data
  - Test RTL layout
  - Test with various screen sizes

- **TeamGrid**
  - Test with different column counts
  - Test with different numbers of team members
  - Test loading state skeletons
  - Test accessibility attributes

- **TeamMemberCard**
  - Test with all social media link combinations
  - Test image loading and fallbacks
  - Test hover states and animations
  - Test keyboard navigation

### 3.2 Integration Testing

1. **Full Page Testing**
   - Test complete About page rendering
   - Test data loading sequence
   - Test scroll performance
   - Test animations and transitions

2. **Language Switching**
   - Test switching between English and Arabic
   - Verify proper content translation
   - Test RTL layout adjustments
   - Test fonts and typography

3. **User Interactions**
   - Test all clickable elements
   - Test hover states and feedback
   - Test keyboard navigation
   - Test screen reader compatibility

### 3.3 Automated Testing Suite

- Create Jest and React Testing Library tests
- Create Cypress tests for key user flows
- Implement accessibility testing with axe-core
- Set up GitHub Actions for CI/CD testing

## 4. Implementation Checklist

### 4.1 Critical Fixes
- ✅ Fix import paths for i18n
- ✅ Remove duplicate imports in layout.tsx
- ✅ Fix TeamMemberCard imports
- [ ] Update TeamSection exports
- [ ] Fix any remaining build errors

### 4.2 Content Fixes
- [ ] Replace hardcoded content in OptimizedAboutClient
- [ ] Update translation keys in locale files
- [ ] Implement proper data fetching hooks
- [ ] Add error handling and loading states

### 4.3 Component Improvements
- [ ] Update TeamGrid to handle loading states properly
- [ ] Optimize TeamMemberCard for better performance
- [ ] Add animations with ScrollReveal
- [ ] Implement responsive design improvements

### 4.4 Testing Tasks
- [ ] Create unit tests for all components
- [ ] Test in multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Test with screen readers
- [ ] Run Lighthouse audits

## 5. Specific Component Fixes

### 5.1 OptimizedAboutClient
```tsx
// Update this component to use translations instead of hardcoded content
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/ui';

export default function OptimizedAboutClient({ locale }: { locale: string }) {
  const isRtl = locale === 'ar';
  const t = useTranslations('about');
  
  return (
    <div className="relative container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-accent rounded-full text-sm font-medium mb-6">
            {t('aboutUs')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-brand-blue dark:text-white">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </header>
        
        {/* Mission and Vision Section */}
        <section id="mission" className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <ScrollReveal animation="fade-in" delay={0.1}>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-brand-blue dark:text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-heading font-semibold mb-4 text-brand-blue dark:text-white">{t('mission')}</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('missionText')}</p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-in" delay={0.2}>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-brand-accent/10 dark:bg-brand-accent/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-heading font-semibold mb-4 text-brand-blue dark:text-white">{t('vision')}</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('visionText')}</p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </div>
  );
}
```

### 5.2 TeamSection Component
```tsx
// Example fix for TeamSection component
import React from 'react';
import { useTranslations } from 'next-intl';
import { TeamGrid } from './TeamGrid';
import { useTeamMembers } from '@/lib/hooks/marketing/about';
import { LoadingState, ErrorMessage } from '@/components/ui';
import { ScrollReveal } from '@/components/ui';

interface TeamSectionProps {
  locale: string;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ locale }) => {
  const t = useTranslations('about');
  const isRtl = locale === 'ar';
  
  const { 
    data: teamMembers, 
    isLoading, 
    error, 
    refetch 
  } = useTeamMembers({
    locale,
    featuredOnly: true,
    limit: 6,
    autoFetch: true
  });

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <ScrollReveal animation="fade-in">
          <h2 className="text-3xl font-heading font-semibold mb-8 text-center text-brand-blue dark:text-white">
            {t('teamTitle')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center mb-12">
            {t('teamDescription')}
          </p>
        </ScrollReveal>
        
        {isLoading && (
          <LoadingState type="team" text={t('loadingTeam')} />
        )}
        
        {error && (
          <div className="py-8">
            <ErrorMessage 
              message={error || t('errorLoadingTeam')} 
              retryText={t('retry')}
              onRetry={refetch}
            />
          </div>
        )}
        
        {!isLoading && !error && teamMembers && teamMembers.length > 0 && (
          <ScrollReveal animation="slide-up" delay={0.2}>
            <TeamGrid 
              teamMembers={teamMembers} 
              isLoading={isLoading}
            />
          </ScrollReveal>
        )}
        
        {!isLoading && !error && (!teamMembers || teamMembers.length === 0) && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('noTeamMembersFound')}
          </div>
        )}
      </div>
    </section>
  );
};
```

## 6. Required Translation Keys

Add these keys to both `en.json` and `ar.json` translation files:

```json
{
  "about": {
    "aboutUs": "About Us",
    "title": "Transforming Spaces, Enhancing Lives",
    "subtitle": "We're a team of passionate designers dedicated to creating exceptional interior spaces that reflect your personality and lifestyle.",
    "mission": "Our Mission",
    "missionText": "To create innovative interior designs that balance aesthetics, functionality, and sustainability while exceeding client expectations.",
    "vision": "Our Vision",
    "visionText": "To be the leading interior design firm in Egypt, recognized for our exceptional designs and sustainable practices that enhance quality of life.",
    "teamTitle": "Meet Our Team",
    "teamDescription": "Our diverse team brings together expertise in architecture, sustainability, urban planning, and design to deliver exceptional results for our clients.",
    "loadingTeam": "Loading team members...",
    "errorLoadingTeam": "Failed to load team members. Please try again later.",
    "retry": "Retry",
    "noTeamMembersFound": "No team members found."
  }
}
```

## 7. Final Review Checklist

- [ ] No hardcoded strings in any component
- [ ] All components use proper data fetching hooks
- [ ] All UI states handled (loading, error, empty, success)
- [ ] Accessibility attributes properly implemented
- [ ] Responsive design works on all screen sizes
- [ ] Dark mode properly implemented
- [ ] RTL layout works correctly for Arabic
- [ ] Animations work with appropriate transitions
- [ ] Performance optimizations implemented
- [ ] All tests pass 