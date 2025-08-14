'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate login logic
    if (email === 'consumer@mail.com' && password === '123456') {
      login();
      router.push('/consumer');
    } else if (email === 'seller@mail.com' && password === '1234') {
      login();
      router.push('/seller');
    } else if (email === 'supplier@mail.com' && password === '12345') {
      login();
      router.push('/supplier');
    } else {
      alert('❌ Invalid credentials. Example: user@example.com / 000000');
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h1>🔐 Login With Your Meta Mask Account On the Top Right</h1>
        </form>
      </div>
      <Footer />
    </div>
  );
}
