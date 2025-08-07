'use client';

import React from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleViewProduct = () => {
    // const cid = ''; // Replace with real CID from QR later
    router.push(`/consumer/cid`);
  };

  return (
    <div>
      <Header />
      <main
        className="product-preview"
        style={{ textAlign: 'center', padding: '2rem' }}
      >
        <h3>Organic Mango Juice</h3>
        <p>
          This is a verified product. Scan the QR code or click below to learn
          more.
        </p>
        <button
          onClick={handleViewProduct}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '1rem',
          }}
        >
          View this product
        </button>
      </main>
      <Footer />
    </div>
  );
}
