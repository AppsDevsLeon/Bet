"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useWallet } from "@/hooks/useWallet";
import Language from "./Language";

type Props = {
  onSearchNavigateTo?: string; // default: "/search"
  logoSrc?: string;            // default: "/images/logo.png"
  logoAlt?: string;            // default: "Olympiabet"
};

export default function HeaderBlue({
  onSearchNavigateTo = "/search",
  logoSrc = "/images/logo.png",
  logoAlt = "Olympiabet",
}: Props) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { t } = useI18n();

  // Web3 (MetaMask vía useWallet)
  const { account, connect, disconnect, ui, isConnecting, error } = useWallet();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const href = `${onSearchNavigateTo}?q=${encodeURIComponent(q)}`;
    router.push(href);
  };

  const walletCta = useMemo(() => {
    if (account) {
      return (
        <div className="wallet-chip">
          <span className="chip">{ui.label}</span>
          <button className="btn-outline" onClick={disconnect}>
            {t("Wallet.disconnect", "Desconectar")}
          </button>
        </div>
      );
    }
    return (
      <button
        className="btn-solid btn-wallet" /* 👈 cuadrado */
        onClick={connect}
        disabled={isConnecting}
        aria-busy={isConnecting}
      >
        {isConnecting ? t("Wallet.connecting", "Conectando...") : t("Wallet.connect", "Connect Wallet")}
      </button>
    );
  }, [account, connect, disconnect, isConnecting, t, ui.label]);

  // (Opcional) auto-limpieza de toasts
  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => {/* noop visual-only */}, 3000);
    return () => clearTimeout(id);
  }, [error]);

  return (
    <header className="header-blue">
      <div className="topbar-blue">
        <div className="topbar-inner">
          {/* Logo */}
          <Link href="/" className="brand" aria-label={logoAlt}>
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={36}
              height={36}
              className="brand-img"
              priority
            />
            <span className="brand-text">{logoAlt}</span>
          </Link>

          {/* Search con LUPA dentro del input */}
          <form className="search-wrap" onSubmit={onSubmit} role="search" aria-label={t("Search.aria", "Búsqueda del sitio")}>
            <input
              type="search"
              className="search-input with-icon"
              placeholder={t("Search.placeholder", "Make your search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="search-icon-btn"
              aria-label={t("Search.submit", "Buscar")}
              title={t("Search.submit", "Buscar")}
            >
              {/* SVG lupa */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true" focusable="false"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-3.5-3.5"></path>
              </svg>
            </button>
          </form>

          {/* Idiomas + Wallet */}
          <div className="actions">
            <div className="language"><Language /></div> {/* 👈 wrapper para estilos */}
            {walletCta}
          </div>
        </div>
      </div>

      {/* Toast de error simple (si falla la wallet) */}
      {!!error && <div className="wallet-error">{error}</div>}
    </header>
  );
}
