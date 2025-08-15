//src/utils/web3config.ts

import { cookieStorage, createStorage, http } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum, hardhat } from '@reown/appkit/networks';

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined');
}

export const networks = [mainnet, arbitrum, hardhat];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;

// Import for smart contract interaction
import { readContract } from '@wagmi/core';
// import { UserHandlingContractAddress } from './smartContractAddress';
import {
  UserHandlingContractAddress,
  SupplyChainContractAddress,
} from './smartContractAddress';
import UserHandlingABI from '../abi/Userhandling.json';

// Function to get user role from smart contract
export async function getUserRole(userAddress: string) {
  try {
    if (!UserHandlingContractAddress) {
      throw new Error('Contract address not found');
    }
    const result = await readContract(config, {
      address: UserHandlingContractAddress as `0x${string}`,
      abi: UserHandlingABI.abi,
      functionName: 'getUserRole',
      args: [userAddress as `0x${string}`],
    });

    // Type the result properly
    const typedResult = result as [number, string, bigint];

    return {
      role: Number(typedResult[0]),
      displayName: typedResult[1],
      registeredAt: Number(typedResult[2]),
    };
  } catch (error) {
    console.error('Error getting user role:', error);
    return {
      role: 0, // Unregistered
      displayName: 'Unregistered User',
      registeredAt: 0,
    };
  }
}

// Types for user details
export interface UserDetails {
  address: string;
  role: number;
  displayName: string;
  registeredAt: number;
  registeredBy: string;
  registeredByName?: string;
  roleText: string;
}

// Function to get all registered users with detailed status
export async function getAllUsersWithDetails(): Promise<UserDetails[]> {
  try {
    if (!UserHandlingContractAddress) {
      throw new Error('Contract address not found');
    }

    const result = await readContract(config, {
      address: UserHandlingContractAddress as `0x${string}`,
      abi: UserHandlingABI.abi,
      functionName: 'getAllUsersWithDetails',
      args: [],
    });

    // Type the result properly
    const typedResult = result as [
      string[], // userAddresses
      number[], // roles
      string[], // displayNames
      bigint[], // registeredAts
      string[] // registeredBys
    ];

    const [addresses, roles, displayNames, registeredAts, registeredBys] =
      typedResult;

    // Helper function to convert role number to text
    const getRoleText = (role: number): string => {
      switch (role) {
        case 1:
          return 'Manager';
        case 2:
          return 'Seller';
        case 3:
          return 'Supplier';
        default:
          return 'Unregistered';
      }
    };

    // Map the arrays into user objects
    const users: UserDetails[] = addresses.map((address, index) => ({
      address,
      role: Number(roles[index]),
      displayName: displayNames[index],
      registeredAt: Number(registeredAts[index]),
      registeredBy: registeredBys[index],
      roleText: getRoleText(Number(roles[index])),
    }));

    return users;
  } catch (error) {
    console.error('Error getting all users with details:', error);
    return [];
  }
}

// Function to get user statistics
export async function getUserStats() {
  try {
    if (!UserHandlingContractAddress) {
      throw new Error('Contract address not found');
    }

    const result = await readContract(config, {
      address: UserHandlingContractAddress as `0x${string}`,
      abi: UserHandlingABI.abi,
      functionName: 'getUserStats',
      args: [],
    });

    // Type the result properly
    const typedResult = result as [bigint, bigint, bigint];

    return {
      managers: Number(typedResult[0]),
      sellers: Number(typedResult[1]),
      suppliers: Number(typedResult[2]),
      total:
        Number(typedResult[0]) +
        Number(typedResult[1]) +
        Number(typedResult[2]),
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      managers: 0,
      sellers: 0,
      suppliers: 0,
      total: 0,
    };
  }
}

// Types for ingredient details
export interface IngredientDetails {
  id: number;
  name: string;
  category: string;
  supplierAddress: string;
  supplierName?: string;
}

