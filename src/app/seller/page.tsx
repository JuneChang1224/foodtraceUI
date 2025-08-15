'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { getAllProducts, ProductDetails } from '@/utils/web3config';

export default function SellerDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from blockchain
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Format timestamp to readable date
  const formatDate = (timestamp: number): string => {
    if (timestamp === 0) return '-';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div>
      <Header />
      <main className="seller-dashboard">
        <div className="dashboard-header">
          <h1>📊 Seller Dashboard</h1>
          <button
            className="add-product-btn"
            onClick={() => router.push('/seller/form')}
          >
            ➕ Add Product
          </button>
        </div>

        <p>Below are the products you've created and submitted for approval.</p>

        <div className="product-table-wrapper">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading products from blockchain...
            </div>
          ) : products.length === 0 ? (
            <div
              style={{ textAlign: 'center', padding: '2rem', color: '#666' }}
            >
              No products found. Create your first product!
            </div>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Batch ID</th>
                  <th>Created Date</th>
                  <th>Status</th>
                  <th>Approval Progress</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.batchId}</td>
                    <td>{formatDate(product.createdAt)}</td>
                    <td>
                      <span
                        style={{
                          background:
                            product.status === 0
                              ? '#6B7280'
                              : product.status === 1
                              ? '#F59E0B'
                              : product.status === 2
                              ? '#10B981'
                              : '#EF4444',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                        }}
                      >
                        {product.statusText}
                      </span>
                    </td>
                    <td>
                      {product.approved}/{product.total} suppliers
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Bottom spacing to prevent footer overlap */}
        <div style={{ height: '4rem' }}></div>
      </main>
      <Footer />
    </div>
  );
}
