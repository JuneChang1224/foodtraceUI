'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { useRouter, useParams } from 'next/navigation';
import { getProductTraceability, ProductTraceability } from '@/utils/web3config';

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);

  const [product, setProduct] = useState<ProductTraceability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProductDetail = async () => {
      if (!productId || isNaN(productId)) {
        setError('Invalid product ID');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const productData = await getProductTraceability(productId);
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found or not yet approved');
        }
      } catch (err) {
        console.error('Error loading product detail:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    loadProductDetail();
  }, [productId]);

  // Format timestamp to readable date
  const formatDate = (timestamp: number): string => {
    if (timestamp === 0) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Loading product details...</h2>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Header />
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Product Not Found</h2>
          <p>{error || 'This product is not available or has not been approved yet.'}</p>
          <button
            onClick={() => router.push('/consumer')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            ← Back to Products
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => router.push('/consumer')}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            backgroundColor: '#6B7280',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back to Products
        </button>

        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {/* Product Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: '#2c5530', margin: '0 0 0.5rem 0' }}>
              {product.productName}
            </h1>
            <div style={{
              background: '#10B981',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              ✓ Fully Verified & Approved
            </div>
          </div>

          {/* Product Information */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '6px'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Batch Information</h3>
              <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: 'bold' }}>
                {product.batchId}
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '6px'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Created Date</h3>
              <p style={{ margin: '0' }}>
                {formatDate(product.createdAt)}
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '6px'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Approved Date</h3>
              <p style={{ margin: '0' }}>
                {formatDate(product.approvedAt)}
              </p>
            </div>
          </div>

          {/* Ingredients Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#2c5530', borderBottom: '2px solid #4CAF50', paddingBottom: '0.5rem' }}>
              🌱 Ingredients
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              {product.ingredientNames.map((ingredient, index) => (
                <div key={index} style={{
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c5530' }}>
                    {ingredient}
                  </h4>
                  <p style={{ 
                    margin: '0', 
                    color: '#666', 
                    fontSize: '0.9rem',
                    fontStyle: 'italic'
                  }}>
                    {product.ingredientCategories[index]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Suppliers Section */}
          <div>
            <h2 style={{ color: '#2c5530', borderBottom: '2px solid #4CAF50', paddingBottom: '0.5rem' }}>
              🏭 Verified Suppliers
            </h2>
            <div style={{ marginTop: '1rem' }}>
              {product.supplierNames.map((supplierName, index) => (
                <div key={index} style={{
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#2c5530' }}>
                      {supplierName}
                    </h4>
                    <p style={{ 
                      margin: '0', 
                      color: '#666', 
                      fontSize: '0.8rem',
                      fontFamily: 'monospace'
                    }}>
                      {product.supplierAddresses[index]}
                    </p>
                  </div>
                  <div style={{
                    background: '#10B981',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ✓ Verified
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badge */}
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#e8f5e8',
            borderRadius: '8px',
            border: '1px solid #4CAF50'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c5530' }}>
              🛡️ Blockchain Verified
            </h3>
            <p style={{ margin: '0', color: '#666' }}>
              This product's supply chain has been verified and approved by all suppliers. 
              All information is stored immutably on the blockchain.
            </p>
          </div>
        </div>

        {/* Bottom spacing */}
        <div style={{ height: '4rem' }}></div>
      </main>
      <Footer />
    </div>
  );
}