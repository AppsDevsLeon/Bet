"use client";

import React from "react";
import type { GameCardData, Seleccion } from "./types";

/* ========== Pill estilo sportsbook (azul/rojo/gris) ========== */
function PricePill({
  label,
  price,
  tone,
  onClick,
}: {
  label: string;
  price: string;
  tone?: string; // "red" | "blue" | "gray"
  onClick?: () => void;
}) {
  const getColors = () => {
    switch (tone) {
      case "red":
        return { bg: "#B3001B", text: "#fff" }; // rojo favorito local / side A
      case "blue":
        return { bg: "#0049B8", text: "#fff" }; // azul favorito visitante / side B
      case "gray":
      default:
        return { bg: "#E5E7EB", text: "#111827" }; // DRAW / neutral
    }
  };

  const { bg, text } = getColors();

  return (
    <>
      <button
        type="button"
        className="pill-wrap"
        onClick={onClick}
        style={{
          backgroundColor: bg,
          color: text,
        }}
      >
        <span className="pill-label">
          {label} <span className="pill-price">{price}</span>
        </span>
      </button>

      <style jsx>{`
        .pill-wrap {
          width: 100%;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.2;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;

          border: 1px solid rgba(0, 0, 0, 0.15);
          box-shadow: 0 3px 0 rgba(0, 0, 0, 0.2);
        }

        .pill-wrap:active {
          transform: translateY(1px);
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
        }

        .pill-label {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 4px;
        }

        .pill-price {
          font-weight: 700;
        }
      `}</style>
    </>
  );
}

/* =========================================================
   GameCardScheduledWhite
   ========================================================= */
