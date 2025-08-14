'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { IPFSUpload } from '../../components/IPFSUpload';

export default function ConfirmationPage() {
  const router = useRouter();

  return (
    <div>
      <Header />
      <div className="confirmation">
        <h1>🎉 Product Submitted!</h1>
        <p>
          Your product has been recorded on the blockchain. You will receive a
          confirmation QR code soon.
        </p>
        <button onClick={() => router.push('/seller')}>Back to Home</button>

        <IPFSUpload />
      </div>
      <Footer />
    </div>
  );
}
