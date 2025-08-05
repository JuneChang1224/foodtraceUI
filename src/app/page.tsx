// // src/app/page.tsx

// 'use client';

// import React from 'react';
// import { Header } from './components/Header';
// import { Footer } from './components/Footer';

// export default function Home() {
//   return (
//     <>
//       <div className="flex flex-col min-h-screen">
//         <Header />
//         <Footer />
//       </div>
//     </>
//   );
// }

'use client';

import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
// import ProductForm from './components/ProductForm';
import LoginPage from '@/app/login/page';

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        {/* <ProductForm /> */} <LoginPage />
      </main>
      <Footer />
    </div>
  );
}