export default function GameCardScheduledWhite({
  game,
  onPick,
  onOpenGame,
  gameDateLabel,
}: {
  game: GameCardData;
  onPick: (sel: Seleccion) => void;
  onOpenGame: (id: string) => void;
  gameDateLabel: string;
}) {
  // 🔥 nueva lógica de color para moneyline
  function getToneForMoneyline(
    label: string,
    idx: number,
    totalOptions: number,
    toneFromData?: string
  ) {
    // si ya nos mandaste tone explícito desde la data (opt.tone) respétalo
    if (toneFromData === "red") return "red";
    if (toneFromData === "blue") return "blue";
    if (toneFromData === "gray") return "gray";

    // si es DRAW, siempre gris neutro
    if (label.toUpperCase().includes("DRAW")) {
      return "gray";
    }

    // si solo hay 2 opciones (NFL)
    // idx 0 -> rojo, idx 1 -> azul
    if (totalOptions === 2) {
      return idx === 0 ? "red" : "blue";
    }

    // si hay 3 opciones (soccer clásico away/draw/home o home/draw/away):
    // idea: el que está en medio suele ser DRAW → ya cubrimos arriba
    // entonces:
    // idx 0 -> rojo
    // idx 2 -> azul
    if (totalOptions === 3) {
      if (idx === 0) return "red";
      if (idx === 2) return "blue";
    }

    // fallback
    return "gray";
  }

  // construir tu Seleccion con tu shape oficial
  function buildSeleccion({
    mercado,
    optLabel,
    optPrice,
  }: {
    mercado: string;
    optLabel: string;
    optPrice: string;
  }): Seleccion {
    return {
      partidoId: game.id,
      mercado, // "Moneyline" | "Spread" | "Total"
      opcion: optLabel,
      cuota: optPrice,
      etiqueta: `${mercado}: ${optLabel} @ ${optPrice}`,
      timestamp: Date.now(),
    };
  }

  // Week 10 • AT&T Stadium • SNF
  const metaLine = [game.week, game.stadium, game.broadcast]
    .filter(Boolean)
    .join(" • ");

  return (
    <>
      <section className="match-block">
        {/* ===== Encabezado fecha + columnas ===== */}
        <header className="date-row">
          <div className="date-label">{gameDateLabel}</div>

          <div className="cols-labels">
            <div className="col-head">MONEYLINE</div>
            <div className="col-head">SPREAD</div>
            <div className="col-head">TOTAL</div>
          </div>
        </header>

        {/* ===== Card ===== */}
        <article className="card">
          {/* fila superior (hora, vol, estadio, Game View, bell) */}
          <div className="card-top">
            <div className="left-meta">
              <div className="row-1">
                <span className="time-chip">
                  {game.kickoff ??
                    (game.isLive
                      ? game.liveClock ?? game.liveLabel ?? "LIVE"
                      : "Scheduled")}
                </span>

                <span className="vol">{game.vol}</span>
              </div>

              {metaLine && <div className="row-2 meta-extra">{metaLine}</div>}
            </div>

            <div className="right-meta">
              <button
                className="gameview-btn"
                onClick={() => onOpenGame(game.id)}
              >
                <span className="bubble">{game.marketsCount}</span>
                <span className="txt">Game View</span>
                <span className="arrow">›</span>
              </button>

              <button className="bell-btn" title="Notifications / Alerts">
                🔔
              </button>
            </div>
          </div>

          {/* ===== Grid principal (equipos / moneyline / spread / total) ===== */}
          <div className="lines-grid">
            {/* equipos */}
            <div className="teams-col">
              <TeamRow side={game.away} />
              <TeamRow side={game.home} />
            </div>

            {/* moneyline */}
            <div className="moneyline-col">
              {game.moneyline.slice(0, 3).map((opt, idx, arr) => (
                <div className="price-slot" key={idx}>
                  <PricePill
                    label={opt.label}
                    price={opt.price}
                    tone={getToneForMoneyline(
                      opt.label,
                      idx,
                      arr.length,
                      opt.tone
                    )}
                    onClick={() =>
                      onPick(
                        buildSeleccion({
                          mercado: "Moneyline",
                          optLabel: opt.label,
                          optPrice: opt.price,
                        })
                      )
                    }
                  />
                </div>
              ))}
            </div>

            {/* spread */}
            <div className="spread-col">
              {game.spread.slice(0, 2).map((opt, idx) => (
                <div className="price-slot" key={idx}>
                  <PricePill
                    label={opt.label}
                    price={opt.price}
                    tone="gray"
                    onClick={() =>
                      onPick(
                        buildSeleccion({
                          mercado: "Spread",
                          optLabel: opt.label,
                          optPrice: opt.price,
                        })
                      )
                    }
                  />
                </div>
              ))}
            </div>

            {/* total */}
            <div className="total-col">
              {game.total.slice(0, 2).map((opt, idx) => (
                <div className="price-slot" key={idx}>
                  <PricePill
                    label={opt.label}
                    price={opt.price}
                    tone="gray"
                    onClick={() =>
                      onPick(
                        buildSeleccion({
                          mercado: "Total",
                          optLabel: opt.label,
                          optPrice: opt.price,
                        })
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <style jsx>{`
        .match-block {
          display: grid;
          row-gap: 8px;
          color: #111827;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Inter",
            "Roboto", "Segoe UI", sans-serif;
        }

        .date-row {
          display: grid;
          grid-template-columns: minmax(160px, auto) 1fr;
          align-items: end;
          column-gap: 16px;
          row-gap: 8px;
        }

        .date-label {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .cols-labels {
          display: grid;
          grid-template-columns: repeat(3, minmax(140px, 1fr));
          column-gap: 16px;
          row-gap: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .col-head {
          text-align: center;
        }

        @media (max-width: 800px) {
          .date-row {
            grid-template-columns: 1fr;
          }
          .cols-labels {
            grid-template-columns: repeat(3, 1fr);
          }
          .col-head {
            text-align: left;
          }
        }

        .card {
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.04);
          padding: 16px;
          display: grid;
          row-gap: 16px;
        }

        .card-top {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          font-size: 0.8rem;
          line-height: 1.2;
          gap: 12px;
        }

        .left-meta {
          display: grid;
          row-gap: 4px;
          color: #111827;
        }

        .row-1 {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .time-chip {
          border-radius: 6px;
          background: #f9fafb;
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

        .meta-extra {
          font-size: 0.7rem;
          line-height: 1.2;
          color: #6b7280;
          font-weight: 400;
        }

        .right-meta {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .gameview-btn {
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

        .gameview-btn .bubble {
          background: #e5e7eb;
          border-radius: 6px;
          padding: 0 6px;
          font-weight: 600;
          font-size: 0.7rem;
          line-height: 1.2;
          color: #111827;
        }

        .gameview-btn .arrow {
          font-weight: 600;
          color: #6b7280;
        }

        .bell-btn {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          box-shadow: 0 2px 0 #cfcfcf;
          font-size: 0.8rem;
          line-height: 1;
          padding: 6px 8px;
          cursor: pointer;
        }

        .lines-grid {
          display: grid;
          grid-template-columns:
            minmax(180px, 1fr)
            minmax(160px, 1fr)
            minmax(160px, 1fr)
            minmax(160px, 1fr);
          column-gap: 16px;
          row-gap: 16px;
        }

        @media (max-width: 900px) {
          .lines-grid {
            grid-template-columns: 1fr;
          }
        }

        .teams-col {
          display: grid;
          row-gap: 16px;
          min-width: 0;
        }

        .moneyline-col,
        .spread-col,
        .total-col {
          display: grid;
          row-gap: 8px;
          min-width: 0;
        }

        .price-slot {
          min-width: 0;
        }
      `}</style>
    </>
  );
}

/* ========== TeamRow (logo, nombre, record) ========== */
function TeamRow({
  side,
}: {
  side: {
    abbr: string;
    name: string;
    record?: string;
    color?: string;
    logo?: string;
  };
}) {
  return (
    <>
      <div className="teamrow">
        <div className="logo-wrap">
          {side.logo ? (
            <img src={side.logo} alt={side.abbr} className="logo-img" />
          ) : (
            <div
              className="logo-fallback"
              style={{ backgroundColor: side.color || "#1e3a8a" }}
            >
              {side.abbr}
            </div>
          )}
        </div>

        <div className="team-meta">
          <div className="name-line">
            <span className="abbr">{side.abbr}</span>{" "}
            <span className="team-name">{side.name}</span>
          </div>
          {side.record && <div className="record">{side.record}</div>}
        </div>
      </div>

      <style jsx>{`
        .teamrow {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: flex-start;
          column-gap: 12px;
          font-size: 0.9rem;
          line-height: 1.2;
          color: #111827;
        }

        .logo-wrap {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-img {
          width: 32px;
          height: 32px;
          object-fit: contain;
        }

        .logo-fallback {
          min-width: 32px;
          min-height: 32px;
          border-radius: 999px;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          line-height: 32px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(0, 0, 0, 0.2);
        }

        .team-meta {
          display: grid;
          row-gap: 2px;
        }

        .name-line {
          font-weight: 600;
          display: flex;
          flex-wrap: wrap;
          column-gap: 4px;
          color: #111827;
        }

        .abbr {
          font-weight: 700;
        }

        .team-name {
          font-weight: 500;
        }

        .record {
          font-size: 0.8rem;
          color: #6b7280;
          line-height: 1.2;
        }
      `}</style>
    </>
  );
}
