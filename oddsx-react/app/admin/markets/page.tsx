"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import MarketsABI from "@/contract/abi/abi.json";
import {
  MARKETS,
  type MarketCard,
  officialIdFromSlug,
} from "@/public/data/marketsData";

// ⚠️ tu contrato
const CONTRACT = "0x97D9270799C3Be977cE3bb3088aA4d6A202ca286";

/* ============== Helpers ============== */
function toUnix(iso?: string | null) {
  if (!iso) return 0;
  const t = Date.parse(iso);
  if (isNaN(t)) return 0;
  return Math.floor(t / 1000);
}

function marketIdFromId(id: string) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(id));
}

function ocFromMarket(m: Pick<MarketCard, "marketType" | "outcomes">) {
  return m.marketType === "yesno" ? 2 : Math.max(2, (m.outcomes || []).length);
}

function codeBox(s: React.ReactNode) {
  return (
    <span
      style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: "2px 6px",
      }}
    >
      {s}
    </span>
  );
}

/* ============== Componente principal ============== */
export default function AdminMarketsPage() {
  const [account, setAccount] = useState("");
  const [owner, setOwner] = useState("");
  const [chainId, setChainId] = useState<number | null>(null);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  // selección de un mercado existente del JSON
  const [idx, setIdx] = useState(0);

  // crear “custom” desde el panel
  const [newId, setNewId] = useState("");
  const [newOfficialSlug, setNewOfficialSlug] = useState("");
  const [newOutcomeCount, setNewOutcomeCount] = useState(2);
  const [newStartIso, setNewStartIso] = useState("");
  const [newEndIso, setNewEndIso] = useState("");

  const isOwner = useMemo(
    () => !!owner && !!account && owner.toLowerCase() === account.toLowerCase(),
    [owner, account]
  );

  /* ============== bootstrap: wallet + owner ============== */
  useEffect(() => {
    (async () => {
      try {
        const { ethereum } = window as any;
        if (!ethereum) return;
        const provider = new ethers.providers.Web3Provider(ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const me = await signer.getAddress();
        setAccount(me);
        const net = await provider.getNetwork();
        setChainId(Number(net.chainId));
        const ct = new ethers.Contract(CONTRACT, MarketsABI as any, provider);
        setOwner(await ct.owner());
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  /* ============== utils contrato ============== */
 const getMeta = async (marketIdHex: string) => {
  const { ethereum } = window as any;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const ct = new ethers.Contract(CONTRACT, MarketsABI as any, provider);

  try {
    const meta = await ct.getMarketMeta(marketIdHex);
    return {
      exists: meta[0],
      paused: meta[1],
      outcomeCount: Number(meta[2]),
      resolved: meta[3],
      winningOutcome: Number(meta[4]),
      officialId: meta[5] as string,
      startTs: Number(meta[6]),
      endTs: Number(meta[7]),
    };
  } catch (e: any) {
    // Si el contrato revierte con "NO_MARKET", devolvemos exists=false
    const reason =
      e?.reason ||
      e?.error?.message ||
      e?.data?.message ||
      (Array.isArray(e?.errorArgs) && e.errorArgs[0]) ||
      "";
    if (String(reason).includes("NO_MARKET")) {
      return {
        exists: false,
        paused: false,
        outcomeCount: 0,
        resolved: false,
        winningOutcome: 0,
        officialId: ethers.constants.HashZero,
        startTs: 0,
        endTs: 0,
      };
    }
    throw e;
  }
};


  const createMarketTx = async (
    marketIdHex: string,
    outcomeCount: number,
    startTs: number,
    endTs: number,
    officialId: string
  ) => {
    const { ethereum } = window as any;
    if (!ethereum) throw new Error("Wallet no detectada");
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const ct = new ethers.Contract(CONTRACT, MarketsABI as any, signer);
    if (!isOwner) throw new Error("Debes conectar la cuenta OWNER del contrato.");
    const tx = await ct.createMarket(
      marketIdHex,
      outcomeCount,
      startTs,
      endTs,
      officialId
    );
    await tx.wait();
  };

  const setPausedTx = async (marketIdHex: string, paused: boolean) => {
    const { ethereum } = window as any;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const ct = new ethers.Contract(CONTRACT, MarketsABI as any, signer);
    if (!isOwner) throw new Error("Debes conectar la cuenta OWNER del contrato.");
    const tx = await ct.setMarketPaused(marketIdHex, paused);
    await tx.wait();
  };

  /* ============== acciones (MARKETS JSON) ============== */
  const createSelected = async () => {
    try {
      setBusy("Creando mercado seleccionado…");
      setMsg("");
      const m = MARKETS[idx];
      const marketIdHex = marketIdFromId(m.id);
      const meta = await getMeta(marketIdHex).catch(() => null);
      if (meta?.exists) {
        setMsg(`Ya existe: ${m.id}`);
        return;
      }
      const oc = ocFromMarket(m);
      const startTs = toUnix(m.startsAt);
      const endTs = toUnix(m.endsAt);
      const officialId = (m.officialId as unknown as string) || ethers.constants.HashZero;
      await createMarketTx(marketIdHex, oc, startTs, endTs, officialId);
      setMsg(`✅ Creado: ${m.id}`);
    } catch (e: any) {
      setMsg(e?.reason || e?.message || String(e));
      console.error(e);
    } finally {
      setBusy("");
    }
  };

  const createAll = async () => {
    try {
      setBusy("Creando TODOS los mercados…");
      setMsg("");
      for (let i = 0; i < MARKETS.length; i++) {
        const m = MARKETS[i];
        const marketIdHex = marketIdFromId(m.id);
        const meta = await getMeta(marketIdHex).catch(() => null);
        if (meta?.exists) continue;
        const oc = ocFromMarket(m);
        const startTs = toUnix(m.startsAt);
        const endTs = toUnix(m.endsAt);
        const officialId =
          (m.officialId as unknown as string) || ethers.constants.HashZero;
        // eslint-disable-next-line no-await-in-loop
        await createMarketTx(marketIdHex, oc, startTs, endTs, officialId);
      }
      setMsg("✅ Terminado: Create ALL");
    } catch (e: any) {
      setMsg(e?.reason || e?.message || String(e));
      console.error(e);
    } finally {
      setBusy("");
    }
  };

  const checkSelected = async () => {
    try {
      setBusy("Consultando meta…");
      setMsg("");
      const m = MARKETS[idx];
      const marketIdHex = marketIdFromId(m.id);
      const meta = await getMeta(marketIdHex);
      setMsg(
        `exists=${meta.exists} paused=${meta.paused} outcomes=${meta.outcomeCount} startTs=${meta.startTs} endTs=${meta.endTs}`
      );
    } catch (e: any) {
      setMsg(e?.reason || e?.message || String(e));
      console.error(e);
    } finally {
      setBusy("");
    }
  };

  const togglePauseSelected = async () => {
    try {
      setBusy("Toggling pause…");
      setMsg("");
      const m = MARKETS[idx];
      const marketIdHex = marketIdFromId(m.id);
      const meta = await getMeta(marketIdHex);
      await setPausedTx(marketIdHex, !meta.paused);
      const again = await getMeta(marketIdHex);
      setMsg(`paused=${again.paused}`);
    } catch (e: any) {
      setMsg(e?.reason || e?.message || String(e));
      console.error(e);
    } finally {
      setBusy("");
    }
  };

  /* ============== acciones (CUSTOM) ============== */
  const createCustom = async () => {
    try {
      setBusy("Creando custom…");
      setMsg("");
      if (!newId.trim()) throw new Error("Falta id (slug).");
      if (newOutcomeCount < 2) throw new Error("outcomeCount mínimo: 2.");

      const marketIdHex = marketIdFromId(newId.trim());
      const startTs = toUnix(newStartIso) || 0;
      const endTs = toUnix(newEndIso) || 0;
      // officialId: si no pones slug, queda 0x0
      const officialId = newOfficialSlug
        ? (officialIdFromSlug(newOfficialSlug) as unknown as string)
        : ethers.constants.HashZero;

      const meta = await getMeta(marketIdHex).catch(() => null);
      if (meta?.exists) {
        setMsg(`Ya existe: ${newId}`);
        return;
      }
      await createMarketTx(marketIdHex, newOutcomeCount, startTs, endTs, officialId);
      setMsg(`✅ Creado custom: ${newId}`);
    } catch (e: any) {
      setMsg(e?.reason || e?.message || String(e));
      console.error(e);
    } finally {
      setBusy("");
    }
  };

  const checkCustom = async () => {
    try {
      setBusy("Consultando custom…");
      setMsg("");
      if (!newId.trim()) throw new Error("Falta id (slug).");
      const marketIdHex = marketIdFromId(newId.trim());
      const meta = await getMeta(marketIdHex);
      setMsg(
        `exists=${meta.exists} paused=${meta.paused} outcomes=${meta.outcomeCount} startTs=${meta.startTs} endTs=${meta.endTs}`
      );
    } catch (e: any) {
      setMsg(e?.reason || e?.message || String(e));
      console.error(e);
    } finally {
      setBusy("");
    }
  };

  const togglePauseCustom = async () => {
    try {
      setBusy("Toggling pause custom…");
      setMsg("");
      if (!newId.trim()) throw new Error("Falta id (slug).");
      const marketIdHex = marketIdFromId(newId.trim());
      const meta = await getMeta(marketIdHex);
      await setPausedTx(marketIdHex, !meta.paused);
      const again = await getMeta(marketIdHex);
      setMsg(`paused=${again.paused}`);
    } catch (e: any) {
      setMsg(e?.reason || e?.message || String(e));
      console.error(e);
    } finally {
      setBusy("");
    }
  };

  /* ============== UI ============== */
  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: 16 }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
        Admin • Mercados on-chain
      </h1>

      <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>
        Contrato {codeBox(CONTRACT)} • Owner {codeBox(owner || "(…)") } •
        Cuenta {codeBox(account || "(…)")} • chainId {codeBox(String(chainId ?? "…"))}
        <br />
        {isOwner ? "✅ Estás con el owner" : "⚠️ Conecta la cuenta owner para crear/pausar"}
      </div>

      {/* ========== Bloque A: desde tu JSON MARKETS ========== */}
      <section style={{ marginTop: 16, padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
          Crear desde MARKETS (archivo JSON)
        </h3>

        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          <label>
            Selecciona mercado
            <select
              value={idx}
              onChange={(e) => setIdx(Number(e.target.value))}
              style={{ display: "block", width: "100%", marginTop: 6, padding: 8, borderRadius: 8, border: "1px solid #cbd5e1" }}
            >
              {MARKETS.map((m, i) => (
                <option key={m.id} value={i}>
                  {m.title} — {m.id}
                </option>
              ))}
            </select>
          </label>

          <div style={{ fontSize: 12, color: "#334155" }}>
            marketId = keccak256(id) = {codeBox(marketIdFromId(MARKETS[idx].id))} •
            outcomes = {ocFromMarket(MARKETS[idx])} •
            startTs = {toUnix(MARKETS[idx].startsAt)} • endTs = {toUnix(MARKETS[idx].endsAt)}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={checkSelected}
              style={{ padding: "8px 12px", borderRadius: 8, background: "#e2e8f0", border: 0, cursor: "pointer" }}
            >
              Ver meta
            </button>
            <button
              onClick={createSelected}
              disabled={!isOwner || !!busy}
              style={{ padding: "8px 12px", borderRadius: 8, background: "#22c55e", color: "#fff", fontWeight: 700, border: 0, cursor: "pointer" }}
            >
              Crear seleccionado
            </button>
            <button
              onClick={togglePauseSelected}
              disabled={!isOwner || !!busy}
              style={{ padding: "8px 12px", borderRadius: 8, background: "#0ea5e9", color: "#fff", fontWeight: 700, border: 0, cursor: "pointer" }}
            >
              Pausar / Reanudar
            </button>
            <button
              onClick={createAll}
              disabled={!isOwner || !!busy}
              style={{ padding: "8px 12px", borderRadius: 8, background: "#111827", color: "#fff", fontWeight: 700, border: 0, cursor: "pointer" }}
            >
              Crear TODOS
            </button>
          </div>
        </div>
      </section>

      {/* ========== Bloque B: crear CUSTOM ========== */}
      <section style={{ marginTop: 16, padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
          Crear mercado nuevo (custom)
        </h3>

        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          <label>
            id (slug usado por tu UI)
            <input
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              placeholder="eth-october-price"
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1" }}
            />
          </label>

          <label>
            officialId slug (opcional, se hashea a bytes32)
            <input
              value={newOfficialSlug}
              onChange={(e) => setNewOfficialSlug(e.target.value)}
              placeholder="eth-october-price"
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1" }}
            />
          </label>

          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(3,1fr)" }}>
            <label>
              outcomeCount
              <input
                type="number"
                min={2}
                value={newOutcomeCount}
                onChange={(e) => setNewOutcomeCount(Number(e.target.value))}
                style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1" }}
              />
            </label>
            <label>
              startsAt (ISO, opcional)
              <input
                value={newStartIso}
                onChange={(e) => setNewStartIso(e.target.value)}
                placeholder="2025-10-01T00:00:00Z"
                style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1" }}
              />
            </label>
            <label>
              endsAt (ISO, opcional)
              <input
                value={newEndIso}
                onChange={(e) => setNewEndIso(e.target.value)}
                placeholder="2025-10-31T23:59:59Z"
                style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1" }}
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={checkCustom}
              style={{ padding: "8px 12px", borderRadius: 8, background: "#e2e8f0", border: 0, cursor: "pointer" }}
            >
              Ver meta
            </button>
            <button
              onClick={createCustom}
              disabled={!isOwner || !!busy}
              style={{ padding: "8px 12px", borderRadius: 8, background: "#22c55e", color: "#fff", fontWeight: 700, border: 0, cursor: "pointer" }}
            >
              Crear custom
            </button>
            <button
              onClick={togglePauseCustom}
              disabled={!isOwner || !!busy}
              style={{ padding: "8px 12px", borderRadius: 8, background: "#0ea5e9", color: "#fff", fontWeight: 700, border: 0, cursor: "pointer" }}
            >
              Pausar / Reanudar custom
            </button>
          </div>
        </div>
      </section>

      {busy && (
        <div style={{ marginTop: 12, fontSize: 12, color: "#475569" }}>
          {busy}
        </div>
      )}
      {msg && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#111827" }}>
          {msg}
        </div>
      )}
    </div>
  );
}
