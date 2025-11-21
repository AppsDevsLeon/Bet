"use client";

import React from "react";
import Pill from "@/components/betting/Pill";
import type { GameCardData, Seleccion } from "@/components/betting/types";

export default function GameDetailView({
  game,
  onBack,
  onPick,
}: {
  game: GameCardData;
  onBack: () => void;
  onPick: (sel: Seleccion) => void;
}) {
  // paleta (respeta tu azul)
  const BRAND_BLUE = "#1e3a8a";
  const homeColor = game.home.color || BRAND_BLUE;
  const awayColor = game.away.color || BRAND_BLUE;

  return (
    <>
      <section className="detail-wrap">
        {/* top nav back */}
        <button className="back-btn" onClick={onBack} type="button">
          <span className="arr">←</span>
          <span className="txt">Back to NFL</span>
        </button>

        {/* Match header */}
        <header className="match-head">
          <div className="teams-side">
            <div className="team-row">
              <div className="emblem" style={{ background: awayColor }}>
                {game.away.abbr}
              </div>
              <div className="meta">
                <div className="name">
                  {game.away.abbr} {game.away.name}
                </div>
                {game.away.record && (
                  <div className="rec">{game.away.record}</div>
                )}
              </div>
            </div>

            <div className="team-row">
              <div className="emblem" style={{ background: homeColor }}>
                {game.home.abbr}
              </div>
              <div className="meta">
                <div className="name">
                  {game.home.abbr} {game.home.name}
                </div>
                {game.home.record && (
                  <div className="rec">{game.home.record}</div>
                )}
              </div>
            </div>
          </div>

          <div className="status-side">
            {game.isLive ? (
              <>
                <div className="live-line">
                  <span className="live-flag">LIVE •</span>{" "}
                  <span className="clock">{game.liveClock}</span>
                </div>
                <div className="vol">{game.vol}</div>
              </>
            ) : (
              <>
                <div className="kick">
                  {game.kickoff ? `Kickoff ${game.kickoff}` : "Scheduled"}
                </div>
                <div className="vol">{game.vol}</div>
              </>
            )}
          </div>
        </header>

        {/* markets 3-cols igual que en la card */}
        <div className="markets-grid">
          {/* MONEYLINE */}
          <div className="market-block">
            <div className="market-label">Moneyline</div>
            <div className="market-pills">
              {game.moneyline.slice(0, 3).map((opt, i) => (
                <Pill
                  key={`ml-${i}`}
                  option={opt}
                  mercado="Moneyline"
                  partidoId={game.id}
                  onPick={onPick}
                />
              ))}
            </div>
          </div>

          {/* SPREAD */}
          <div className="market-block">
            <div className="market-label">Spread</div>
            <div className="market-pills">
              {game.spread.slice(0, 2).map((opt, i) => (
                <Pill
                  key={`sp-${i}`}
                  option={opt}
                  mercado="Spread"
                  partidoId={game.id}
                  onPick={onPick}
                />
              ))}
            </div>
          </div>

          {/* TOTAL */}
          <div className="market-block">
            <div className="market-label">Total</div>
            <div className="market-pills">
              {game.total.slice(0, 2).map((opt, i) => (
                <Pill
                  key={`tot-${i}`}
                  option={opt}
                  mercado="Total"
                  partidoId={game.id}
                  onPick={onPick}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .detail-wrap {
          border: none;
          border-radius: 0; /* sin esquinas marcadas para look flat */
          background: #fff; /* fondo limpio */
          padding: 16px;
          display: grid;
          row-gap: 20px;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 0;
          color: ${BRAND_BLUE};
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          width: fit-content;
          padding: 4px 0;
        }
        .back-btn:hover .txt {
          text-decoration: underline;
        }
        .arr {
          font-size: 1rem;
          line-height: 1;
        }

        .match-head {
          display: grid;
          grid-template-columns: 1fr auto;
          column-gap: 16px;
          row-gap: 16px;
        }

        .teams-side {
          display: grid;
          row-gap: 16px;
        }
        .team-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .emblem {
          min-width: 44px;
          min-height: 36px;
          border-radius: 6px;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 700;
          line-height: 36px;
          text-align: center;
        }
        .meta {
          display: grid;
          row-gap: 2px;
        }
        .name {
          font-weight: 700;
          color: #0f172a;
        }
        .rec {
          font-size: 0.8rem;
          color: #6b7280;
          line-height: 1.2;
        }

        .status-side {
          display: grid;
          align-content: start;
          row-gap: 4px;
          font-size: 0.85rem;
          line-height: 1.3;
          text-align: right;
          min-width: 140px;
        }

        .live-line {
          font-weight: 700;
          color: #b91c1c; /* rojo sobrio para LIVE */
        }
        .live-flag {
          font-weight: 800;
        }
        .clock {
          color: #0f172a;
        }
        .kick {
          font-weight: 700;
          color: #0f172a;
        }
        .vol {
          color: #6b7280;
          font-weight: 400;
        }

        .markets-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(min(220px, 100%), 1fr)
          );
          gap: 16px;
        }

        .market-block {
          border: none;       /* sin bordes */
          border-radius: 0;   /* plano */
          background: #fff;   /* simple */
          padding: 8px 0;     /* respiración ligera */
          display: grid;
          row-gap: 8px;
        }

        .market-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: ${BRAND_BLUE};
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .market-pills {
          display: grid;
          row-gap: 8px;
        }

        @media (max-width: 600px) {
          .status-side {
            text-align: left;
            min-width: 0;
          }
          .match-head {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
