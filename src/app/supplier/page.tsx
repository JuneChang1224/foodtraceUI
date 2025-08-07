'use client';

import React, { useState } from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { useRouter } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  batch: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Organic Mango Juice',
    batch: 'MJX-202507',
    date: '2025-07-29',
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Papaya Salad Kit',
    batch: 'PSK-202508',
    date: '2025-07-15',
    status: 'Pending',
  },
];

export default function SupplierDashboard() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const router = useRouter();

  const handleDecision = (id: number, decision: 'Approved' | 'Rejected') => {
    const updated = products.map((product) =>
      product.id === id ? { ...product, status: decision } : product
    );
    setProducts(updated);
  };

  const handleViewProduct = (id: number) => {
    // const cid = ''; // Replace with real CID from QR later
    router.push(`/supplier/cid`);
  };

  return (
    <div>
      <Header />
      <main className="supplier-dashboard">
        <h1>🔍 Supplier Dashboard</h1>
        <p>Review submitted products and approve or reject them.</p>

        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Batch</th>
                <th>Date</th>
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
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
