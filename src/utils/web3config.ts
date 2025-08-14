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
import { UserHandlingContractAddress } from './smartContractAddress';
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
