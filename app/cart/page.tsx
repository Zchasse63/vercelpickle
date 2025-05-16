import { Metadata } from 'next';
import { Suspense } from 'react';
import { LazyCartContent } from '@/components/cart/lazy-cart-content';
import { CartSkeleton } from '@/components/cart/cart-skeleton';

export const metadata: Metadata = {
  title: 'Shopping Cart - Pickle B2B Marketplace',
  description: 'View and manage your shopping cart on Pickle B2B Marketplace.',
};

export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <LazyCartContent />
    </Suspense>
  );
}
