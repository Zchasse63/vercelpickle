import React from 'react';
import { Metadata } from 'next';
import { SellerProfileForm } from '@/components/seller/seller-profile-form';

export const metadata: Metadata = {
  title: 'Seller Profile - Pickle B2B Marketplace',
  description: 'Manage your seller profile on Pickle B2B Marketplace.',
};

export default function SellerProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seller Profile</h1>
        <p className="text-muted-foreground">Manage your business information and settings</p>
      </div>
      <SellerProfileForm />
    </div>
  );
}
