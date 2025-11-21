"use client";

import React, { useCallback, useMemo, useState } from "react";
import { ethers } from "ethers";
import type {
  OutcomeOption,
  MarketCard as MarketCardType,
} from "@/public/data/marketsData";
import MarketsABI from "@/contract/abi/abi.json"; // ← tu ABI real
import { marketIdHash } from "@/lib/evm";          // ← exporta keccak256(utf8)

type BetSlipOverlayProps = {
  market: MarketCardType | null;
  outcome:
    | OutcomeOption
    | (OutcomeOption & { __idx?: number; __yn?: "yes" | "no" })
    | null;
  stake: string;
  onChangeStake: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

// ✅ Tu contrato desplegado
const MARKET_CONTRACT = "0x97D9270799C3Be977cE3bb3088aA4d6A202ca286";

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function decimals() external view returns (uint8)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];

type TokenKey = "USDT" | "USDC" | "WETH" | "WBTC";

/* =========================
   Helpers
========================= */
function normalize(s?: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function parsePriceToFraction(price?: string | number | null): number | null {
  if (price == null) return null;
  const raw = String(price).trim();
  const pct = raw.match(/([\d.]+)\s*%/);
  if (pct) return Math.min(Math.max(parseFloat(pct[1]) / 100, 0), 1);
  const num = raw.match(/[\d.]+/);
  if (!num) return null;
  const v = parseFloat(num[0]);
  return v > 1 ? Math.min(Math.max(v / 100, 0), 1) : Math.min(Math.max(v, 0), 1);
}

function fmt(n: number, max = 2) {
  if (!isFinite(n)) return "--";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: max }).format(n);
}

/** Devuelve el alias hash (bytes32) siempre en MAYÚSCULAS (p.ej. "USDT") */
function aliasHashFromTokenKey(k: TokenKey) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(k.toUpperCase()));
}

/** Mapea (opción, yes/no) → índice on-chain aplanado */
function outcomeIndexForYesNo(optionIndex: number, yn: "yes" | "no") {
  const base = optionIndex * 2;
  return yn === "yes" ? base : base + 1;
}

