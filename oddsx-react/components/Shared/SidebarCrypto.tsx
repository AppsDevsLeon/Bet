"use client";

import React, { useState, useMemo } from "react";
import {
  cryptoTimeframesCategories,
  cryptoAssetsCategories,
  type CryptoNavItem,
  type TFunc,
} from "@/public/data/cryptoNavData";

export type SidebarCryptoProps = {
  t: TFunc;
  activeId: number;
  onSelect: (id: number) => void;
};

export default function SidebarCrypto({
  t,
  activeId,
  onSelect,
}: SidebarCryptoProps) {
  // 🔍 estado del campo de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // listados originales
  const allTimeframes = cryptoTimeframesCategories(t);
  const allAssets = cryptoAssetsCategories(t);

  // Filtramos por texto. Coincide contra el label.
  const filteredTimeframes = useMemo(() => {
    if (!searchTerm.trim()) return allTimeframes;
    return allTimeframes.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allTimeframes, searchTerm]);

  const filteredAssets = useMemo(() => {
    if (!searchTerm.trim()) return allAssets;
    return allAssets.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allAssets, searchTerm]);

  const renderGroup = (
    groupTitle: string | null,
    items: CryptoNavItem[]
  ) => (
    <div className="mb-6">
      {groupTitle && (
        <div className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {groupTitle}
        </div>
      )}

      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li
            key={item.id}
            className={[
              "flex items-center justify-between gap-2 rounded-xl px-4 py-2 cursor-pointer border border-transparent",
              activeId === item.id
                ? "bg-slate-100 text-slate-900 border-slate-300"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            ].join(" ")}
            onClick={() => onSelect(item.id)}
          >
            <div className="flex items-center gap-2 min-w-0">
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-5 h-5 rounded-sm object-contain flex-shrink-0"
                />
              )}

              <span className="text-[13px] font-medium leading-none truncate">
                {item.label}
              </span>
            </div>

            {item.count !== undefined && (
              <span className="text-[11px] text-slate-500 font-medium tabular-nums">
                {item.count}
              </span>
            )}
          </li>
        ))}

        {/* si no hay elementos después del filtro */}
        {items.length === 0 && (
          <li className="px-4 py-6 text-[12px] text-slate-400 text-center border border-dashed border-slate-200 rounded-xl">
            No matches
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <aside className="w-64 max-w-[16rem] flex flex-col bg-white border-r border-slate-200">
      {/* BRAND HEADER */}
      <div className="flex items-start gap-2 px-4 py-4 border-b border-slate-200 bg-gradient-to-r from-[#0a1f6b] to-[#002d8a] text-white">
        <img
          src="/brand/polymarket-like.svg"
          alt="OddsX"
          className="w-7 h-7 rounded-md bg-white/10 p-[2px] border border-white/30"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold">OddsX Crypto</span>

          <span className="text-[11px] text-white/80 flex items-center gap-1">
            <img
              src="/flags/us.png"
              className="w-4 h-4 rounded-sm border border-white/40"
              alt="US"
            />
            <span>USD</span>
          </span>
        </div>
      </div>

      {/* TABS TIPO Trending / New */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 text-[12px] border-b border-slate-200 bg-white">
        <button className="flex items-center gap-1 font-semibold text-slate-900">
          <span className="inline-block w-4 h-4">📈</span>
          <span>Trending</span>
        </button>
        <button className="text-slate-500 hover:text-slate-900">Breaking</button>
        <button className="text-slate-500 hover:text-slate-900">New</button>
        <button className="text-slate-500 hover:text-slate-900">
          Upcoming
        </button>
      </div>

      {/* PANEL SCROLLEABLE con buscador + listas */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {/* 🔍 buscador */}
        <div className="px-2">
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              {/* icono lupa */}
              <span role="img" aria-label="search">
                🔍
              </span>
            </div>
            <input
              className="w-full bg-slate-100 text-[13px] text-slate-700 placeholder-slate-400 rounded-xl border border-slate-300 pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* LISTA TIMEFRAMES */}
        {renderGroup("Timeframes", filteredTimeframes)}

        <div className="h-px w-full bg-slate-200" />

        {/* LISTA MARKETS */}
        {renderGroup("Markets", filteredAssets)}
      </div>
    </aside>
  );
}
