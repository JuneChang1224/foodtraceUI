'use client';

import React, { useState } from 'react';

export function IPFSUpload() {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async () => {
    alert('📤 Uploading to IPFS...');
    setFileName('Product_Certificate.pdf');
  };

  return (
    <div className="ipfs-upload">
      <button onClick={handleUpload}>Upload PDF to IPFS</button>
      {fileName && <p>Uploaded: {fileName}</p>}
    </div>
  );
}
