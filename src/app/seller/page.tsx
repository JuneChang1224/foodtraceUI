'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';

type Product = {
  id: number;
  name: string;
  batch: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Organic Mango Juice',
    batch: 'MJX-202507',
    date: '2025-07-29',
    status: 'Approved',
  },
  {
    id: 2,
    name: 'Dragon Fruit Smoothie',
    batch: 'DFS-202506',
    date: '2025-06-18',
    status: 'Approved',
  },
  {
    id: 3,
    name: 'Papaya Salad Kit',
    batch: 'PSK-202508',
    date: '2025-07-10',
    status: 'Pending',
  },
];

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter();

  const handleDecision = (id: number, decision: 'Approved' | 'Rejected') => {
    const updated = products.map((product) =>
      product.id === id ? { ...product, status: decision } : product
    );
    setProducts(updated);
  };

  const handleViewProduct = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
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

        <p>Below are the products You've sold and submitted for approval.</p>

        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Batch</th>
                <th>Production Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.batch}</td>
                  <td>{product.date}</td>
                  <td className={`status-${product.status.toLowerCase()}`}>
                    {product.status}
                  </td>
                  <td>
                    {product.status === 'Pending' ? (
                      <div className="action-buttons">
                        <button
                          className="view-btn"
                          onClick={() => handleViewProduct(product.id)}
                        >
                          🔍 View
                        </button>
                        <button
                          className="approve-btn"
                          onClick={() => handleDecision(product.id, 'Approved')}
                        >
                          ✅ Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleDecision(product.id, 'Rejected')}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button
                          className="view-btn"
                          onClick={() => handleViewProduct(product.id)}
                        >
                          🔍 View
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />

      {/* Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
          >
            <h2>Product Details</h2>
            <p>
              <strong>Name:</strong> {selectedProduct.name}
            </p>
            <p>
              <strong>Batch:</strong> {selectedProduct.batch}
            </p>
            <p>
              <strong>Date:</strong> {selectedProduct.date}
            </p>
            <p>
              <strong>Status:</strong> {selectedProduct.status}
            </p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
