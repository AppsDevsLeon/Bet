// components/betting/PropsGrid.tsx
"use client";

import React, { useState } from "react";
import type { PropCard } from "./types";
import BetSlipOverlay from "@/components/betting/BetSlipOverlay";

/* Helpers */
function priceToPercentLabel(value?: string | number | null): string {
  if (value == null) return "--%";
  const s = String(value).trim();
  const mPct = s.match(/([\d.]+)\s*%/);
  if (mPct) return `${Math.round(Math.max(0, Math.min(100, parseFloat(mPct[1]))))}%`;
  const mNum = s.match(/[\d.]+/);
  if (!mNum) return "--%";
  let n = parseFloat(mNum[0]);
  if (!Number.isFinite(n)) return "--%";
  if (n <= 1) n *= 100;
  return `${Math.round(Math.max(0, Math.min(100, n)))}%`;
}

type LocalMarket = { id: string; title: string };
type LocalOutcome = { label: string; price?: string; __idx: number; __yn: "yes" | "no" };

export default function PropsGrid({ cards }: { cards: PropCard[] }) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [stake, setStake] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<LocalMarket | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<LocalOutcome | null>(null);

  if (!cards || cards.length === 0) return null;

  const handlePick = (card: PropCard, idx: number, yn: "yes" | "no") => {
    const row = card.rows[idx];
    setSelectedMarket({ id: String(card.id), title: card.title || "Props Market" });
    setSelectedOutcome({ label: row.teamOrName, price: yn === "yes" ? row.yesPrice : row.noPrice, __idx: idx, __yn: yn });
    setOverlayOpen(true);
  };

  return (
    <>
      <section className="props-wrap">
        {cards.map((card) => (
          <article key={card.id} className="prop-card">
            {/* Header azul, compacto */}
            <header className="prop-head blue">
              <div className="icon-box">{card.icon ?? "🏈"}</div>
              <div className="prop-title" title={card.title}>{card.title}</div>
            </header>

            {/* Filas compactas */}
            <div className="rows">
              {card.rows.map((row, idx) => (
                <div key={idx} className="rowline">
                  <div className="leftcol">
                    <div className="name" title={row.teamOrName}>{row.teamOrName}</div>
                    {row.pct && <div className="pct">{row.pct}</div>}
                  </div>

                  <div className="voteBtns">
                    <button
                      className="yesBtn"
                      aria-label={`Comprar Sí: ${priceToPercentLabel(row.yesPrice)}`}
                      onClick={() => handlePick(card, idx, "yes")}
                    >
                      Yes {priceToPercentLabel(row.yesPrice)}
                    </button>
                    <button
                      className="noBtn"
                      aria-label={`Comprar No: ${priceToPercentLabel(row.noPrice)}`}
                      onClick={() => handlePick(card, idx, "no")}
                    >
                      No {priceToPercentLabel(row.noPrice)}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pie azul, compacto */}
            <footer className="foot blue">
              <div className="vol">{card.volume ?? "$0 Vol."}</div>
              <div className="icons">🔖</div>
            </footer>
          </article>
        ))}
      </section>

      {/* Overlay integrado */}
      {overlayOpen && selectedMarket && selectedOutcome && (
        <BetSlipOverlay
          market={selectedMarket as any}
          outcome={selectedOutcome as any}
          stake={stake}
          onChangeStake={setStake}
          onClose={() => setOverlayOpen(false)}
          onConfirm={() => {
            setStake("");
            setOverlayOpen(false);
          }}
        />
      )}

      <style jsx>{`
        /* ===== Compacto + tipografía más grande ===== */
        .props-wrap{
          display:grid;
          grid-template-columns:repeat(auto-fit, minmax(min(320px,100%), 1fr));
          gap:10px;
        }

        .prop-card{
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:12px;
          overflow:hidden;
          box-shadow:0 6px 14px rgba(0,0,0,.06);
          display:grid;
          grid-template-rows:auto 1fr auto;
        }

        .prop-head{
          display:flex;
          align-items:center;
          gap:8px;
          padding:8px 10px;           /* ↓ menos alto */
        }
        .prop-head.blue{
          background:linear-gradient(90deg,#0a1f6b,#1e3a8a);
          color:#fff;
        }
        .icon-box{
          width:26px;height:26px;
          border-radius:6px;
          background:rgba(255,255,255,.14);
          border:1px solid rgba(255,255,255,.25);
          display:flex;align-items:center;justify-content:center;
          font-size:0.95rem;
        }
        .prop-title{
          font-weight:800;
          font-size:1.05rem;          /* ↑ más grande */
          line-height:1;
          overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
        }

        .rows{
          padding:8px 10px;            /* ↓ menos padding */
          display:grid;
          row-gap:6px;                 /* ↓ menos separación entre filas */
        }
        .rowline{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          min-height:38px;            /* compacto pero clickeable */
        }
        .leftcol{min-width:0;}
        .name{
          font-size:1rem;              /* ↑ más grande */
          font-weight:700;             /* ↑ más gruesa */
          color:#0f172a;
          max-width:55vw; overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
        }
        .pct{
          font-size:0.9rem;            /* ↑ un poco más grande */
          font-weight:600;
          color:#334155;
          opacity:.95;
          margin-top:2px;
        }

        .voteBtns{display:flex;gap:6px;flex-shrink:0;}
        .yesBtn,.noBtn{
          border-radius:10px;
          font-size:0.92rem;           /* ↑ texto de botón */
          font-weight:800;
          line-height:1;
          border:1px solid #d1d5db;
          padding:6px 10px;            /* ↓ altura pero cómoda */
          cursor:pointer;
          transition:transform .06s ease, background .15s ease;
        }
        .yesBtn{ background:#ecfdf5; border-color:#bbf7d0; }
        .noBtn { background:#fef2f2; border-color:#fecaca; }
        .yesBtn:active,.noBtn:active{ transform:translateY(1px); }

        .foot{
          display:flex;justify-content:space-between;align-items:center;
          padding:6px 10px;            /* ↓ menos alto */
          font-size:0.9rem;            /* ↑ un poco */
        }
        .foot.blue{
          background:linear-gradient(90deg,#1e3a8a,#0a1f6b);
          color:#eaf1ff;
        }
      `}</style>
    </>
  );
}
