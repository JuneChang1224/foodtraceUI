'use client';
import React, { useState } from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { writeContract } from '@wagmi/core';
import { config } from '@/utils/web3config';
import { UserHandlingContractAddress } from '@/utils/smartContractAddress';
import UserHandlingABI from '@/abi/Userhandling.json';

interface User {
  id: number;
  name: string;
  wallet: string;
  role: 'Manager' | 'Seller' | 'Supplier';
}

export default function ManagerDashboard() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', wallet: '0x1234crfiu949eq9u23', role: 'Seller' },
    {
      id: 2,
      name: 'Jane Smith',
      wallet: '0x5678ugh54u984h2ruhd',
      role: 'Supplier',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    wallet: '',
    role: 'Seller',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = async () => {
    setError(''); // reset error
    setIsLoading(true);

    // Validation
    if (!newUser.name.trim() || !newUser.wallet.trim()) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    // Check wallet address format
    if (!newUser.wallet.startsWith('0x') || newUser.wallet.length !== 42) {
      setError('Please enter a valid wallet address (0x...)');
      setIsLoading(false);
      return;
    }

    try {
      // Convert role to number for smart contract
      const roleMap = {
        'Manager': 1,
        'Seller': 2,
        'Supplier': 3
      };
      
      const roleNumber = roleMap[newUser.role as keyof typeof roleMap];

      console.log('Creating user with:', {
        address: newUser.wallet,
        role: roleNumber,
        displayName: newUser.name
      });

      // Call smart contract createUser function
      const result = await writeContract(config, {
        address: UserHandlingContractAddress as `0x${string}`,
        abi: UserHandlingABI.abi,
        functionName: 'createUser',
        args: [
          newUser.wallet as `0x${string}`,
          roleNumber,
          newUser.name
        ],
      });

      console.log('Transaction hash:', result);

      // Add to local state for immediate UI update
      const id = users.length ? users[users.length - 1].id + 1 : 1;
      setUsers([...users, { id, ...newUser }]);
      
      // Reset form
      setNewUser({ name: '', wallet: '', role: 'Seller' });
      setIsModalOpen(false);
      
      alert('User created successfully!');

    } catch (error: any) {
      console.error('Error creating user:', error);
      setError(error.message || 'Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="manager-dashboard">
        <h1>Manager Dashboard</h1>

        <div className="dashboard-header">
          <h2>All Users</h2>
          <button className="add-user-btn" onClick={() => setIsModalOpen(true)}>
            Add User
          </button>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Wallet Address</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td className="wallet-cell">{user.wallet}</td>
                  <td>{user.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>
                  No users added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Add New User</h2>
              <label>Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                placeholder="Enter user's name"
                disabled={isLoading}
              />

              <label>Wallet Address</label>
              <input
                type="text"
                value={newUser.wallet}
                onChange={(e) =>
                  setNewUser({ ...newUser, wallet: e.target.value })
                }
                placeholder="0x..."
                disabled={isLoading}
              />

              <label>Role</label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    role: e.target.value as 'Manager' | 'Seller' | 'Supplier',
                  })
                }
                disabled={isLoading}
              >
                <option value="Manager">Manager</option>
                <option value="Seller">Seller</option>
                <option value="Supplier">Supplier</option>
              </select>

              {/* Error Message */}
              {error && <p className="error-message">{error}</p>}

              <div className="modal-actions">
                <button 
                  onClick={handleAddUser}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Add'}
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError('');
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
