'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getUserRole } from '../utils/web3config';

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    // Check session storage
    const session = localStorage.getItem('session');
    setIsLoggedIn(session === 'true');
  }, []);

  // Watch for wallet connection
  useEffect(() => {
    if (isConnected && address) {
      handleWalletConnect(address);
    } else if (!isConnected) {
      handleWalletDisconnect();
    }
  }, [isConnected, address]);

  const handleWalletConnect = async (walletAddress: string) => {
    console.log('Wallet connected:', walletAddress);

    try {
      // Call smart contract to get user role
      const { role, displayName, registeredAt } = await getUserRole(
        walletAddress
      );

      console.log('User role from contract:', role);
      console.log('User display name:', displayName);
      console.log('Registered at:', registeredAt);

      // Store wallet data
      localStorage.setItem('session', 'true');
      localStorage.setItem('userAddress', walletAddress);
      localStorage.setItem('userRole', role.toString());
      localStorage.setItem('userDisplayName', displayName);
      localStorage.setItem('registeredAt', registeredAt.toString());

      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to get user role:', error);

      // Store wallet address even if contract call fails
      localStorage.setItem('session', 'true');
      localStorage.setItem('userAddress', walletAddress);
      localStorage.setItem('userRole', '0');
      localStorage.setItem('userDisplayName', 'Unregistered User');

      setIsLoggedIn(true);
    }
  };

  const handleWalletDisconnect = () => {
    console.log('Wallet disconnected');
    logout();
  };

  const login = () => {
    localStorage.setItem('session', 'true');
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('session');
    localStorage.removeItem('userAddress');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userDisplayName');
    localStorage.removeItem('registeredAt');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
