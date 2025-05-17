import { Metadata } from 'next';
import { Suspense } from 'react';
import { LazyContactContent } from '@/components/contact/lazy-contact-content';
import { ContactSkeleton } from '@/components/contact/contact-skeleton';

export const metadata: Metadata = {
  title: 'Contact Us - Pickle B2B Marketplace',
  description: 'Get in touch with the Pickle team for support, partnerships, or general inquiries.',
};

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactSkeleton />}>
      <LazyContactContent />
    </Suspense>
  );
}
