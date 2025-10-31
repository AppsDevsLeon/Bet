"use client";

import React from "react";
import type { MarketCard as MarketCardType } from "@/public/data/marketsData";

export default function MarketCard({ market }: { market: MarketCardType }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col gap-3">
      {/* TITLE + ICON + chance gauge placeholder */}
      <div className="flex items-start gap-3">
        {/* icono */}
        <div className="flex-shrink-0">
          <img
            src={market.icon}
            alt={market.title}
            className="w-8 h-8 rounded-md object-contain border border-slate-200 bg-white"
          />
        </div>

        {/* texto */}
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-slate-900 leading-snug line-clamp-2">
            {market.title}
          </div>

          {market.subtitle && (
            <div className="text-[12px] text-slate-500 leading-tight">
              {market.subtitle}
            </div>
          )}
        </div>

        {/* probabilidad tipo "<1% chance" */}
        {market.probabilityLabel && (
          <div className="flex flex-col items-end text-[11px] leading-tight">
            <div className="text-slate-900 text-xs font-semibold">
              {market.probabilityLabel.split(" ")[0]}
            </div>
            <div className="text-slate-500">
              {market.probabilityLabel.replace(/^\S+\s*/, "")}
            </div>
          </div>
        )}
      </div>

      {/* OUTCOMES */}
      <div className="flex flex-col gap-2">
        {market.outcomes.map((opt, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
          >
            <span className="text-[13px] text-slate-700 font-medium">
              {opt.label}
            </span>

            <span
              className={[
                "text-[12px] font-semibold",
                opt.tone === "green"
                  ? "text-emerald-600"
                  : opt.tone === "red"
                  ? "text-rose-600"
                  : "text-slate-600",
              ].join(" ")}
            >
              {opt.price}
            </span>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <div className="flex items-center gap-2">
          {market.isLive && (
            <span className="flex items-center gap-1 font-medium text-rose-600">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              LIVE
            </span>
          )}

          {market.volume && (
            <span className="text-slate-500">{market.volume}</span>
          )}
        </div>

        <button
          className="text-slate-400 hover:text-slate-600"
          title="Bookmark"
        >
          <span className="text-lg leading-none">🔖</span>
        </button>
      </div>
    </div>
  );
}
