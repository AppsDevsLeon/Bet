// components/betting/BetTicket.tsx
"use client";

import React, { useState } from "react";
import type { Seleccion } from "./types";

export default function BetTicket({
  currentSel,
  mode = "buy", // "buy" | "sell"
}: {
  currentSel: Seleccion | null;
  mode?: "buy" | "sell";
}) {
  const [amount, setAmount] = useState<number>(0);

  // Helpers display
  const leftLabel = currentSel
    ? currentSel.etiqueta
    : "NYJ 28¢";

  const rightLabel = "CIN 73¢"; // demo fija

  return (
    <>
      <aside className="ticket-card">
        {/* Header juego mock */}
        <div className="ticket-head">
          <div className="left-meta">
            <div className="mini-badge">NYJ</div>
            <div className="meta-lines">
              <div className="title">Jets vs Bengals</div>
              <div className="tag-pill">Jets</div>
            </div>
          </div>

          <div className="right-icons">⋮</div>
        </div>

        {/* Tabs Buy / Sell / Market */}
        <div className="ticket-tabs">
          <button className={`tab ${mode === "buy" ? "active" : ""}`}>
            Buy
          </button>
          <button className={`tab ${mode === "sell" ? "active" : ""}`}>
            Sell
          </button>
          <button className="tab">Market</button>
        </div>

        {/* Selection pills */}
        <div className="ticket-select-row">
          <button className="side-btn active">
            {leftLabel}
          </button>
          <button className="side-btn alt">{rightLabel}</button>
        </div>

        {/* Amount */}
        <div className="section-block">
          <div className="row-top">
            <div className="label">Amount</div>
            <div className="val">${amount.toFixed(0)}</div>
          </div>

          <div className="quick-row">
            {["+1", "+20", "+100", "Max"].map((txt) => (
              <button
                key={txt}
                className="quick-btn"
                onClick={() => {
                  if (txt === "Max") return; // demo
                  const n = parseInt(txt.replace("+",""),10);
                  if (!isNaN(n)) setAmount((a) => a + n);
                }}
              >
                {txt}
              </button>
            ))}
          </div>
        </div>

        {/* Limit / Shares simplified */}
        <div className="section-block">
          <div className="row-top">
            <div className="label">Limit Price</div>
            <div className="inline-price">
              <button className="stepper">-</button>
              <div className="price-box">28¢</div>
              <button className="stepper">+</button>
            </div>
          </div>

          <div className="row-top shares-row">
            <div className="label">Shares</div>
            <div className="shares-val">0</div>
          </div>
        </div>

        {/* Footer summary */}
        <div className="summary-block">
          <div className="line">
            <span className="l">Total</span>
            <span className="r blue">$0</span>
          </div>
          <div className="line">
            <span className="l">To Win 💵</span>
            <span className="r green">$0</span>
          </div>
        </div>

        {/* CTA */}
        <button className="trade-btn">Trade</button>

        <style jsx>{`
          .ticket-card {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            box-shadow: 0 16px 32px rgba(0, 0, 0, 0.06);
            padding: 16px;
            display: grid;
            row-gap: 16px;
            color: #111827;
            max-width: 360px;
          }

          .ticket-head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
          }
          .left-meta {
            display: flex;
            align-items: flex-start;
            gap: 10px;
          }
          .mini-badge {
            background: #0a4c2a;
            color: #fff;
            min-width: 44px;
            min-height: 36px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 700;
            line-height: 36px;
            text-align: center;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
          }
          .meta-lines {
            display: grid;
            row-gap: 4px;
          }
          .title {
            font-size: 1rem;
            font-weight: 600;
            color: #111827;
          }
          .tag-pill {
            display: inline-block;
            font-size: 0.75rem;
            font-weight: 500;
            line-height: 1.2;
            color: #0a4c2a;
            background: #ebf8ef;
            border: 1px solid #cde9d7;
            border-radius: 6px;
            padding: 2px 6px;
            box-shadow: 0 2px 0 #c1d9c9;
            width: fit-content;
          }
          .right-icons {
            color: #9ca3af;
            font-size: 1rem;
          }

          .ticket-tabs {
            display: flex;
            gap: 24px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
          }
          .tab {
            background: transparent;
            border: 0;
            padding: 0;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            color: #9ca3af;
            position: relative;
          }
          .tab.active {
            color: #111827;
          }
          .tab.active::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: -9px;
            height: 2px;
            background: #111827;
            border-radius: 2px;
          }

          .ticket-select-row {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }
          .side-btn {
            flex: 1;
            min-width: 140px;
            background: #f5f5f5;
            border: 1px solid #dcdcdc;
            box-shadow: 0 3px 0 #cfcfcf;
            border-radius: 10px;
            padding: 12px;
            font-size: 0.95rem;
            font-weight: 600;
            line-height: 1.2;
            color: #4b5563;
            text-align: center;
          }
          .side-btn.active {
            background: #0d6b3a;
            color: #fff;
            border-color: #0a4c2a;
            box-shadow: 0 3px 0 #07361e;
          }
          .side-btn.alt {
            background: #ececec;
            color: #4b5563;
          }

          .section-block {
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
            display: grid;
            row-gap: 12px;
          }

          .row-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 0.95rem;
          }

          .label {
            color: #111827;
            font-weight: 500;
          }
          .val {
            color: #9ca3af;
            font-size: 2rem;
            font-weight: 600;
            line-height: 1;
          }

          .quick-row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .quick-btn {
            background: #fff;
            border: 1px solid #dcdcdc;
            box-shadow: 0 2px 0 #cfcfcf;
            border-radius: 8px;
            font-size: 0.9rem;
            line-height: 1.2;
            padding: 8px 10px;
            min-width: 56px;
            color: #111827;
            font-weight: 500;
            cursor: pointer;
          }

          .inline-price {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .stepper {
            border: 1px solid #dcdcdc;
            background: #f9fafb;
            border-radius: 8px;
            min-width: 32px;
            min-height: 32px;
            font-size: 1rem;
            font-weight: 500;
            color: #111827;
            line-height: 1;
            box-shadow: 0 2px 0 #cfcfcf;
          }
          .price-box {
            border: 1px solid #dcdcdc;
            background: #fff;
            border-radius: 8px;
            padding: 6px 10px;
            min-width: 56px;
            text-align: center;
            font-size: 1rem;
            font-weight: 600;
            box-shadow: 0 2px 0 #cfcfcf;
            color: #111827;
          }

          .shares-row .shares-val {
            font-size: 2rem;
            font-weight: 600;
            line-height: 1;
            color: #d1d5db;
          }

          .summary-block {
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
            display: grid;
            row-gap: 8px;
            font-size: 1rem;
            line-height: 1.3;
            font-weight: 500;
          }
          .line {
            display: flex;
            justify-content: space-between;
            color: #111827;
          }
          .blue {
            color: #1a4fff;
          }
          .green {
            color: #008a2d;
          }

          .trade-btn {
            background: #1248ff;
            background-image: linear-gradient(#1248ff, #0034c7);
            color: #fff;
            border-radius: 10px;
            border: 0;
            box-shadow: 0 4px 0 #001f7a;
            font-size: 1rem;
            font-weight: 600;
            line-height: 1.2;
            padding: 14px 16px;
            cursor: pointer;
            text-align: center;
          }
          .trade-btn:active {
            transform: translateY(1px);
            box-shadow: 0 2px 0 #001f7a;
          }
        `}</style>
      </aside>
    </>
  );
}
