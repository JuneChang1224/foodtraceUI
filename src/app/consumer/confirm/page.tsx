'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';

export default function PurchaseConfirmation() {
  const router = useRouter();

  return (
    <div>
      <Header />
      <div className="confirmation">
        <h1>🛒 Purchase Successful!</h1>
        <p>
          Thank you for your trust. The product has been verified and your
          purchase is now recorded.
        </p>
        <button onClick={() => router.push('/consumer')}>
          Return to Homepage
        </button>
      </div>
      <Footer />
    </div>
  );
}