/* =========================
   Componente principal
========================= */
export default function BetSlipOverlay({
  market,
  outcome,
  stake,
  onChangeStake,
  onClose,
  onConfirm,
}: BetSlipOverlayProps) {
  const visible = !!market && !!outcome;
  const [tokenKey, setTokenKey] = useState<TokenKey>("USDT");
  const [busy, setBusy] = useState(false);
  if (!visible || !market || !outcome) return null;

  const priceFrac = useMemo(
    () => parsePriceToFraction((outcome as any)?.price),
    [outcome]
  );

  const numericStake = useMemo(() => {
    const v = Number(stake);
    return isFinite(v) && v > 0 ? v : 0;
  }, [stake]);

  const receiveIfCorrect = useMemo(() => {
    if (!priceFrac || priceFrac <= 0 || numericStake <= 0) return null;
    return numericStake / priceFrac;
  }, [priceFrac, numericStake]);

  const netProfitIfCorrect = useMemo(() => {
    if (receiveIfCorrect == null) return null;
    return receiveIfCorrect - numericStake;
  }, [receiveIfCorrect, numericStake]);

  /** Selección del índice resultante (aplana Yes/No por opción si vienen __idx/__yn) */
  const resolveOutcomeIndex = useCallback((): number => {
    const optIdx = (outcome as any).__idx;
    const yn = (outcome as any).__yn as "yes" | "no" | undefined;

    // Caso ideal: la card pasa __idx (índice de opción) + __yn
    if (typeof optIdx === "number" && optIdx >= 0 && yn) {
      return outcomeIndexForYesNo(optIdx, yn);
    }

    // Fallback: buscar por label dentro de market.outcomes (para mercados que ya tienen outcomes “aplanados”)
    const list = (market as any).outcomes || [];
    const label = normalize((outcome as any).label);
    if (Array.isArray(list) && list.length > 0) {
      const found = list.findIndex(
        (o: any) => normalize(String(o?.label)) === label
      );
      if (found >= 0) return found;
    }

    // Último recurso
    return Number((outcome as any).id ?? 0);
  }, [market, outcome]);

  const handleBuy = useCallback(async () => {
    try {
      setBusy(true);
      const { ethereum } = window as any;
      if (!ethereum) {
        alert("No wallet EVM detectada");
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const marketCt = new ethers.Contract(
        MARKET_CONTRACT,
        MarketsABI as any,
        signer
      );

      // 1) Alias MAYÚSCULAS → hash → address desde el contrato
      const aliasHash = aliasHashFromTokenKey(tokenKey);
      const tokenAddress: string = await marketCt.tokenByAlias(aliasHash);

      if (!tokenAddress || tokenAddress === ethers.constants.AddressZero) {
        const net = await provider.getNetwork();
        alert(
          `Alias ${tokenKey} no está configurado en el contrato ${MARKET_CONTRACT}\n` +
            `ChainId actual=${net.chainId}.\n\n` +
            `Solución (OWNER): setTokenAlias("${tokenKey}", <tokenAddr>, true).`
        );
        return;
      }

      // 2) decimals, allowance y approve dinámicos
      const erc20 = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const dec: number = await erc20.decimals();

      const amount = ethers.utils.parseUnits(stake || "0", dec);
      if (amount.lte(0)) {
        alert("Monto inválido");
        return;
      }

      const ownerAddr = await signer.getAddress();
      const allowance: ethers.BigNumber = await erc20.allowance(
        ownerAddr,
        MARKET_CONTRACT
      );
      if (allowance.lt(amount)) {
        const tx1 = await erc20.approve(MARKET_CONTRACT, amount);
        await tx1.wait();
      }

      // 3) marketId y outcome
      const idBytes32 = marketIdHash(String((market as any).id));
      const outcomeIndex = resolveOutcomeIndex();

      // 4) Comprar por alias (el contrato resuelve la address)
      const tx2 = await marketCt.buyOutcomeByAlias(
        idBytes32,
        aliasHash,
        outcomeIndex,
        amount
      );
      await tx2.wait();

      alert("✅ Compra confirmada");
      onConfirm();
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.error?.message ||
        e?.reason ||
        e?.data?.message ||
        e?.message ||
        String(e);

      // Mensajes comunes más amigables
      if (msg.includes("NOT_STARTED")) {
        alert("El mercado aún no ha iniciado (NOT_STARTED).");
      } else if (msg.includes("ENDED")) {
        alert("El mercado ya terminó (ENDED).");
      } else if (msg.includes("PAUSED")) {
        alert("El mercado está en pausa.");
      } else if (msg.includes("TOKEN_NOT_ALLOWED")) {
        alert("Ese token no está permitido en el contrato.");
      } else if (msg.includes("NO_MARKET")) {
        alert("Ese marketId no existe on-chain (verifica el slug).");
      } else {
        alert("Error: " + msg);
      }
    } finally {
      setBusy(false);
    }
  }, [tokenKey, stake, market, resolveOutcomeIndex, onConfirm]);

  const tokenLabel = tokenKey;

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        width: 300,
        maxWidth: "90vw",
        background: "#fff",
        border: "1px solid #1a1a1a",
        borderRadius: 8,
        boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
        zIndex: 9999,
        fontFamily: "system-ui, -apple-system, 'Inter', sans-serif",
        opacity: busy ? 0.8 : 1,
        pointerEvents: busy ? "none" : "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(to right, #0a1f6b, #002d8a)",
          color: "#fff",
          padding: "10px 12px",
          fontSize: 13,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontWeight: 600 }}>Order</div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>
            {(market as any).title}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: 0,
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: 12, fontSize: 13, color: "#0f172a" }}>
        {/* Token picker */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>
            Pagar con
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 6,
            }}
          >
            {(["USDT", "USDC", "WETH", "WBTC"] as TokenKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setTokenKey(k)}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  padding: "6px 8px",
                  background: tokenKey === k ? "#0ea5e9" : "#f8fafc",
                  color: tokenKey === k ? "#fff" : "#0f172a",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Outcome */}
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            padding: "8px 10px",
            marginBottom: 12,
            background: "#f8fafc",
          }}
        >
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 2 }}>
            Selección
          </div>
          <div style={{ fontWeight: 600 }}>
            {(outcome as any).label}{" "}
            {(outcome as any).price ? `(${(outcome as any).price})` : ""}
            {(outcome as any).__yn ? ` • ${(outcome as any).__yn.toUpperCase()}` : ""}
          </div>
        </div>

        {/* Monto */}
        <label
          style={{
            display: "block",
            fontSize: 12,
            color: "#475569",
            marginBottom: 4,
          }}
        >
          Monto ({tokenLabel})
        </label>
        <input
          value={stake}
          onChange={(e) => onChangeStake(e.target.value)}
          placeholder="0.00"
          style={{
            width: "100%",
            borderRadius: 6,
            border: "1px solid #94a3b8",
            padding: "8px 10px",
            fontSize: 13,
            marginBottom: 10,
          }}
          inputMode="decimal"
        />

        {/* Preview */}
        <div
          style={{
            fontSize: 12,
            color: "#334155",
            background: "#f1f5f9",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            padding: "8px 10px",
            marginBottom: 12,
          }}
        >
          {priceFrac && numericStake > 0 ? (
            <>
              <div>
                Si aciertas, <b>recibes ≈ {fmt(receiveIfCorrect ?? 0)}</b>{" "}
                {tokenLabel}
              </div>
              <div>
                Ganancia neta ≈ <b>{fmt(netProfitIfCorrect ?? 0)}</b>{" "}
                {tokenLabel}
              </div>
            </>
          ) : (
            <div>Ingresa un monto para ver tu potencial retorno.</div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleBuy}
          style={{
            width: "100%",
            background: "#16a34a",
            border: "1px solid rgba(0,0,0,.1)",
            borderRadius: 6,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            padding: 10,
            cursor: "pointer",
          }}
        >
          {(outcome as any).__yn === "no" ? "Comprar No" : "Comprar Sí"}
        </button>

        <div
          style={{
            color: "#64748b",
            fontSize: 11,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          1) approve, 2) buy. (alias on-chain)
        </div>
      </div>
    </div>
  );
}
