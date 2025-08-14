'use client';
import React, { useState, useEffect } from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { writeContract } from '@wagmi/core';
import { config, getAllUsersWithDetails, getUserStats, getUserDisplayName, UserDetails } from '@/utils/web3config';
import { UserHandlingContractAddress } from '@/utils/smartContractAddress';
import UserHandlingABI from '@/abi/Userhandling.json';

interface UserStats {
  managers: number;
  sellers: number;
  suppliers: number;
  total: number;
}

export default function ManagerDashboard() {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [stats, setStats] = useState<UserStats>({ managers: 0, sellers: 0, suppliers: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    wallet: '',
    role: 'Seller',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load all users from smart contract
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load users and stats in parallel
      const [usersData, statsData] = await Promise.all([
        getAllUsersWithDetails(),
        getUserStats()
      ]);
      
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users. Please check your wallet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Load users when component mounts
  useEffect(() => {
    loadUsers();
  }, []);

  // Format timestamp to readable date
  const formatDate = (timestamp: number): string => {
    if (timestamp === 0) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate address for display
  const truncateAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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

      // Reload users from smart contract
      await loadUsers();
      
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

  if (loading) {
    return (
      <div>
        <Header />
        <div className="manager-dashboard">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div>Loading users...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="manager-dashboard">
        <h1>Manager Dashboard</h1>

        {/* Statistics Cards */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div className="stat-card" style={{ background: '#8B5CF6', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>Managers</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{stats.managers}</p>
          </div>
          <div className="stat-card" style={{ background: '#3B82F6', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>Sellers</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{stats.sellers}</p>
          </div>
          <div className="stat-card" style={{ background: '#10B981', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>Suppliers</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{stats.suppliers}</p>
          </div>
          <div className="stat-card" style={{ background: '#6B7280', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>Total Users</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{stats.total}</p>
          </div>
        </div>

        <div className="dashboard-header">
          <h2>All Registered Users</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="add-user-btn" onClick={loadUsers} style={{ background: '#10B981' }}>
              🔄 Refresh
            </button>
            <button className="add-user-btn" onClick={() => setIsModalOpen(true)}>
              Add User
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Wallet Address</th>
              <th>Role</th>
              <th>Registered At</th>
              <th>Registered By</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.address}>
                  <td>{index + 1}</td>
                  <td>{user.displayName}</td>
                  <td className="wallet-cell" title={user.address}>
                    {truncateAddress(user.address)}
                  </td>
                  <td>
                    <span style={{
                      background: user.role === 1 ? '#8B5CF6' : user.role === 2 ? '#3B82F6' : '#10B981',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {user.roleText}
                    </span>
                  </td>
                  <td>{formatDate(user.registeredAt)}</td>
                  <td className="wallet-cell" title={user.registeredBy}>
                    {user.registeredByName || truncateAddress(user.registeredBy)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>
                  No users found. Create some users first.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Bottom spacing to prevent footer overlap */}
        <div style={{ height: '4rem' }}></div>

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
