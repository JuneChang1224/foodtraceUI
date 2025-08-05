// app/components/Connect.tsx

import React from 'react';

export function Connect() {
  return (
    <div>
      <appkit-button
        class="wallet-connect-btn"
        label="Account Connect"
        balance="hide"
        size="sm"
        loadingLabel="Connecting"
      />
    </div>
  );
}
