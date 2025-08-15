'use client';

import React from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';

export default function LoginPage() {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h1>🔐 Login With YOur Meta Mask Account Please</h1>
        </form>
      </div>
      <Footer />
    </div>
  );
}
