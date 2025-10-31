"use client";

import React, { useState, useMemo } from "react";

import GenericSidebar from "@/components/Shared/GenericSidebar";
import MarketCard from "@/components/markets/MarketCard";

import { MARKETS } from "@/public/data/marketsData";
import { getFilterForNavId } from "@/lib/cryptoCategoryMap";
import { buildCryptoSections } from "@/lib/sidebarAdapters";

export default function MarketsCryptoPage() {
  // ID activo en la sidebar (All, BTC, ETH, etc.)
  const [activeNavId, setActiveNavId] = useState<number>(1); // 1 = "All"

  // i18n dummy
  const t = (key: string, fallback?: string) => fallback ?? key;

  // construye las secciones (Timeframes / Assets)
  const cryptoSections = buildCryptoSections(t);

  // filtra las cards en la derecha en base al item activo
  const filteredMarkets = useMemo(() => {
    const rule = getFilterForNavId(activeNavId);

    if (rule.type === "all") return MARKETS;
    if (rule.type === "asset") {
      return MARKETS.filter((m) => m.assetTag === rule.value);
    }
    if (rule.type === "range") {
      return MARKETS.filter((m) => m.rangeTag === rule.value);
    }
    return MARKETS;
  }, [activeNavId]);

  return (
    <main className="flex min-h-screen bg-slate-50 text-slate-900 mt-[72px]">
      {/* ============ SIDEBAR IZQUIERDA ============ */}
      <aside
        className="w-[250px] flex-shrink-0 border-end border-slate-200 bg-white"
        style={{ minWidth: "250px" }}
      >
        <GenericSidebar
          // pasamos las secciones de crypto SIN navegar realmente
          sections={cryptoSections.map((section) => ({
            ...section,
            items: section.items.map((it) => ({
              ...it,
              href: "#", // bloquea navegación real
            })),
          }))}

          // resaltar el item que está activo
          activeId={activeNavId}

          // cuando haces click en un item, cambiamos el filtro
          onSelectItem={(id) => {
            // aseguramos number porque nuestros ids son number en cryptoNavData
            setActiveNavId(Number(id));
          }}

          // quitamos el bloque "Home / Marketplace / In-Play"
          showMainBlock={false}
        />
      </aside>

      {/* ============ CONTENIDO DERECHA ============ */}
      <section className="flex-1 flex flex-col">
        {/* HEADER AZUL SUPERIOR DENTRO DEL ÁREA DE CONTENIDO */}
        <header className="bg-gradient-to-r from-[#0a1f6b] to-[#002d8a] text-white border-b border-slate-300/20 px-4 py-3 flex flex-wrap items-center gap-3">
          {/* brand lado izq */}
          <div className="flex items-center gap-2 text-[13px] font-semibold">
            <img
              src="/brand/polymarket-like.svg"
              className="w-5 h-5 rounded border border-white/40 bg-white/10 p-[2px]"
              alt="Olympiabet"
            />
            <span>Olympiabet</span>
          </div>

          {/* search bar centro */}
          <div className="flex-1 min-w-[200px] max-w-lg">
            <div className="relative">
              <input
                className="w-full rounded-full bg-white/10 border border-white/30 text-[12px] placeholder-white/60 text-white py-1.5 pl-8 pr-3 outline-none"
                placeholder="Make your search"
              />
              <span className="absolute left-2 top-1.5 text-white/60 text-xs">
                🔍
              </span>
            </div>
          </div>

          {/* idioma + wallet lado derecho */}
          <div className="flex items-center gap-2 text-[12px] ms-auto">
            <img
              src="/flags/es.png"
              className="w-4 h-4 rounded-sm border border-white/40"
              alt="ES"
            />
            <button className="text-[11px] font-medium bg-white text-[#0a1f6b] rounded-md px-2 py-1">
              Connect Wallet
            </button>
          </div>

          {/* tabs horizontales */}
          <nav className="w-full flex flex-wrap gap-3 text-[11px] font-medium text-white/90 pt-2">
            {[
              "Inicio",
              "World Cup",
              "Deportes",
              "Politics",
              "Finance",
              "Crypto",
              "Geopolitics",
              "Culture",
              "Economy",
              "Elections",
              "Promociones",
            ].map((tab) => (
              <button
                key={tab}
                className={
                  tab === "Crypto"
                    ? "bg-white text-[#0a1f6b] rounded-full px-3 py-1 shadow"
                    : "hover:text-white text-white/80"
                }
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        {/* GRID DE MERCADOS FILTRADOS */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredMarkets.map((mkt) => (
              <MarketCard key={mkt.id} market={mkt} />
            ))}
          </div>
        </div>

        {/* footer / ticker etc si quieres */}
      </section>
    </main>
  );
}