// Function to get all available ingredients
export async function getAllIngredients(): Promise<IngredientDetails[]> {
  try {
    if (!SupplyChainContractAddress) {
      throw new Error('SupplyChain contract address not found');
    }

    const result = await readContract(config, {
      address: SupplyChainContractAddress as `0x${string}`,
      abi: CompleteSysABI.abi,
      functionName: 'getAllAvailableIngredients',
      args: [],
    });

    // Type the result properly
    const typedResult = result as [
      bigint[], // ids
      string[], // names
      string[], // categories
      string[] // supplierAddresses
    ];

    const [ids, names, categories, supplierAddresses] = typedResult;

    // Map the arrays into ingredient objects
    const ingredients: IngredientDetails[] = ids.map((id, index) => ({
      id: Number(id),
      name: names[index],
      category: categories[index],
      supplierAddress: supplierAddresses[index],
    }));

    return ingredients;
  } catch (error) {
    console.error('Error getting all ingredients:', error);
    return [];
  }
}

// Function to get user display name by address
export async function getUserDisplayName(userAddress: string): Promise<string> {
  try {
    if (!UserHandlingContractAddress) {
      throw new Error('Contract address not found');
    }

    const result = await readContract(config, {
      address: UserHandlingContractAddress as `0x${string}`,
      abi: UserHandlingABI.abi,
      functionName: 'getUserRole',
      args: [userAddress as `0x${string}`],
    });

    // Type the result properly
    const typedResult = result as [number, string, bigint];

    // If user is registered, return display name, otherwise return shortened address
    if (Number(typedResult[0]) > 0) {
      return typedResult[1] || 'Unknown User';
    } else {
      return `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    }
  } catch (error) {
    console.error('Error getting user display name:', error);
    // Return shortened address as fallback
    return `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
  }
}

// Enhanced function to get all available ingredients with supplier names
export async function getAllIngredientsWithNames(): Promise<
  IngredientDetails[]
> {
  try {
    if (!SupplyChainContractAddress) {
      throw new Error('SupplyChain contract address not found');
    }

    const result = await readContract(config, {
      address: SupplyChainContractAddress as `0x${string}`,
      abi: CompleteSysABI.abi,
      functionName: 'getAllAvailableIngredients',
      args: [],
    });

    // Type the result properly
    const typedResult = result as [
      bigint[], // ids
      string[], // names
      string[], // categories
      string[] // supplierAddresses
    ];

    const [ids, names, categories, supplierAddresses] = typedResult;

    // Get supplier names for each address
    const ingredientsWithNames = await Promise.all(
      ids.map(async (id, index) => {
        const supplierName = await getUserDisplayName(supplierAddresses[index]);
        return {
          id: Number(id),
          name: names[index],
          category: categories[index],
          supplierAddress: supplierAddresses[index],
          supplierName: supplierName,
        };
      })
    );

    return ingredientsWithNames;
  } catch (error) {
    console.error('Error getting all ingredients with names:', error);
    return [];
  }
}

// Types for product details
export interface ProductDetails {
  id: number;
  name: string;
  batchId: string;
  ingredientIds: number[];
  suppliers: string[];
  approved: number;
  total: number;
  status: number;
  createdAt: number;
  approvedAt: number;
  statusText: string;
}

// Function to get all products from blockchain
export async function getAllProducts(): Promise<ProductDetails[]> {
  try {
    if (!SupplyChainContractAddress) {
      throw new Error('SupplyChain contract address not found');
    }

    // First get all product IDs
    const allProductIds = await readContract(config, {
      address: SupplyChainContractAddress as `0x${string}`,
      abi: CompleteSysABI.abi,
      functionName: 'getAllProducts',
      args: [],
    });

    const productIds = allProductIds as bigint[];

    if (productIds.length === 0) {
      return [];
    }

    // Get details for each product
    const products = await Promise.all(
      productIds.map(async (id) => {
        const result = await readContract(config, {
          address: SupplyChainContractAddress as `0x${string}`,
          abi: CompleteSysABI.abi,
          functionName: 'getProduct',
          args: [id],
        });

        // Type the result properly
        const typedResult = result as [
          string, // name
          string, // batchId
          bigint[], // ingredientIds
          string[], // suppliers
          number, // approved
          number, // total
          number, // status
          bigint, // createdAt
          bigint // approvedAt
        ];

        const [
          name,
          batchId,
          ingredientIds,
          suppliers,
          approved,
          total,
          status,
          createdAt,
          approvedAt,
        ] = typedResult;

        // Convert status number to text
        const getStatusText = (status: number): string => {
          switch (status) {
            case 0:
              return 'Created';
            case 1:
              return 'Pending';
            case 2:
              return 'Approved';
            case 3:
              return 'Rejected';
            default:
              return 'Unknown';
          }
        };

        return {
          id: Number(id),
          name,
          batchId,
          ingredientIds: ingredientIds.map((id) => Number(id)),
          suppliers,
          approved,
          total,
          status,
          createdAt: Number(createdAt),
          approvedAt: Number(approvedAt),
          statusText: getStatusText(status),
        };
      })
    );

    return products;
  } catch (error) {
    console.error('Error getting all products:', error);
    return [];
  }
}

// Function to get products that need supplier approval (for current user)
export async function getProductsForSupplierApproval(
  supplierAddress: string
): Promise<ProductDetails[]> {
  try {
    if (!SupplyChainContractAddress) {
      throw new Error('SupplyChain contract address not found');
    }

    // Get all products first
    const allProducts = await getAllProducts();

    // Filter products where:
    // 1. Current supplier is involved (in suppliers array)
    // 2. Product status is 0 (Created) or 1 (Pending) - not yet fully approved/rejected
    // 3. Current supplier hasn't approved/rejected yet
    const productsForApproval = allProducts.filter(
      (product) =>
        product.suppliers.includes(supplierAddress) &&
        (product.status === 0 || product.status === 1)
    );

    return productsForApproval;
  } catch (error) {
    console.error('Error getting products for supplier approval:', error);
    return [];
  }
}

// Function to check if supplier has already responded to a product
export async function hasSupplierResponded(
  productId: number,
  supplierAddress: string
): Promise<boolean> {
  try {
    if (!SupplyChainContractAddress) {
      throw new Error('SupplyChain contract address not found');
    }

    const result = await readContract(config, {
      address: SupplyChainContractAddress as `0x${string}`,
      abi: CompleteSysABI.abi,
      functionName: 'approvals',
      args: [productId, supplierAddress],
    });

    // 0 = No response, 1 = Approved, 2 = Rejected
    return Number(result) !== 0;
  } catch (error) {
    console.error('Error checking supplier response:', error);
    return false;
  }
}

// Function to get only approved products for consumers
export async function getApprovedProducts(): Promise<ProductDetails[]> {
  try {
    const allProducts = await getAllProducts();

    // Filter to show only approved products (status === 2)
    const approvedProducts = allProducts.filter(
      (product) => product.status === 2
    );

    return approvedProducts;
  } catch (error) {
    console.error('Error getting approved products:', error);
    return [];
  }
}

// Types for detailed product traceability
export interface ProductTraceability {
  productName: string;
  batchId: string;
  ingredientNames: string[];
  ingredientCategories: string[];
  supplierAddresses: string[];
  supplierNames: string[];
  createdAt: number;
  approvedAt: number;
  status: number;
}

// Function to get complete product traceability for consumers
export async function getProductTraceability(
  productId: number
): Promise<ProductTraceability | null> {
  try {
    if (!SupplyChainContractAddress) {
      throw new Error('SupplyChain contract address not found');
    }

    const result = await readContract(config, {
      address: SupplyChainContractAddress as `0x${string}`,
      abi: CompleteSysABI.abi,
      functionName: 'getProductTraceability',
      args: [productId],
    });

    // Type the result properly
    const typedResult = result as [
      string, // productName
      string, // batchId
      string[], // ingredientNames
      string[], // ingredientCategories
      string[], // supplierAddresses
      bigint, // createdAt
      bigint, // approvedAt
      number // status
    ];

    const [
      productName,
      batchId,
      ingredientNames,
      ingredientCategories,
      supplierAddresses,
      createdAt,
      approvedAt,
      status,
    ] = typedResult;

    // Get supplier names for each address
    const supplierNames = await Promise.all(
      supplierAddresses.map((address) => getUserDisplayName(address))
    );

    return {
      productName,
      batchId,
      ingredientNames,
      ingredientCategories,
      supplierAddresses,
      supplierNames,
      createdAt: Number(createdAt),
      approvedAt: Number(approvedAt),
      status,
    };
  } catch (error) {
    console.error('Error getting product traceability:', error);
    console.error('this line is use to test push to main branch');
    return null;
  }
}
