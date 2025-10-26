"use client";

import React from "react";
import Pill from "./Pill";
import type { GameCardData, Seleccion } from "./types";

export default function GameCardScheduled({
  game,
  onPick,
  onOpenGame,
}: {
  game: GameCardData;
  onPick: (sel: Seleccion) => void;
  onOpenGame: (id: string) => void;
}) {
  return (
    <>
      <article className="card-wrap">
        {/* TOP ROW SCHEDULED */}
        <div className="top-row">
          <div className="left-top">
            <span className="kickoff-chip">
              {game.kickoff ? game.kickoff : "Scheduled"}
            </span>
            <span className="vol">{game.vol}</span>
          </div>

          <button
            className="gameview-btn"
            onClick={() => onOpenGame(game.id)}
            type="button"
          >
            <span className="bubble">{game.marketsCount}</span>
            <span className="txt">Game View</span>
            <span className="arrow">›</span>
          </button>
        </div>

        {/* GRID */}
        <div className="teams-markets">
          <div className="teams-col">
            <TeamLine side={game.away} hideRank />
            <TeamLine side={game.home} hideRank />
          </div>

          <MarketColumn
            title="Moneyline"
            opts={game.moneyline.slice(0, 3)}
            mercado="Moneyline"
            partidoId={game.id}
            onPick={onPick}
          />

          <MarketColumn
            title="Spread"
            opts={game.spread.slice(0, 2)}
            mercado="Spread"
            partidoId={game.id}
            onPick={onPick}
          />

          <MarketColumn
            title="Total"
            opts={game.total.slice(0, 2)}
            mercado="Total"
            partidoId={game.id}
            onPick={onPick}
          />
        </div>
      </article>

      <style jsx>{`
        .card-wrap {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.04);
          padding: 16px;
          display: grid;
          row-gap: 16px;
        }

        .top-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          font-size: 0.8rem;
          line-height: 1.2;
        }

        .left-top {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .kickoff-chip {
          border-radius: 6px;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          padding: 4px 8px;
          font-size: 0.8rem;
          font-weight: 500;
          line-height: 1.1;
          color: #111827;
          box-shadow: 0 2px 0 #cfcfcf;
        }

        .vol {
          color: #6b7280;
          font-weight: 400;
        }

        .gameview-btn {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f9fafb;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.75rem;
          line-height: 1rem;
          padding: 6px 10px;
          color: #111827;
          box-shadow: 0 2px 0 #cfcfcf;
          cursor: pointer;
          white-space: nowrap;
        }
        .bubble {
          background: #e5e7eb;
          border-radius: 6px;
          padding: 0 6px;
          font-weight: 600;
          font-size: 0.7rem;
          line-height: 1.2;
          color: #111827;
        }
        .arrow {
          font-weight: 600;
          color: #6b7280;
        }

        .teams-markets {
          display: grid;
          grid-template-columns: minmax(180px, 1fr) repeat(3, minmax(160px, 1fr));
          column-gap: 16px;
          row-gap: 16px;
        }

        .teams-col {
          display: grid;
          row-gap: 16px;
          min-width: 0;
        }

        @media (max-width: 700px) {
          .teams-markets {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

function TeamLine({
  side,
  hideRank = false,
}: {
  side: {
    abbr: string;
    name: string;
    record?: string;
    rankOrSeed?: string;
    color?: string;
  };
  hideRank?: boolean;
}) {
  const badgeColor = side.color || "#1e3a8a";

  return (
    <>
      <div className="teamline">
        {!hideRank && (
          <div className="rankbox">{side.rankOrSeed ?? ""}</div>
        )}
        <div className="emblem" style={{ background: badgeColor }}>
          {side.abbr}
        </div>

        <div className="meta">
          <div className="name">
            {side.abbr} {side.name}
          </div>
          {side.record && <div className="rec">{side.record}</div>}
        </div>
      </div>

      <style jsx>{`
        .teamline {
          display: grid;
          grid-template-columns: auto auto 1fr;
          align-items: center;
          column-gap: 12px;
          font-size: 0.9rem;
          line-height: 1.2;
        }

        .rankbox {
          min-width: 32px;
          min-height: 32px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: #f9fafb;
          box-shadow: 0 2px 0 #cfcfcf;
          font-size: 0.8rem;
          font-weight: 600;
          color: #111827;
          display: flex;
          align-items: center;
          justify-content: center;
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
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        }

        .meta {
          display: grid;
          row-gap: 2px;
        }
        .name {
          font-weight: 600;
          color: #111827;
        }
        .rec {
          font-size: 0.8rem;
          color: #6b7280;
          line-height: 1.2;
        }
      `}</style>
    </>
  );
}

function MarketColumn({
  title,
  opts,
  mercado,
  partidoId,
  onPick,
}: {
  title: string;
  opts: { label: string; price: string; tone?: string }[];
  mercado: string;
  partidoId: string;
  onPick: (sel: Seleccion) => void;
}) {
  return (
    <>
      <div className="market-col">
        <div className="mkt-title">{title}</div>
        <div className="pill-col">
          {opts.map((opt, idx) => (
            <Pill
              key={idx}
              option={opt}
              mercado={mercado}
              partidoId={partidoId}
              onPick={onPick}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .market-col {
          display: grid;
          row-gap: 8px;
          min-width: 0;
        }

        .mkt-title {
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .pill-col {
          display: grid;
          row-gap: 8px;
        }

        @media (max-width: 700px) {
          .market-col {
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
          }
        }
      `}</style>
    </>
  );
}
