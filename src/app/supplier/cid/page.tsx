'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type ProductData = {
  productName: string;
  productionDate: string;
  ingredients: string;
  batchNumber: string;
};

export default function ConsumerProductPage({
  params,
}: {
  params: { cid: string };
}) {
  const router = useRouter();
  const { cid } = params;

  const [product, setProduct] = useState<ProductData | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setProduct({
        productName: 'Organic Mango Juice',
        productionDate: '2025-07-29',
        ingredients: 'Mango, Water, Sugar, Vitamin C',
        batchNumber: 'MJX-202507',
      });
    }, 800);
  }, [cid]);

  if (!product) {
    return (
      <div className="product-form">
        <p>🔄 Loading product.....</p>
      </div>
    );
  }

  return (
    <div className="product-form">
      <h1>📦 Product Info</h1>
      <p>
        <strong>Name:</strong> {product.productName}
      </p>
      <p>
        <strong>Production Date:</strong> {product.productionDate}
      </p>
      <p>
        <strong>Batch:</strong> {product.batchNumber}
      </p>
      <p>
        <strong>Ingredients:</strong> {product.ingredients}
      </p>
      <button onClick={() => router.push('/supplier')}>Back</button>
    </div>
  );
}
