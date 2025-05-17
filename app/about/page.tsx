import { Metadata } from 'next';
import { Suspense } from 'react';
import { LazyAboutContent } from '@/components/about/lazy-about-content';
import { AboutSkeleton } from '@/components/about/about-skeleton';

export const metadata: Metadata = {
  title: 'About Pickle B2B Marketplace',
  description: 'Learn about Pickle, the premier B2B marketplace for food industry professionals.',
};

export default function AboutPage() {
  return (
    <Suspense fallback={<AboutSkeleton />}>
      <LazyAboutContent />
    </Suspense>
  );
}
