'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { useRouter } from 'next/navigation';
import { writeContract } from '@wagmi/core';
import { config } from '@/utils/web3config';
import { SupplyChainContractAddress } from '@/utils/smartContractAddress';
import CompleteSysABI from '@/abi/CompleteSys.json';

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
  
  // Ingredient modal states
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    type: '',
  });
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [ingredientError, setIngredientError] = useState('');
  const [isIngredientLoading, setIsIngredientLoading] = useState(false);

  // Get user address from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserAddress(localStorage.getItem('userAddress'));
    }
  }, []);

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

  const handleAddIngredient = async () => {
    setIngredientError('');
    setIsIngredientLoading(true);

    // Validation
    if (!newIngredient.name.trim() || !newIngredient.type.trim()) {
      setIngredientError('Please fill in all fields.');
      setIsIngredientLoading(false);
      return;
    }

    if (!userAddress) {
      setIngredientError('User address not found. Please connect your wallet.');
      setIsIngredientLoading(false);
      return;
    }

    if (!SupplyChainContractAddress) {
      setIngredientError('Supply chain contract address not configured.');
      setIsIngredientLoading(false);
      return;
    }

    try {
      console.log('Adding ingredient with:', {
        name: newIngredient.name,
        supplierAddr: userAddress,
        category: newIngredient.type
      });

      // Call smart contract addIngredient function
      const result = await writeContract(config, {
        address: SupplyChainContractAddress as `0x${string}`,
        abi: CompleteSysABI.abi,
        functionName: 'addIngredient',
        args: [
          newIngredient.name,           // name
          userAddress as `0x${string}`, // supplierAddr (from current user)
          newIngredient.type            // category (from type field)
        ],
      });

      console.log('Transaction hash:', result);

      // Reset form and close modal
      setNewIngredient({ name: '', type: '' });
      setIsIngredientModalOpen(false);
      
      alert('Ingredient added successfully!');

    } catch (error: any) {
      console.error('Error adding ingredient:', error);
      setIngredientError(error.message || 'Failed to add ingredient. Please try again.');
    } finally {
      setIsIngredientLoading(false);
    }
  };

  const handleCancelIngredient = () => {
    setIsIngredientModalOpen(false);
    setNewIngredient({ name: '', type: '' });
  };

  return (
    <div>
      <Header />
      <main className="supplier-dashboard">
        <h1>🔍 Supplier Dashboard</h1>
        <p>Review submitted products and approve or reject them.</p>

        <div className="dashboard-header">
          <h2>Products</h2>
          <button 
            className="add-user-btn" 
            onClick={() => setIsIngredientModalOpen(true)}
          >
            Add Ingredient
          </button>
        </div>

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

        {/* Add Ingredient Modal */}
        {isIngredientModalOpen && (
          <div className="modal-overlay" onClick={() => setIsIngredientModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Add New Ingredient</h2>
              
              <label>Ingredient Name</label>
              <input
                type="text"
                value={newIngredient.name}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, name: e.target.value })
                }
                placeholder="Enter ingredient name"
                disabled={isIngredientLoading}
              />

              <label>Ingredient Type</label>
              <input
                type="text"
                value={newIngredient.type}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, type: e.target.value })
                }
                placeholder="Enter ingredient type (e.g., Vegetables, Herbs)"
                disabled={isIngredientLoading}
              />

              {/* Error Message */}
              {ingredientError && <p className="error-message">{ingredientError}</p>}

              <div className="modal-actions">
                <button 
                  onClick={handleAddIngredient}
                  disabled={isIngredientLoading}
                >
                  {isIngredientLoading ? 'Adding...' : 'Add'}
                </button>
                <button
                  className="cancel-btn"
                  onClick={handleCancelIngredient}
                  disabled={isIngredientLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
