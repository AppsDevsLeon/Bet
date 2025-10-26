"use client";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { createPortal } from "react-dom";

/* ===== Tipos ===== */
export type Token = { symbol: string; address?: `0x${string}`; decimals: number };
export type ChainConfig = {
  chainId: number; name: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls: string[]; blockExplorerUrls: string[]; tokens: Token[];
};
type EIP1193 = { isMetaMask?: boolean; request: (args:{method:string;params?:any[]|Record<string,any>})=>Promise<any> };
declare global { interface Window { ethereum?: EIP1193 } }
export type OnDonePayload = { chain: ChainConfig; token: Token; account: string | null; balance: string; amount: string };

type Props = {
  open: boolean; onClose: () => void;
  chains: ChainConfig[];                   // requerido
  iconCatalogUrl: string;                  // URL pública del JSON de íconos
  onDone: (res: OnDonePayload) => void;
};

/* ===== Iconos ===== */
type IconCatalog = { count?: number; base?: string; items: { symbol: string; url: string }[] };
const FALLBACK_SVG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" fill="%23000"/><text x="50%" y="52%" font-size="18" fill="%23fff" text-anchor="middle" font-family="Arial">?</text></svg>';

async function fetchIconCatalog(url: string): Promise<IconCatalog> {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`No se pudo cargar iconCatalog (${r.status})`);
  return (await r.json()) as IconCatalog;
}
const toMap = (cat: IconCatalog) => {
  const m: Record<string, string> = {};
  for (const it of cat.items || []) m[it.symbol.toUpperCase()] = it.url;
  return { map: m, base: cat.base || "" };
};

/* ===== MetaMask helpers ===== */
const toHexChainId = (id: number) => "0x" + id.toString(16);
async function ensureChain(eth: EIP1193, cfg: ChainConfig) {
  try {
    await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: toHexChainId(cfg.chainId) }] });
  } catch (err: any) {
    if (err?.code === 4902) {
      await eth.request({ method: "wallet_addEthereumChain", params: [{
        chainId: toHexChainId(cfg.chainId), chainName: cfg.name, nativeCurrency: cfg.nativeCurrency,
        rpcUrls: cfg.rpcUrls, blockExplorerUrls: cfg.blockExplorerUrls,
      }]});
    } else throw err;
  }
}
async function requestAccount(eth: EIP1193) {
  const accs = await eth.request({ method: "eth_requestAccounts" });
  if (!Array.isArray(accs) || !accs[0]) throw new Error("No account authorized");
  return String(accs[0]).toLowerCase();
}
const pad32 = (s: string) => s.padStart(64, "0");
const strip0x = (h: string) => (h.startsWith("0x") ? h.slice(2) : h);
const encodeBalanceOfData = (account: string) => "0x" + "70a08231" + pad32(strip0x(account));

function requireBI() {
  const BI = (globalThis as any).BigInt;
  if (typeof BI !== "function") throw new Error("BigInt no soportado por este navegador.");
  return BI;
}
async function getERC20Balance(eth: EIP1193, tokenAddr: `0x${string}`, account: string) {
  const data = encodeBalanceOfData(account);
  return String(await eth.request({ method: "eth_call", params: [{ to: tokenAddr, data }, "latest"] }));
}
async function getNativeBalance(eth: EIP1193, account: string) {
  return String(await eth.request({ method: "eth_getBalance", params: [account, "latest"] }));
}
function formatUnitsHex(hexValue: string, decimals: number) {
  const BI = requireBI();
  const dec = Number.isFinite(decimals) ? Math.max(0, Math.min(36, Math.trunc(decimals))) : 18;
  const val = BI(hexValue);
  let base = BI(1);
  for (let i = 0; i < dec; i++) base = base * BI(10);
  const isNeg = val < BI(0);
  const abs = isNeg ? -val : val;
  const whole = abs / base;
  let frac = (abs % base).toString();
  while (frac.length < dec) frac = "0" + frac;
  frac = frac.replace(/0+$/, "");
  return (isNeg ? "-" : "") + (frac ? `${whole.toString()}.${frac}` : whole.toString());
}

/* ===== Portal ===== */
function usePortal(id = "modal-root") {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let target = document.getElementById(id);
    let created = false;
    if (!target) { target = document.createElement("div"); target.id = id; document.body.appendChild(target); created = true; }
    target.style.zIndex = "2147483647";
    setEl(target);
    return () => { if (created && target?.parentNode) target.parentNode.removeChild(target); };
  }, [id]);
  return el;
}

