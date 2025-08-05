// app/components/Header.tsx

// import React from 'react';
// import { Connect } from './Connect';

// export function Header() {
//   return (
//     <header className="navbar flex justify-between p-4 pt-0">
//       <div className="flex gap-2">
//         <Connect />
//       </div>
//     </header>
//   );
// }

// app/components/Header.tsx

import React from 'react';
import { Connect } from './Connect';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';

export function Header() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login'); // redirect to login page
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
          {isLoggedIn && (
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
