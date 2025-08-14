'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';

export default function ProductForm() {
  const router = useRouter();

  const ingredientOptions = [
    { value: 'Sugar', label: 'Sugar' },
    { value: 'Salt', label: 'Salt' },
    { value: 'Flour', label: 'Flour' },
    { value: 'Rice', label: 'Rice' },
    { value: 'Milk', label: 'Milk' },
    { value: 'Eggs', label: 'Eggs' },
    { value: 'Butter', label: 'Butter' },
    { value: 'Olive Oil', label: 'Olive Oil' },
  ];

  const [formData, setFormData] = useState({
    productName: '',
    ingredients: [] as string[],
    origin: '',
    productionDate: '',
    batchNumber: '',
    certificate: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleIngredientsChange = (
    selectedOptions: readonly { value: string; label: string }[] | null
  ) => {
    setFormData({
      ...formData,
      ingredients: selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [],
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.productName.trim() || formData.ingredients.length === 0) {
      setStatus('error');
      alert('❌ All fields must be filled.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus('success');
      router.push('/seller/confirmation');
    }, 1500);
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
        <Select
          isMulti
          name="ingredients"
          options={ingredientOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={handleIngredientsChange}
        />

        <p>Batch Number</p>
        <input
          name="batchNumber"
          placeholder="Batch Number"
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
