// app/components/Header.tsx

import React, { useState, useEffect } from 'react';
import { Connect } from './Connect';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';

export function Header() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);

  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      setUserAddress(localStorage.getItem('userAddress'));
      setUserRole(localStorage.getItem('userRole'));
      setUserDisplayName(localStorage.getItem('userDisplayName'));
    }
  }, [isLoggedIn]); // Re-run when login status changes

  const handleLogout = () => {
    logout();
    router.push('/login'); // redirect to login page
  };

  const getRoleText = (role: string) => {
    switch(role) {
      case '0': return 'Unregistered';
      case '1': return 'Manager';
      case '2': return 'Seller';
      case '3': return 'Supplier';
      default: return 'Unknown';
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <svg
            className="header-icon"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 3h18v18H3V3z" />
          </svg>
          <h1 className="header-brand">FoodTrace</h1>
        </div>
        <div className="header-right">
          <Connect />
          {isLoggedIn && userRole && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {/* User verification display */}
              <div style={{ 
                background: '#f8f9fa', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                fontSize: '12px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>
                  Role: {getRoleText(userRole)} 
                </div>
                <div style={{ color: '#6c757d' }}>
                  {userDisplayName}
                </div>
                <div style={{ color: '#6c757d', fontSize: '10px' }}>
                  {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
          {isLoggedIn && !userRole && (
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
