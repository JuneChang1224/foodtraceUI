'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';

type Product = {
  name: string;
  batch: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

const mockProducts: Product[] = [
  {
    name: 'Organic Mango Juice',
    batch: 'MJX-202507',
    date: '2025-07-29',
    status: 'Approved',
  },
  {
    name: 'Dragon Fruit Smoothie',
    batch: 'DFS-202506',
    date: '2025-06-18',
    status: 'Approved',
  },
  {
    name: 'Papaya Salad Kit',
    batch: 'PSK-202508',
    date: '2025-07-10',
    status: 'Pending',
  },
];

export default function SellerDashboard() {
  const router = useRouter();

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
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.batch}</td>
                  <td>{product.date}</td>
                  <td className={`status-${product.status.toLowerCase()}`}>
                    {product.status}
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
