"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ethers } from "ethers";

type WalletState = {
  account: string | null;
  chainId: number | null;
  provider: any | null;          // EIP-1193 provider (window.ethereum)
  signer: ethers.Signer | null;
  isConnecting: boolean;
  error?: string | null;
};

const LS_KEY = "oddsx_preferred_wallet";
const DESIRED_CHAIN = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || 137); // Polygon por defecto

function short(addr?: string | null) {
  return addr ? addr.slice(0, 6) + "…" + addr.slice(-4) : "";
}

export function useWallet(onReadySigner?: (signer: ethers.Signer) => void) {
  const [state, setState] = useState<WalletState>({
    account: null,
    chainId: null,
    provider: null,
    signer: null,
    isConnecting: false,
    error: null,
  });

  const removeListenersRef = useRef<() => void>(() => {});

  const setError = (e: any) =>
    setState((s) => ({ ...s, error: typeof e === "string" ? e : e?.message || "Wallet error" }));

  const reset = useCallback(() => {
    // quita listeners si existen
    try { removeListenersRef.current?.(); } catch {}
    setState({
      account: null,
      chainId: null,
      provider: null,
      signer: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  const attachListeners = useCallback((provAny: any) => {
    if (!provAny?.on) {
      removeListenersRef.current = () => {};
      return;
    }
    const onAcc = (accs: string[]) => {
      if (!accs || accs.length === 0) {
        localStorage.removeItem(LS_KEY);
        reset();
      } else {
        setState((s) => ({ ...s, account: accs[0] }));
      }
    };
    const onChain = (hex: string | number) => {
      const id = typeof hex === "string" ? parseInt(hex, 16) : Number(hex);
      setState((s) => ({ ...s, chainId: id }));
    };
    const onDisc = () => {
      localStorage.removeItem(LS_KEY);
      reset();
    };

    provAny.on("accountsChanged", onAcc);
    provAny.on("chainChanged", onChain);
    provAny.on("disconnect", onDisc);

    removeListenersRef.current = () => {
      try {
        provAny.removeListener?.("accountsChanged", onAcc);
        provAny.removeListener?.("chainChanged", onChain);
        provAny.removeListener?.("disconnect", onDisc);
      } catch {}
    };
  }, [reset]);

  const ensureDesiredChain = useCallback(async (ethereum: any) => {
    if (!DESIRED_CHAIN) return;
    const wantedHex = "0x" + DESIRED_CHAIN.toString(16);
    const currentHex: string = await ethereum.request({ method: "eth_chainId" });
    if (currentHex?.toLowerCase() === wantedHex.toLowerCase()) return;

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: wantedHex }],
      });
    } catch (e: any) {
      if (e?.code === 4902) {
        // Add Polygon si falta
        if (DESIRED_CHAIN === 137) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0x89",
              chainName: "Polygon Mainnet",
              nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
              rpcUrls: ["https://polygon-rpc.com"],
              blockExplorerUrls: ["https://polygonscan.com"],
            }],
          });
        } else {
          throw new Error("Red deseada no disponible y no se configuró 'wallet_addEthereumChain'.");
        }
      } else {
        throw e;
      }
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      setState((s) => ({ ...s, isConnecting: true, error: null }));

      const injected = typeof window !== "undefined" ? (window as any).ethereum : null;
      if (!injected) throw new Error("MetaMask no está instalado.");

      // solicita cuentas
      const accounts: string[] = await injected.request({ method: "eth_requestAccounts" });

      // asegura red deseada (opcional)
      await ensureDesiredChain(injected);

      // obtiene chainId final
      const chainHex: string = await injected.request({ method: "eth_chainId" });
      const chainId = parseInt(chainHex, 16);

      const provider = new ethers.providers.Web3Provider(injected, "any");
      const signer = provider.getSigner();

      setState({
        account: accounts[0],
        chainId,
        provider: injected,
        signer,
        isConnecting: false,
        error: null,
      });

      localStorage.setItem(LS_KEY, "metamask");
      attachListeners(injected);
      onReadySigner?.(signer);
    } catch (e) {
      setError(e);
      reset();
    } finally {
      setState((s) => ({ ...s, isConnecting: false }));
    }
  }, [attachListeners, ensureDesiredChain, onReadySigner, reset]);

  const disconnect = useCallback(() => {
    try { removeListenersRef.current?.(); } catch {}
    localStorage.removeItem(LS_KEY);
    reset();
  }, [reset]);

  // Auto-reconnect (solo si antes se conectó MetaMask)
  useEffect(() => {
    const preferred = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
    if (preferred === "metamask" && !state.account && !state.isConnecting) {
      connect().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ui = useMemo(
    () => ({
      label: state.account ? short(state.account) : "Connect Wallet",
      networkOk: !state.chainId || !!state.chainId,
    }),
    [state.account, state.chainId]
  );

  return { ...state, connect, disconnect, ui };
}
