// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

import { headers } from 'next/headers'; // added
import Web3ContextProvider from '@/context/web3';
import { AuthProvider } from '@/context/authContext';

export const metadata: Metadata = {
  title: 'Food Traceability System',
  description: 'Track your food with blockchain',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ContextProvider cookies={cookies}>
          <AuthProvider>{children}</AuthProvider>
        </Web3ContextProvider>
      </body>
    </html>
  );
}
