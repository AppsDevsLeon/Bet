// components/betting/PropsGrid.tsx
"use client";

import React from "react";
import type { PropCard } from "./types";

export default function PropsGrid({ cards }: { cards: PropCard[] }) {
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <>
      <section className="props-wrap">
        {cards.map((card) => (
          <article key={card.id} className="prop-card">
            <header className="prop-head">
              <div className="icon-box">{card.icon ?? "🏈"}</div>
              <div className="prop-title">{card.title}</div>
            </header>

            <div className="rows">
              {card.rows.map((row, idx) => (
                <div key={idx} className="rowline">
                  <div className="leftcol">
                    <div className="name">{row.teamOrName}</div>
                    <div className="pct">{row.pct}</div>
                  </div>

                  <div className="voteBtns">
                    <button className="yesBtn">{row.yesPrice}</button>
                    <button className="noBtn">{row.noPrice}</button>
                  </div>
                </div>
              ))}
            </div>

            <footer className="foot">
              <div className="vol">{card.volume}</div>
              <div className="icons">🔖</div>
            </footer>
          </article>
        ))}
      </section>

      <style jsx>{`
        .props-wrap {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr));
          gap:16px;
        }

        .prop-card {
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:12px;
          box-shadow:0 16px 32px rgba(0,0,0,.04);
          padding:16px;
          color:#111827;
          display:grid;
          row-gap:12px;
        }

        .prop-head {
          display:flex;
          align-items:flex-start;
          gap:8px;
          font-weight:600;
          font-size:.95rem;
          line-height:1.3;
          color:#111827;
        }
        .icon-box{
          min-width:32px;
          min-height:32px;
          border-radius:6px;
          background:#f3f4f6;
          border:1px solid #d1d5db;
          box-shadow:0 2px 0 #cfcfcf;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:.9rem;
        }

        .rows{
          display:grid;
          row-gap:12px;
        }
        .rowline{
          display:flex;
          flex-wrap:wrap;
          justify-content:space-between;
          row-gap:8px;
        }
        .leftcol{
          display:flex;
          flex-direction:column;
        }
        .name{
          font-size:.9rem;
          font-weight:500;
          color:#111827;
        }
        .pct{
          font-size:1rem;
          font-weight:600;
          color:#111827;
        }

        .voteBtns{
          display:flex;
          flex-wrap:wrap;
          gap:4px;
          min-width:90px;
          justify-content:flex-end;
        }
        .yesBtn,
        .noBtn{
          border-radius:4px;
          font-size:.8rem;
          line-height:1.2;
          font-weight:500;
          border:1px solid #d1d5db;
          background:#f9fafb;
          padding:4px 6px;
          box-shadow:0 2px 0 #cfcfcf;
        }
        .yesBtn{
          background:#ecfdf5;
          border-color:#bbf7d0;
          box-shadow:0 2px 0 #9ee6b9;
        }
        .noBtn{
          background:#fef2f2;
          border-color:#fecaca;
          box-shadow:0 2px 0 #fda4a4;
        }

        .foot{
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          font-size:.8rem;
          color:#6b7280;
        }
        .icons{
          color:#6b7280;
        }
      `}</style>
    </>
  );
}
