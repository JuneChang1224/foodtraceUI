'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { getAllIngredientsWithNames, IngredientDetails } from '@/utils/web3config';
import { writeContract } from '@wagmi/core';
import { config } from '@/utils/web3config';
import { SupplyChainContractAddress } from '@/utils/smartContractAddress';
import CompleteSysABI from '@/abi/CompleteSys.json';

export default function ProductForm() {
  const router = useRouter();

  const [ingredients, setIngredients] = useState<IngredientDetails[]>([]);
  const [isIngredientsLoading, setIsIngredientsLoading] = useState(true);

  const [formData, setFormData] = useState({
    productName: '',
    ingredients: [] as number[],
    batchId: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  // Load ingredients from blockchain
  useEffect(() => {
    const loadIngredients = async () => {
      setIsIngredientsLoading(true);
      try {
        const ingredientsData = await getAllIngredientsWithNames();
        setIngredients(ingredientsData);
      } catch (error) {
        console.error('Error loading ingredients:', error);
      } finally {
        setIsIngredientsLoading(false);
      }
    };

    loadIngredients();
  }, []);

  const handleIngredientsChange = (
    selectedOptions: readonly { value: number; label: string }[] | null
  ) => {
    setFormData({
      ...formData,
      ingredients: selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [],
    });
  };

  // Create options for react-select from blockchain ingredients
  const ingredientOptions = ingredients.map(ingredient => ({
    value: ingredient.id,
    label: `${ingredient.name} (${ingredient.category}) - by ${ingredient.supplierName || ingredient.supplierAddress.slice(0, 6) + '...' + ingredient.supplierAddress.slice(-4)}`
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    // Validation
    if (!formData.productName.trim() || !formData.batchId.trim() || formData.ingredients.length === 0) {
      setError('All fields must be filled.');
      setLoading(false);
      return;
    }

    if (!SupplyChainContractAddress) {
      setError('Supply chain contract address not configured.');
      setLoading(false);
      return;
    }

    try {
      console.log('Creating product with:', {
        name: formData.productName,
        batchId: formData.batchId,
        ingredientIds: formData.ingredients
      });

      // Call smart contract createProduct function
      const result = await writeContract(config, {
        address: SupplyChainContractAddress as `0x${string}`,
        abi: CompleteSysABI.abi,
        functionName: 'createProduct',
        args: [
          formData.productName,     // name
          formData.batchId,         // batchId
          formData.ingredients      // ingredientIds array
        ],
      });

      console.log('Transaction hash:', result);

      setStatus('success');
      alert('✅ Product created successfully and submitted for supplier approval!');
      
      // Reset form
      setFormData({
        productName: '',
        ingredients: [],
        batchId: '',
      });

      // Navigate back to seller dashboard to see the newly created product
      router.push('/seller');

    } catch (error: any) {
      console.error('Error creating product:', error);
      setError(error.message || 'Failed to create product. Please try again.');
      setStatus('error');
    } finally {
      setLoading(false);
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

        <p>Batch ID</p>
        <input
          name="batchId"
          placeholder="Batch ID (e.g., PS-2024-001)"
          onChange={handleChange}
        />

        <p>Ingredients</p>
        {isIngredientsLoading ? (
          <div style={{ padding: '10px', color: '#666' }}>
            Loading ingredients from blockchain...
          </div>
        ) : ingredients.length === 0 ? (
          <div style={{ padding: '10px', color: '#666' }}>
            No ingredients available. Please add ingredients first.
          </div>
        ) : (
          <Select
            isMulti
            name="ingredients"
            options={ingredientOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleIngredientsChange}
            placeholder="Select ingredients..."
          />
        )}

        {/* Spacing between dropdown and button */}
        <div style={{ height: '2rem' }}></div>

        {/* Error Message */}
        {error && <p className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating Product...' : 'Submit Product'}
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

        {/* Bottom spacing to prevent footer overlap */}
        <div style={{ height: '4rem' }}></div>
      </div>
      <Footer />
    </div>
  );
}
