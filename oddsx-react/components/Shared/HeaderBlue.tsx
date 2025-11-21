"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useWallet } from "@/hooks/useWallet";
import Language from "./Language";
import NavItem from "./NavItem";

type Props = {
  onSearchNavigateTo?: string; // default: "/search"
  logoSrc?: string;            // default: "/images/logo.png"
  logoAlt?: string;            // default: "Olympiabet"
  brandTextOverride?: string;  // opcional
};

export default function HeaderBlue({
  onSearchNavigateTo = "/search",
  logoSrc = "/images/logo.png",
  logoAlt = "Olympiabet",
  brandTextOverride,
}: Props) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { t } = useI18n();
  const { account, connect, disconnect, ui, isConnecting, error } = useWallet();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`${onSearchNavigateTo}?q=${encodeURIComponent(q)}`);
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
        className="btn-solid"
        onClick={connect}
        disabled={isConnecting}
        aria-busy={isConnecting}
      >
        {isConnecting
          ? t("Wallet.connecting", "Conectando...")
          : t("Wallet.connect", "Connect Wallet")}
      </button>
    );
  }, [account, connect, disconnect, isConnecting, t, ui.label]);

  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => {}, 2000);
    return () => clearTimeout(id);
  }, [error]);

  return (
    <header className="header">
      <div className="topbar">
        <div className="inner">
          {/* fila superior: logo | search (1fr) | acciones */}
          <div className="row">
            <Link href="/" className="brand" aria-label={logoAlt}>
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={40}
                height={40}
                className="brand-img"
                priority
              />
              <span className="brand-text">{brandTextOverride ?? logoAlt}</span>
            </Link>

            <form
              className="search"
              onSubmit={onSubmit}
              role="search"
              aria-label={t("Search.aria", "Búsqueda del sitio")}
            >
              <input
                type="search"
                className="search-input"
                placeholder={t("Search.placeholder", "Search")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="search-btn"
                aria-label={t("Search.submit", "Buscar")}
                title={t("Search.submit", "Buscar")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-3.5-3.5" />
                </svg>
              </button>
            </form>

            <div className="actions">
              <Language />
              {walletCta}
            </div>
          </div>

          {/* NAV: una línea con scroll; sin barra visible y sin “rabo” */}
          <nav className="nav">
            <ul className="nav-list">
              <NavItem />
            </ul>
          </nav>
        </div>
      </div>

      {!!error && <div className="wallet-error">{error}</div>}

      <style jsx>{`
        :root { --h-mobile: 56px; --h-desktop: 64px; }

        .topbar {
          position: fixed; top: 0; left: 0; right: 0;
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          z-index: 1040;
        }
        .inner {
          width: 100%;
          max-width: none;
          padding: 8px 16px 10px;
          display: grid;
          gap: 8px;
        }
        @media (min-width: 768px) { .inner { padding: 10px 24px 12px; gap: 10px; } }

        .row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          column-gap: 12px;
          min-height: var(--h-mobile);
          position: relative;
          z-index: 1; /* la nav irá por encima (z=2) */
        }
        @media (min-width: 768px) {
          .row { column-gap: 16px; min-height: var(--h-desktop); }
        }

        .brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; }
        .brand-img { object-fit: contain; border-radius: 4px; }
        .brand-text {
          color: #111827; font-family: var(--body-font,"Inter",system-ui,sans-serif);
          font-weight: 600; font-size: 15px; white-space: nowrap;
        }
        @media (min-width: 768px){ .brand-text { font-size: 16px; } }

        .search { position: relative; display: flex; align-items: center; min-width: 0; overflow: visible; }
        .search-input {
          width: 100%; height: 34px; border: 1px solid #e5e7eb; border-radius: 6px;
          background: #fff; color: #111827; font-size: 14px; padding: 6px 36px 6px 10px; outline: none;
        }
        .search-input::placeholder { color: #9ca3af; }
        .search-input:focus { border-color: #94a3b8; }
        .search-btn {
          position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
          width: 28px; height: 28px; background: transparent; color: #374151; border: 0; padding: 0;
          display: grid; place-items: center; cursor: pointer;
        }

        .actions { display: inline-flex; align-items: center; gap: 12px; }
        .wallet-chip { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #111827; }
        .chip { border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 8px; background: #f9fafb; }
        .btn-outline {
          background: #fff; border: 1px solid #1f2937; color: #1f2937;
          font-size: 13px; line-height: 1; padding: 7px 10px; border-radius: 6px; cursor: pointer;
        }
        .btn-outline:hover { background: #f3f4f6; }
        .btn-solid {
          background: #1f2937; color: #fff; border: 0; font-size: 13px; line-height: 1;
          padding: 8px 12px; border-radius: 6px; cursor: pointer; min-width: 110px; text-align: center;
        }
        .btn-solid[disabled] { opacity: .6; cursor: default; }

        /* === NAV arriba del row para evitar solapes/huecos visuales === */
        .nav { 
          width: 100%;
          border-top: 1px solid #e5e7eb;
          padding-top: 6px;
          position: relative;
          z-index: 2;
        }

        /* === LISTA: 1 fila, scroll suave, sin barra visible ni “rabo” === */
        .nav-list {
          display: flex; align-items: center; gap: 18px;
          margin: 0; padding: 8px 0;
          list-style: none;

          flex-wrap: nowrap;
          overflow-x: auto;
          overscroll-behavior-x: contain;
          -webkit-overflow-scrolling: touch;

          scrollbar-width: none;           /* Firefox: oculta barra */
        }
        .nav-list::-webkit-scrollbar { display: none; } /* WebKit: oculta barra */
        .nav-list::after { content: ""; flex: 0 0 8px; } /* pequeño colchón final */

        .nav-list > li { flex: 0 0 auto; }
        .nav-list a {
          display: block; font-size: 14px; font-weight: 600; color: #0f172a; text-decoration: none;
          line-height: 1.2; padding: 6px 0; white-space: nowrap; word-break: keep-all;
        }
        .nav-list a:hover { color: #1e3a8a; }

        /* móvil: buscador baja a segunda línea */
        @media (max-width: 640px){
          .row { grid-template-columns: 1fr auto; row-gap: 8px; }
          .actions { justify-self: end; }
          .search { grid-column: 1 / -1; }
        }

        .wallet-error {
          position: fixed; top: 8px; right: 8px; background: #ef4444; color: #fff;
          font-size: 13px; padding: 6px 10px; border-radius: 6px; z-index: 2000;
        }

        /* offset del contenido para no quedar bajo el header fijo */
        :global(main), :global(#__next > main){
          margin-top: calc(var(--h-desktop) + 56px);
        }
        @media (max-width: 767px){
          :global(main), :global(#__next > main){
            margin-top: calc(var(--h-mobile) + 72px);
          }
        }
      `}</style>
    </header>
  );
}
