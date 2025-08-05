'use client';

import React, { useState } from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import ConsumerProductPage from './cid/page';

export default function Home() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div>
      <Header />
      <main
        className="product-preview"
        style={{ textAlign: 'center', padding: '2rem' }}
      >
        {!showDetails ? (
          <>
            <h3>Organic Mango juice</h3>
            <p>
              This is a verified product. Scan QR or click below to learn more.
            </p>
            <button
              onClick={() => setShowDetails(true)}
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
          </>
        ) : (
          <ConsumerProductPage
            params={{
              cid: '',
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
