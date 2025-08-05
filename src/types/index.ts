export interface ProductData {
  productName: string;
  ingredients: string;
  origin: string;
  productionDate: string;
  expiryDate: string;
  batchNumber: string;
  producerName: string;
  producerAddress: string;
  certifications: string;
  nutritionalInfo: string;
  allergens: string;
  storageInstructions: string;
}

export interface ContractSubmission {
  productId: string;
  batchNumber: string;
  cid: string;
  producer: string;
}
