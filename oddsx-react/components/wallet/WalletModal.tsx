"use client";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onPick: (kind: "metamask" | "walletconnect" | "coinbase") => void;
};

export default function WalletModal({ open, onClose, onPick }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-[92%] max-w-[420px] rounded-2xl bg-[#111827] text-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4">Conectar wallet</h3>
        <div className="grid gap-3">
          <button onClick={() => onPick("metamask")} className="w-full rounded-xl px-4 py-3 bg-white/5 hover:bg-white/10 transition">
            MetaMask (injected)
          </button>
          <button onClick={() => onPick("walletconnect")} className="w-full rounded-xl px-4 py-3 bg-white/5 hover:bg-white/10 transition">
            WalletConnect (QR)
          </button>
          <button onClick={() => onPick("coinbase")} className="w-full rounded-xl px-4 py-3 bg-white/5 hover:bg-white/10 transition">
            Coinbase Wallet
          </button>
        </div>
        <button onClick={onClose} className="mt-5 w-full rounded-xl border border-white/15 px-4 py-2 hover:bg-white/10">
          Cerrar
        </button>
      </div>
    </div>
  );
}
