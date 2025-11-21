// /lib/oddsx.ts
import { ethers } from "ethers";

export const MARKET_ABI = [
  "function getMarketInfo(bytes32 marketId) view returns (bool,bool,uint8,bool,uint8)",
  "function getPool(bytes32 marketId, address token, uint8 outcome) view returns (uint256)",
];

export type ProviderLike = ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc;

export function getProvider(): ethers.providers.Web3Provider {
  // window.ethereum (MetaMask)
  const anyWin = window as any;
  if (!anyWin.ethereum) throw new Error("No wallet provider found");
  return new ethers.providers.Web3Provider(anyWin.ethereum as ProviderLike, "any");
}

export function getMarketsContract(provider: ethers.providers.Provider, address: string) {
  return new ethers.Contract(address, MARKET_ABI, provider);
}