/* ===== Modal ===== */
export default function CryptoSelectorModal({
  open, onClose, chains = [], iconCatalogUrl, onDone,
}: Props) {
  const portalEl = usePortal("modal-root");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // bloquear scroll
  useEffect(() => {
    if (!mounted) return;
    if (open) { const prev = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = prev; }; }
  }, [open, mounted]);

  // iconos
  const [iconMap, setIconMap] = useState<Record<string, string>>({});
  const [iconBase, setIconBase] = useState<string>("");
  const [iconErr, setIconErr] = useState<string | null>(null);
  const [loadingIcons, setLoadingIcons] = useState(false);

  // pasos + estado
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [search, setSearch] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<ChainConfig | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<string>("");

  // wallet
  const [checking, setChecking] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [err, setErr] = useState<string | null>(null);

  // cargar catálogo de iconos
  useEffect(() => {
    if (!open) return;
    setStep(1); setSearch(""); setSelectedSymbol(null);
    setSelectedChain(null); setSelectedToken(null); setAmount("");
    setAccount(null); setBalance("0"); setErr(null);

    let alive = true;
    (async () => {
      setLoadingIcons(true); setIconErr(null);
      try {
        const key = `iconCatalog:${iconCatalogUrl}`;
        const cached = typeof window !== "undefined" ? localStorage.getItem(key) : null;
        if (cached) {
          const parsed = JSON.parse(cached) as IconCatalog;
          if (!alive) return;
          const { map, base } = toMap(parsed);
          setIconMap(map); setIconBase(base || "");
        } else {
          const cat = await fetchIconCatalog(iconCatalogUrl);
          if (!alive) return;
          const { map, base } = toMap(cat);
          setIconMap(map); setIconBase(base || "");
          localStorage.setItem(key, JSON.stringify(cat));
        }
      } catch (e: any) {
        if (!alive) return;
        setIconErr(e?.message || "No se pudieron cargar íconos (se usarán fallbacks).");
      } finally {
        if (alive) setLoadingIcons(false);
      }
    })();
    return () => { alive = false; };
  }, [open, iconCatalogUrl]);

  // símbolos
  const allSymbols = useMemo(() => {
    const set = new Set<string>();
    for (const c of chains) for (const t of c.tokens) set.add(t.symbol.toUpperCase());
    return Array.from(set).sort();
  }, [chains]);

  const filteredSymbols = useMemo(() => {
    const s = search.trim().toLowerCase();
    return allSymbols.filter(sym => !s || sym.toLowerCase().includes(s));
  }, [allSymbols, search]);

  const iconFor = (symbol: string) => {
    const s = symbol.toUpperCase();
    if (iconMap[s]) return iconMap[s];
    // fallback: intenta base/SYMBOL.svg
    if (iconBase) return `${iconBase}/${s}.svg`;
    return FALLBACK_SVG;
  };

  // redes disponibles para el símbolo
  const supportedChainsForSymbol = useMemo(() => {
    if (!selectedSymbol) return [];
    return chains.filter(c => c.tokens.some(t => t.symbol.toUpperCase() === selectedSymbol.toUpperCase()));
  }, [chains, selectedSymbol]);

  const canContinueAmount = useMemo(
    () => /^[0-9]+(?:[.,][0-9]{1,18})?$/.test(amount) && parseFloat(amount.replace(",", ".")) > 0,
    [amount]
  );

  async function connectAndCheck() {
    setErr(null);
    try {
      if (!selectedChain || !selectedToken) { setErr("Elige red y token."); return; }
      if (!window.ethereum) { setErr("MetaMask no detectado."); return; }
      setChecking(true);
      const eth = window.ethereum!;
      const acc = await requestAccount(eth);
      setAccount(acc);
      await ensureChain(eth, selectedChain);

      const balHex = selectedToken.address
        ? await getERC20Balance(eth, selectedToken.address, acc)
        : await getNativeBalance(eth, acc);

      const dec = selectedToken.address ? selectedToken.decimals : selectedChain.nativeCurrency.decimals;
      const balFmt = formatUnitsHex(String(balHex), dec);
      setBalance(balFmt);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || "Error al verificar saldo.");
    } finally {
      setChecking(false);
    }
  }

  const hasEnough = useMemo(() => {
    const need = parseFloat(amount.replace(",", ".") || "0");
    const have = parseFloat(balance || "0");
    return Number.isFinite(need) && Number.isFinite(have) && need > 0 && have >= need;
  }, [amount, balance]);

  // lista de tarjetas (arregla hooks condicionales)
  const symbolCards = useMemo(() =>
    filteredSymbols.map(sym => (
      <button
        key={sym} type="button" aria-label={`Elegir ${sym}`}
        onClick={() => { setSelectedSymbol(sym); setStep(2); }}
        className="rounded-3"
        style={{
          background: "#0a0a0a", border: "1px solid #1f1f1f", padding: 12,
          minHeight: 96, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}
      >
        <span className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
              style={{ width: 44, height: 44, background: "#111" }}>
          <img
            src={iconFor(sym)} alt={sym} width={24} height={24} loading="lazy" referrerPolicy="no-referrer"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_SVG; }}
            style={{ filter: "invert(1) brightness(1.2)" }}
          />
        </span>
        <span className="fw-semibold" style={{ fontSize: 12 }}>{sym}</span>
      </button>
    ))
  , [filteredSymbols, iconMap, iconBase]);

  if (!mounted || !portalEl) return null;

  return createPortal(
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" onClose={onClose}>
        {/* overlay por encima de todo */}
        <Transition.Child as={Fragment}
          enter="ease-out duration-150" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0" style={{ background: "rgba(0,0,0,0.65)", zIndex: 2147483646 }} />
        </Transition.Child>

        {/* panel centrado */}
        <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 2147483647 }}>
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}
              enter="ease-out duration-150" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-100" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-5xl rounded-4 shadow-xl" style={{ background: "#062925", color: "#fff", padding: 16 }}>
                <Dialog.Title className="fw-bold fs-five mb-2">
                  {(() => {
                    if (loadingIcons && step === 1) return "Cargando íconos…";
                    if (step === 1) return "Selecciona la cripto";
                    if (step === 2) return `Selecciona la red para ${selectedSymbol}`;
                    return `Ingresa monto (${selectedToken?.symbol}) y verifica saldo`;
                  })()}
                </Dialog.Title>

                {iconErr && <div className="alert alert-warning fs-eight mb-3">{iconErr}</div>}

                {/* Paso 1: matriz 6×6 */}
                {step === 1 && (
                  <>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        style={{ background: "#262626", color: "#fff", border: "1px solid #222" }}
                        placeholder="Buscar token… (ej. USDT, ETH)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 12 }}>
                      {symbolCards}
                    </div>
                    <div className="d-flex justify-content-end mt-4">
                      <button className="cmn-btn third-alt px-4 py-2" onClick={onClose}>Cerrar</button>
                    </div>
                  </>
                )}

                {/* Paso 2: redes */}
                {step === 2 && (
                  <>
                    <div className="mb-2 fs-eight">Redes disponibles para <b>{selectedSymbol}</b>:</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 12 }}>
                      {supportedChainsForSymbol.map((c) => (
                        <button
                          key={c.chainId} type="button" aria-label={`Elegir ${c.name}`}
                          className="rounded-3"
                          style={{ background: "#0a0a0a", border: "1px solid #1f1f1f", padding: 12, minHeight: 88,
                                   display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}
                          onClick={() => {
                            const tok = c.tokens.find(t => t.symbol.toUpperCase() === selectedSymbol!.toUpperCase())!;
                            setSelectedChain(c); setSelectedToken(tok); setStep(3);
                          }}
                        >
                          <span className="fw-semibold" style={{ fontSize: 12 }}>{c.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <button className="cmn-btn third-alt px-4 py-2" onClick={() => setStep(1)}>Atrás</button>
                      <button className="cmn-btn px-4 py-2" onClick={() => setStep(3)} disabled={!selectedChain}>Continuar</button>
                    </div>
                  </>
                )}

                {/* Paso 3: monto + verificar */}
                {step === 3 && (
                  <>
                    <div className="mb-3 fs-eight">Token: <b>{selectedToken?.symbol}</b> • Red: <i>{selectedChain?.name}</i></div>
                    <div className="mb-3">
                      <label className="form-label fs-eight">¿Cuánto deseas apostar?</label>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="text" inputMode="decimal" pattern="^[0-9]+(?:[.,][0-9]{1,18})?$"
                          className="form-control"
                          style={{ background: "#062925", color: "#fff", border: "1px solid #222" }}
                          placeholder={`Monto en ${selectedToken?.symbol ?? ""}`}
                          value={amount} onChange={(e) => setAmount(e.target.value.trim())}
                        />
                        <button type="button" className="cmn-btn third-alt px-3 py-2" onClick={() => setAmount("100")}>100</button>
                      </div>
                      <div className="fs-nine mt-1 n3-color">Máx 18 decimales. Ej: 12.34</div>
                    </div>

                    <div className="mb-3 d-flex flex-wrap align-items-center gap-3">
                      <button type="button" className="cmn-btn px-3 py-2"
                              onClick={connectAndCheck} disabled={!canContinueAmount || checking}
                              aria-disabled={!canContinueAmount || checking}>
                        {checking ? "Verificando…" : "Conectar y verificar saldo"}
                      </button>
                      {account && <span className="fs-eight text-truncate" title={account}>Cuenta: {account.slice(0,6)}...{account.slice(-4)}</span>}
                      {selectedToken && <span className="fs-eight">Saldo: <b>{balance}</b> {selectedToken.symbol}</span>}
                      {err && <span className="fs-eight" style={{ color: "#ff6060" }}>{err}</span>}
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                      <button className="cmn-btn third-alt px-4 py-2" onClick={() => setStep(2)}>Atrás</button>
                      <button className="cmn-btn px-4 py-2" disabled={!hasEnough} aria-disabled={!hasEnough}
                              onClick={() => { if (!selectedChain || !selectedToken) return;
                                onDone({ chain: selectedChain, token: selectedToken, account, balance, amount }); onClose(); }}>
                        Continuar
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>,
    portalEl
  );
}
