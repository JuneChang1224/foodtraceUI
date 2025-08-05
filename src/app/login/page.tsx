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
    if (email === 'consumer@example.com' && password === '123456') {
      login();
      router.push('/consumer');
    } else if (email === 'seller@example.com' && password === '1234') {
      login();
      router.push('/seller');
    } else if (email === 'inspector@example.com' && password === '12345') {
      login();
      router.push('/inspector');
    } else {
      alert('❌ Invalid credentials. Try: consumer@example.com / 123456');
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h1>🔐 Login</h1>

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <p className="login-hint">
            Don't have an account?{' '}
            <span
              onClick={() => router.push('/register')}
              style={{
                color: '#667eea',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Register here
            </span>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
}
