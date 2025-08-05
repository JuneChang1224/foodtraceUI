// // src/app/page.tsx

'use client';

import React from 'react';
// import { Header } from './components/Header';
import { Footer } from './components/Footer';
import LoginPage from '@/app/login/page';

export default function Home() {
  return (
    <div>
      {/* <Header /> */}
      <main>
        <LoginPage />
      </main>
      <Footer />
    </div>
  );
}
