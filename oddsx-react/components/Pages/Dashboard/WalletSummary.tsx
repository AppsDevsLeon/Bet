"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { ethers } from "ethers";

type Token = { address: string; symbol: string; decimals?: number };

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

const CHAIN_META: Record<number, { name: string; nativeSymbol: string; explorer: string }> = {
  1:    { name: "Ethereum", nativeSymbol: "ETH",   explorer: "https://etherscan.io" },
  137:  { name: "Polygon",  nativeSymbol: "MATIC", explorer: "https://polygonscan.com" },
  42161:{ name: "Arbitrum", nativeSymbol: "ETH",   explorer: "https://arbiscan.io" },
  8453: { name: "Base",     nativeSymbol: "ETH",   explorer: "https://basescan.org" },
};

const DEFAULT_TOKENS: Record<number, Token[]> = {
  1: [
    { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT" },
    { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48", symbol: "USDC" },
    { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", symbol: "DAI"  },
    { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", symbol: "WETH" },
  ],
  137: [
    { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", symbol: "USDT" },
    { address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", symbol: "USDC.e" },
    { address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", symbol: "DAI"  },
    { address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", symbol: "WMATIC" },
  ],
  42161: [
    { address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", symbol: "USDT" },
    { address: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8", symbol: "USDC.e" },
    { address: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1", symbol: "DAI"  },
    { address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1", symbol: "WETH" },
  ],
  8453: [
    { address: "0x833589fCD6EDb6E08f4c7C32D4f71b54bdA02913", symbol: "USDC" },
    { address: "0x4200000000000000000000000000000000000006", symbol: "WETH" },
  ],
};

function short(addr: string) {
  return addr?.slice(0, 6) + "…" + addr?.slice(-4);
}

export default function WalletSummary({ customTokens }: { customTokens?: Record<number, Token[]> }) {
  const { account, provider, chainId } = useWallet();
  const [nativeBal, setNativeBal] = useState<string>("-");
  const [tokens, setTokens] = useState<Array<{ symbol: string; balance: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [netName, setNetName] = useState<string>("");

  const meta = CHAIN_META[chainId ?? -1];
  const tokenList = useMemo(() => (customTokens?.[chainId ?? -1] || DEFAULT_TOKENS[chainId ?? -1] || []), [customTokens, chainId]);

  const browserProvider = useMemo(() => {
    if (!provider) return null;
    // Reenvolvemos el EIP-1193 en ethers v5 provider
    return new ethers.providers.Web3Provider(provider as any, "any");
  }, [provider]);

  async function loadBalances() {
    if (!account || !browserProvider) return;
    try {
      setLoading(true);
      // Red / nombre
      const net = await browserProvider.getNetwork();
      setNetName(CHAIN_META[net.chainId]?.name || net.name || `Chain ${net.chainId}`);
      // Nativo
      const balBN = await browserProvider.getBalance(account);
      setNativeBal(ethers.utils.formatEther(balBN));
      // Tokens
      const results: Array<{ symbol: string; balance: string }> = [];
      for (const tk of tokenList) {
        try {
          const c = new ethers.Contract(tk.address, ERC20_ABI, browserProvider);
          const [bal, sym, dec] = await Promise.all([
            c.balanceOf(account),
            tk.symbol ? Promise.resolve(tk.symbol) : c.symbol().catch(() => tk.symbol || "UNK"),
            tk.decimals ? Promise.resolve(tk.decimals) : c.decimals().catch(() => 18),
          ]);
          if (bal.gt(0)) {
            results.push({ symbol: sym, balance: ethers.utils.formatUnits(bal, dec) });
          }
        } catch { /* token roto/puente: ignorar */ }
      }
      setTokens(results);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBalances(); }, [account, chainId, browserProvider]);

  if (!account) {
    return (
      <div className="rounded-2xl p-5 bg-white/5 border border-white/10 text-white">
        <div className="text-lg mb-1">Wallet</div>
        <div className="text-sm opacity-80">Conecta tu wallet para ver red y balances.</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 bg-white/5 border border-white/10 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg">Wallet</div>
        <button onClick={loadBalances} className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20">
          {loading ? "Actualizando..." : "Refrescar"}
        </button>
      </div>

      <div className="grid gap-2">
        <div className="text-sm opacity-80">Cuenta</div>
        <div className="font-mono">{short(account)}</div>

        <div className="text-sm opacity-80 mt-3">Red</div>
        <div>{netName || (meta?.name ?? `Chain ${chainId}`)} <span className="opacity-70">({chainId})</span></div>

        <div className="text-sm opacity-80 mt-3">Balance nativo</div>
        <div>{nativeBal} {meta?.nativeSymbol ?? ""}</div>

        {tokens.length > 0 && (
          <>
            <div className="text-sm opacity-80 mt-3">Tokens</div>
            <ul className="list-disc ms-5">
              {tokens.map((t) => (
                <li key={t.symbol} className="font-mono">{t.balance} {t.symbol}</li>
              ))}
            </ul>
          </>
        )}

        {meta?.explorer && (
          <a
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 font-mono text-sm"
            href={`${meta.explorer}/address/${account}`}
          >
            Ver en explorer
          </a>
        )}
      </div>
    </div>
  );
}
