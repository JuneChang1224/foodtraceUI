'use client';
import React, { useState } from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';

interface User {
  id: number;
  name: string;
  wallet: string;
  role: 'Seller' | 'Supplier';
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

  const handleAddUser = () => {
    setError(''); // reset error

    if (!newUser.name.trim() || !newUser.wallet.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    // Wallet uniqueness check (case insensitive)
    const walletExists = users.some(
      (u) =>
        u.wallet.trim().toLowerCase() === newUser.wallet.trim().toLowerCase()
    );

    if (walletExists) {
      setError('This wallet address already exists for another user.');
      return;
    }

    const id = users.length ? users[users.length - 1].id + 1 : 1;
    setUsers([...users, { id, ...newUser }]);
    setNewUser({ name: '', wallet: '', role: 'Seller' });
    setIsModalOpen(false);
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
              />

              <label>Wallet Address</label>
              <input
                type="text"
                value={newUser.wallet}
                onChange={(e) =>
                  setNewUser({ ...newUser, wallet: e.target.value })
                }
                placeholder="0x..."
              />

              <label>Role</label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    role: e.target.value as 'Seller' | 'Supplier',
                  })
                }
              >
                <option value="Seller">Seller</option>
                <option value="Supplier">Supplier</option>
              </select>

              {/* Error Message */}
              {error && <p className="error-message">{error}</p>}

              <div className="modal-actions">
                <button onClick={handleAddUser}>Add</button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError('');
                  }}
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
