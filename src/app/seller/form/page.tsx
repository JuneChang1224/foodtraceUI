'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';

export default function ProductForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    productName: '',
    ingredients: '',
    origin: '',
    productionDate: '',
    batchNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setStatus('idle');

    // Basic validation
    const { productName, ingredients, origin, productionDate, batchNumber } =
      formData;

    if (
      !productName.trim() ||
      !ingredients.trim() ||
      !origin.trim() ||
      !productionDate ||
      !batchNumber.trim()
    ) {
      setStatus('error');
      alert('❌ All fields must be filled.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (productionDate > today) {
      setStatus('error');
      alert('❌ Production date cannot be in the future.');
      return;
    }

    if (batchNumber.trim().length < 5) {
      setStatus('error');
      alert('❌ Batch number must be at least 5 characters.');
      return;
    }

    // Simulate successful submission
    setLoading(true);
    try {
      setTimeout(() => {
        setLoading(false);
        setStatus('success');
        router.push('/seller/confirmation');
      }, 1500);
    } catch (error) {
      setLoading(false);
      setStatus('error');
    }
  };

  return (
    <div>
      <Header />
      <div className="product-form">
        <h1>Add New Product</h1>
        <p>Product Name</p>
        <input
          name="productName"
          placeholder="Product Name"
          onChange={handleChange}
        />
        <p>Ingredients</p>
        <textarea
          name="ingredients"
          placeholder="Ingredients"
          onChange={handleChange}
        />
        <p>Origin</p>
        <input name="origin" placeholder="Origin" onChange={handleChange} />
        <p>Production Date</p>
        <input name="productionDate" type="date" onChange={handleChange} />
        <p>Batch Number</p>
        <input
          name="batchNumber"
          placeholder="Batch Number"
          onChange={handleChange}
        />
        <p>Certificate</p>
        <input
          name="Certificate"
          placeholder="Certificate"
          onChange={handleChange}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Product'}
        </button>

        {status === 'success' && (
          <p className="status-message" style={{ color: 'green' }}>
            ✅ Product submitted successfully!
          </p>
        )}
        {status === 'error' && (
          <p className="status-message" style={{ color: 'red' }}>
            ❌ Submission failed. Try again.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}
