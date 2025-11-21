"use client";
import React from "react";

export type TokenKey = "USDT" | "USDC" | "WETH" | "WBTC" | "SOL";

export const TOKENS: Record<TokenKey, {
  label: string;
  icon: string;
  address?: `0x${string}`; // EVM; SOL no lleva
}> = {
  USDT: { label: "USDT (Polygon)", icon: "https://raw.githubusercontent.com/AppsDevsLeon/web3icons/refs/heads/main/raw-svgs/tokens/background/BTC.svg", address: "0x3813e82e6f7098b9583FC0F33a962D02018B6803" },
  USDC: { label: "USDC (Polygon)", icon: "/icons/usdc.svg", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" },
  WETH: { label: "WETH (Polygon)", icon: "/icons/eth.svg",  address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619" },
  WBTC: { label: "WBTC (Polygon)", icon: "/icons/btc.svg",  address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6" },
  SOL:  { label: "SOL (Solana)",   icon: "/icons/sol.svg" },
};

export default function TokenPicker({
  value,
  onChange,
}: {
  value: TokenKey;
  onChange: (v: TokenKey) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {(Object.keys(TOKENS) as TokenKey[]).map(k => (
        <button
          key={k}
          onClick={() => onChange(k)}
          title={TOKENS[k].label}
          style={{
            width: 36, height: 36, borderRadius: 8,
            border: value===k ? "2px solid #1E3C8E" : "1px solid #cbd5e1",
            background: "#fff", padding: 4, cursor: "pointer"
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={TOKENS[k].icon} alt={k} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </button>
      ))}
    </div>
  );
}
