'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate registration (you can integrate real logic later)
    alert(`✅ Registered as ${name}! Please login.`);
    router.push('/login');
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <form className="login-form" onSubmit={handleRegister}>
          <h1>📝 Register</h1>

          <label>Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <button type="submit">Register</button>

          <p className="login-hint">
            Already have an account?{' '}
            <span
              onClick={() => router.push('/login')}
              style={{
                color: '#667eea',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
}
