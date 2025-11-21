"use client";

import React from "react";
import type { GameCardData, Seleccion } from "./types";

export default function GameCardLive({
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
      <article className="live-card-wrap">
        <ScoreHeaderLive game={game} onOpenGame={onOpenGame} />

        <div className="markets-head">
          <div className="col-team" />
          <div className="col-head">MONEYLINE</div>
          <div className="col-head">SPREAD</div>
          <div className="col-head">TOTAL</div>
        </div>

        <GameRowCompact
          abbr={game.away.abbr}
          name={game.away.name}
          record={game.away.record}
          badgeBg={game.away.color || "#8b0000"}
          divisionOrNote={game.away.divisionOrNote || game.away.rankOrSeed}
          partidoId={game.id}
          moneyline={game.moneyline?.[0]}
          spread={game.spread?.[0]}
          total={game.total?.[0]}
          onPick={onPick}
        />

        <GameRowCompact
          abbr={game.home.abbr}
          name={game.home.name}
          record={game.home.record}
          badgeBg={game.home.color || "#1e3a8a"}
          divisionOrNote={game.home.divisionOrNote || game.home.rankOrSeed}
          partidoId={game.id}
          moneyline={game.moneyline?.[1]}
          spread={game.spread?.[1]}
          total={game.total?.[1]}
          onPick={onPick}
        />
      </article>

      <style jsx>{`
        .live-card-wrap {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #fff;
      
          padding: 16px;
          display: grid;
          row-gap: 16px;
        }

        .markets-head {
          display: grid;
          grid-template-columns: minmax(220px, 1fr) repeat(3, minmax(180px, 1fr));
          column-gap: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        @media (max-width: 900px) {
          .markets-head {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

/* 🏈 HEADER: marcador redondeado con “:” */
function ScoreHeaderLive({
  game,
  onOpenGame,
}: {
  game: GameCardData;
  onOpenGame: (id: string) => void;
}) {
  const away = game.away;
  const home = game.home;

  // fallback del marcador, si no hay score todavía
  const sA = away.scoreLive && away.scoreLive !== "" ? away.scoreLive : "0";
  const sH = home.scoreLive && home.scoreLive !== "" ? home.scoreLive : "0";

  return (
    <>
      <header className="score-header">
        {/* ===== LEFT: estado / reloj / volumen ===== */}
        <div className="live-info">
          {game.isLive ? (
            <span className="live-flag">LIVE •</span>
          ) : (
            game.kickoff && <span className="kickoff">{game.kickoff}</span>
          )}

          {game.liveClock && (
            <span className="clock">{game.liveClock}</span>
          )}

          {game.vol && <span className="vol">{game.vol}</span>}
        </div>

        {/* ===== CENTER: marcador estilo círculo/logo ===== */}
        <div className="score-block">
          {/* Lado visitante */}
          <div className="team-score-side">
            <div className="team-bubble">
              {away.logo ? (
                <img
                  src={away.logo}
                  alt={away.name}
                  className="team-logo"
                />
              ) : (
                <span className="team-fallback">{away.abbr}</span>
              )}
            </div>

            {/* 👇 Abajo ponemos el nombre completo, NO el abbr otra vez */}
            <div className="team-label">{away.name}</div>
          </div>

          {/* Marcador */}
          <div className="score-numbers">
            <span className="num-left">{sA}</span>
            <span className="colon">:</span>
            <span className="num-right">{sH}</span>
          </div>

          {/* Lado local */}
          <div className="team-score-side">
            <div className="team-bubble">
              {home.logo ? (
                <img
                  src={home.logo}
                  alt={home.name}
                  className="team-logo"
                />
              ) : (
                <span className="team-fallback">{home.abbr}</span>
              )}
            </div>

            {/* 👇 Igual acá: nombre completo, no "SF" repetido */}
            <div className="team-label">{home.name}</div>
          </div>
        </div>

        {/* ===== RIGHT: botón Game View ===== */}
        <button
          className="gameview-btn"
          onClick={() => onOpenGame(game.id)}
          type="button"
        >
          <span className="bubble">{game.marketsCount}</span>
          <span className="txt">Game View</span>
          <span className="arrow">›</span>
        </button>
      </header>

      <style jsx>{`
        /* ===== CONTENEDOR HEADER GENERAL ===== */
        .score-header {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          column-gap: 12px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 12px;
        }

        /* ===== IZQUIERDA: LIVE info ===== */
        .live-info {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 6px;
          font-size: 0.85rem;
          line-height: 1.2;
        }

        .live-flag {
          color: #c6424a;
          font-weight: 700;
        }

        .kickoff {
          font-weight: 600;
          color: #111827;
        }

        .clock {
          font-weight: 600;
          color: #111827;
        }

        .vol {
          color: #6b7280;
          font-weight: 400;
        }

        /* ===== CENTRO: SCOREBLOCK ===== */
        .score-block {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        /* cada lado (logo+círculo+nombre) */
        .team-score-side {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 80px;
        }

        /* círculo con logo o siglas */
        .team-bubble {
          width: 56px;
          height: 56px;
          border-radius: 9999px;
          background: radial-gradient(
            circle at 30% 30%,
            #ffffff 0%,
            #ffffffff 70%
          );
          border: 1px solid #ffffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .team-logo {
          width: 36px;
          height: 36px;
          object-fit: contain;
        }

        .team-fallback {
          font-size: 0.8rem;
          font-weight: 600;
          color: #111827;
          text-align: center;
        }

        /* 👇 este es el texto que aparece ABAJO del círculo */
        .team-label {
          font-size: 0.7rem;
          font-weight: 500;
          color: #374151;
          text-align: center;
          line-height: 1rem;
          margin-top: 6px;
          max-width: 90px;
          white-space: nowrap;
        }

        /* NUMEROS DEL MARCADOR */
        .score-numbers {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          line-height: 1;
        }

        /* izquierda morado llamativo */
        .num-left {
          font-size: 1.6rem;
          font-weight: 700;
          color: #4f46e5;
          min-width: 2ch;
          text-align: right;
        }

        .colon {
          font-size: 1.2rem;
          font-weight: 700;
          color: #111827;
        }

        /* derecha negro */
        .num-right {
          font-size: 1.6rem;
          font-weight: 700;
          color: #111827;
          min-width: 2ch;
          text-align: left;
        }

        /* ===== DERECHA: GAME VIEW ===== */
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
          color: #1E3A8A;
   
          cursor: pointer;
          font-weight: 600;
          white-space: nowrap;
          height: fit-content;
        }

        .bubble {
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 0 6px;
          font-weight: 600;
          font-size: 0.7rem;
          line-height: 1.2;
          color: #111827;
        }

        .txt {
          font-weight: 600;
        }

        .arrow {
          font-weight: 600;
          color: #6b7280;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 900px) {
          .score-header {
            grid-template-columns: 1fr;
            row-gap: 12px;
          }

          .score-block {
            order: 2;
            flex-wrap: wrap;
          }

          .live-info {
            order: 1;
          }

          .gameview-btn {
            order: 3;
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
}





/* ========================= GAME ROW ========================= */
function GameRowCompact({
  abbr,
  name,
  record,
  badgeBg,
  divisionOrNote,
  partidoId,
  moneyline,
  spread,
  total,
  onPick,
}: {
  abbr: string;
  name: string;
  record?: string;
  badgeBg: string;
  divisionOrNote?: string;
  partidoId: string;
  moneyline?: { label: string; price: string; tone?: string };
  spread?: { label: string; price: string; tone?: string };
  total?: { label: string; price: string; tone?: string };
  onPick: (sel: Seleccion) => void;
}) {
  return (
    <>
      <div className="gamerow-wrap">
        <div className="teamcell">
          <div className="left-col">
            {divisionOrNote && (
              <div className="seed-chip">{divisionOrNote}</div>
            )}
            <div className="mini-badge" style={{ background: badgeBg }}>
              {abbr}
            </div>
            <div className="team-meta">
              <div className="team-line">
                <span className="strong">{abbr}</span> {name}
              </div>
              {record && <div className="record">{record}</div>}
            </div>
          </div>
        </div>

        <OddsCell
          opt={moneyline}
          toneOverride={abbr === "KC" ? "red" : abbr === "SF" ? "blue" : undefined}
          mercado="Moneyline"
          partidoId={partidoId}
          onPick={onPick}
        />
        <OddsCell
          opt={spread}
          mercado="Spread"
          partidoId={partidoId}
          onPick={onPick}
        />
        <OddsCell
          opt={total}
          mercado="Total"
          partidoId={partidoId}
          onPick={onPick}
        />
      </div>

      <style jsx>{`
        .gamerow-wrap {
          display: grid;
          grid-template-columns: minmax(220px, 1fr) repeat(3, minmax(180px, 1fr));
          gap: 12px;
          align-items: flex-start;
        }
        .left-col {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .seed-chip {
          background: #f9fafb;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 4px 8px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #111827;
        }
        .mini-badge {
          min-width: 40px;
          min-height: 32px;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }
        .team-line {
          font-weight: 600;
          color: #111827;
        }
        .record {
          color: #6b7280;
          font-size: 0.75rem;
        }
        @media (max-width: 900px) {
          .gamerow-wrap {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

/* ========================= ODDS CELL ========================= */
function OddsCell({
  opt,
  mercado,
  partidoId,
  onPick,
  toneOverride,
}: {
  opt?: { label: string; price: string; tone?: string };
  mercado: string;
  partidoId: string;
  onPick: (sel: Seleccion) => void;
  toneOverride?: "red" | "blue" | undefined;
}) {
  if (!opt) return null;

  const handleClick = () =>
    onPick({
      partidoId,
      mercado,
      opcion: opt.label,
      cuota: opt.price,
      etiqueta: `${mercado} ${opt.label}`,
      timestamp: Date.now(),
    });

  const tone = toneOverride || opt.tone;
  const toneClass =
    tone === "red" ? "tone-red" : tone === "blue" ? "tone-blue" : "tone-neutral";

  return (
    <>
      <button type="button" className={`odds-pill ${toneClass} inactive active `} onClick={handleClick}>
        <div>{opt.label}</div>
        <div>{opt.price}</div>
      </button>

      <style jsx>{`
  .odds-pill {
    width: 100%;
    border-radius: 8px;
    padding: 10px 12px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.15s ease;

  }

  /* estado INACTIVO (reposo) */
  .odds-pill.inactive {
    background: #ffffff;            /* fondo blanco */
    border-color: #1E3A8A;          /* borde azul */
    color: #1E3A8A;                 /* texto azul */
  }

  /* estado ACTIVO (seleccionado) */
  .odds-pill.active {
    background: #ffffffff;            /* fondo azul */
    color: #1E3A8A;                 /* texto blanco */



    position: relative;
  }

  /* borde animado "latido" alrededor cuando está activo */
  .odds-pill.active::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 8px;
    border: 2px solid rgba(30, 58, 138, 0.6); /* azul */
    animation: pulseBorder 1.4s infinite ease-in-out;
    pointer-events: none;
  }

 

  /* hover para las que no están activas (feedback táctil) */
  .odds-pill.inactive:hover {
    background: #1E3A8A;            /* azul muy clarito */
    color:#fff
  }
`}</style>

    </>
  );
}
