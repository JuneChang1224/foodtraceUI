'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { useRouter } from 'next/navigation';
import { getApprovedProducts, ProductDetails } from '@/utils/web3config';

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Load approved products from blockchain
  useEffect(() => {
    const loadApprovedProducts = async () => {
      setLoading(true);
      try {
        const approvedProducts = await getApprovedProducts();
        setProducts(approvedProducts);
      } catch (error) {
        console.error('Error loading approved products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApprovedProducts();
  }, []);

  const handleViewProduct = (productId: number) => {
    router.push(`/consumer/product/${productId}`);
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: number): string => {
    if (timestamp === 0) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div>
      <Header />
      <main className="consumer-dashboard" style={{ padding: '2rem' }}>
        <h1 style={{ textAlign: 'center' }}>🌿 Verified Products</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Explore our certified products with full supply chain transparency
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading verified products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No verified products available at the moment.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {products.map((product) => (
              <div 
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onClick={() => handleViewProduct(product.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  color: '#2c5530',
                  fontSize: '1.25rem'
                }}>
                  {product.name}
                </h3>
                
                <p style={{ 
                  margin: '0 0 0.5rem 0', 
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  <strong>Batch:</strong> {product.batchId}
                </p>
                
                <p style={{ 
                  margin: '0 0 1rem 0', 
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  <strong>Approved:</strong> {formatDate(product.approvedAt)}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    background: '#10B981',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ✓ Verified
                  </span>
                  
                  <button
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.9rem',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom spacing to prevent footer overlap */}
        <div style={{ height: '4rem' }}></div>
      </main>
      <Footer />
    </div>
  );
}
