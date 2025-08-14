'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { useRouter } from 'next/navigation';
import { writeContract } from '@wagmi/core';
import { config, getAllIngredientsWithNames, IngredientDetails, getProductsForSupplierApproval, hasSupplierResponded, ProductDetails } from '@/utils/web3config';
import { SupplyChainContractAddress } from '@/utils/smartContractAddress';
import CompleteSysABI from '@/abi/CompleteSys.json';

export default function SupplierDashboard() {
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
  
  // Ingredients state
  const [ingredients, setIngredients] = useState<IngredientDetails[]>([]);
  const [isIngredientsLoading, setIsIngredientsLoading] = useState(true);

  // Product approval state
  const [approvalProducts, setApprovalProducts] = useState<ProductDetails[]>([]);
  const [isApprovalProductsLoading, setIsApprovalProductsLoading] = useState(true);
  const [productResponses, setProductResponses] = useState<{ [key: number]: boolean }>({});

  // Get user address from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserAddress(localStorage.getItem('userAddress'));
    }
  }, []);

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

  // Load products that need approval
  useEffect(() => {
    const loadApprovalProducts = async () => {
      if (!userAddress) return;
      
      setIsApprovalProductsLoading(true);
      try {
        const productsData = await getProductsForSupplierApproval(userAddress);
        setApprovalProducts(productsData);

        // Check response status for each product
        const responses: { [key: number]: boolean } = {};
        for (const product of productsData) {
          const hasResponded = await hasSupplierResponded(product.id, userAddress);
          responses[product.id] = hasResponded;
        }
        setProductResponses(responses);
      } catch (error) {
        console.error('Error loading approval products:', error);
      } finally {
        setIsApprovalProductsLoading(false);
      }
    };

    loadApprovalProducts();
  }, [userAddress]);

  // Handle product approval
  const handleApproveProduct = async (productId: number) => {
    if (!userAddress) return;

    try {
      console.log('Approving product:', productId);

      const result = await writeContract(config, {
        address: SupplyChainContractAddress as `0x${string}`,
        abi: CompleteSysABI.abi,
        functionName: 'approveProduct',
        args: [productId],
      });

      console.log('Approval transaction hash:', result);
      
      // Update local state to reflect the approval
      setProductResponses(prev => ({ ...prev, [productId]: true }));
      
      // Reload approval products to get updated status
      const productsData = await getProductsForSupplierApproval(userAddress);
      setApprovalProducts(productsData);

      alert('✅ Product approved successfully!');
    } catch (error: any) {
      console.error('Error approving product:', error);
      alert('❌ Failed to approve product: ' + (error.message || 'Unknown error'));
    }
  };

  // Handle product rejection
  const handleRejectProduct = async (productId: number) => {
    if (!userAddress) return;

    try {
      console.log('Rejecting product:', productId);

      const result = await writeContract(config, {
        address: SupplyChainContractAddress as `0x${string}`,
        abi: CompleteSysABI.abi,
        functionName: 'rejectProduct',
        args: [productId],
      });

      console.log('Rejection transaction hash:', result);
      
      // Update local state to reflect the rejection
      setProductResponses(prev => ({ ...prev, [productId]: true }));
      
      // Reload approval products to get updated status
      const productsData = await getProductsForSupplierApproval(userAddress);
      setApprovalProducts(productsData);

      alert('✅ Product rejected successfully!');
    } catch (error: any) {
      console.error('Error rejecting product:', error);
      alert('❌ Failed to reject product: ' + (error.message || 'Unknown error'));
    }
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
      
      // Reload ingredients after successful addition
      const ingredientsData = await getAllIngredientsWithNames();
      setIngredients(ingredientsData);
      
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

        {/* Product Approval Section */}
        <div className="dashboard-header">
          <h2>Products Requiring Approval</h2>
        </div>
        <p>Review and approve/reject products that use your ingredients.</p>

        <div className="product-table-wrapper">
          {isApprovalProductsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading products requiring approval...
            </div>
          ) : approvalProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              No products requiring your approval at the moment.
            </div>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Batch ID</th>
                  <th>Status</th>
                  <th>Approval Progress</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {approvalProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.batchId}</td>
                    <td>
                      <span style={{
                        background: product.status === 0 ? '#6B7280' : 
                                   product.status === 1 ? '#F59E0B' : 
                                   product.status === 2 ? '#10B981' : '#EF4444',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {product.statusText}
                      </span>
                    </td>
                    <td>{product.approved}/{product.total} suppliers</td>
                    <td>
                      {productResponses[product.id] ? (
                        <span style={{ color: '#10B981', fontWeight: 'bold' }}>
                          ✓ Responded
                        </span>
                      ) : (
                        <div className="action-buttons">
                          <button
                            className="approve-btn"
                            onClick={() => handleApproveProduct(product.id)}
                          >
                            ✅ Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleRejectProduct(product.id)}
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="dashboard-header" style={{ marginTop: '3rem' }}>
          <h2>Manage Ingredients</h2>
          <button 
            className="add-user-btn" 
            onClick={() => setIsIngredientModalOpen(true)}
          >
            Add Ingredient
          </button>
        </div>


        {/* Ingredients Table */}
        <div className="dashboard-header" style={{ marginTop: '2rem' }}>
          <h2>Available Ingredients</h2>
        </div>

        <div className="product-table-wrapper">
          {isIngredientsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading ingredients...
            </div>
          ) : ingredients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              No ingredients available yet. Add the first ingredient!
            </div>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ingredient Name</th>
                  <th>Category</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient) => (
                  <tr key={ingredient.id}>
                    <td>{ingredient.id}</td>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.category}</td>
                    <td>
                      {ingredient.supplierName || `${ingredient.supplierAddress.slice(0, 6)}...${ingredient.supplierAddress.slice(-4)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Bottom spacing to prevent footer overlap */}
        <div style={{ height: '4rem' }}></div>

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
