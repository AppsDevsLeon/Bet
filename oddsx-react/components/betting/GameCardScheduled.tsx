"use client";

import React from "react";
import type { GameCardData, Seleccion } from "./types";

/* ===============================
   Paleta y helpers visuales
================================= */
const BLUE = "#1E3C8E";
const BLUE_DARK = "#162C68";
const BLUE_LIGHT = "#3153C7";
const RED = "#B91C1C";
const SLATE_TEXT = "#111827";
const SLATE_SUB = "#6B7280";
const GRAY_BG = "#F3F4F6";
const GRAY_BORDER = "#D1D5DB";

/* ---------------------------------
   Parseo de cuotas → probabilidad
   Soporta:
   - American: +150 / -120 / +100 / -105 / EVEN / EV
   - Decimal: 1.80, 2.05
   - Fraccional: 5/2, 11/10
---------------------------------- */
function oddsToImpliedProb(oddsRaw: string | number): number | null {
  const raw = String(oddsRaw).trim().toUpperCase();

  // American EVEN
  if (raw === "EVEN" || raw === "EV") return 0.5;

  // Fraccional a/b
  if (/^\d+\s*\/\s*\d+$/.test(raw)) {
    const [a, b] = raw.split("/").map((x) => parseFloat(x));
    if (a > 0 && b > 0) {
      // decimal = 1 + a/b → prob = 1/decimal
      const dec = 1 + a / b;
      return dec > 0 ? 1 / dec : null;
    }
    return null;
  }

  // American (+150, -120)
  if (/^[\+\-]\d+$/.test(raw)) {
    const num = parseInt(raw, 10);
    if (num > 0) return 100 / (num + 100); // underdog +
    if (num < 0) return -num / (-num + 100); // favorito -
    return null;
  }

  // Decimal (1.80, 2, 3.25)
  const dec = Number(raw);
  if (!Number.isNaN(dec) && dec > 1) {
    return 1 / dec;
  }

  // Si viene dentro de texto como "-2.5 (-110)" intentamos extraer el número
  const match = raw.match(/([+\-]\d{2,3})/);
  if (match) {
    const n = parseInt(match[1], 10);
    return n > 0 ? 100 / (n + 100) : -n / (-n + 100);
  }

  return null;
}

function formatProb(p: number | null): string {
  if (p == null) return "";
  const pct = Math.round(p * 100);
  return `≈ ${pct}%`;
}

/* ========== Pill estilo sportsbook (azul/rojo/gris) ========== */
function PricePill({
  label,
  price,
  tone,
  onClick,
}: {
  label: string;
  price: string;
  tone?: "red" | "blue" | "gray";
  onClick?: () => void;
}) {
  const prob = oddsToImpliedProb(price);

  const colors = (() => {
    switch (tone) {
      case "red":
        return {
          bg: RED,
          bgHover: "#991B1B",
          text: "#fff",
          border: "rgba(0,0,0,0.15)",
          shadow: "0 3px 0 rgba(0, 0, 0, 0.2)",
        };
      case "blue":
        return {
          bg: `linear-gradient(180deg, ${BLUE_LIGHT}, ${BLUE})`,
          bgHover: `linear-gradient(180deg, ${BLUE}, ${BLUE_DARK})`,
          text: "#fff",
          border: "rgba(0,0,0,0.12)",
          shadow: "0 3px 0 rgba(0, 0, 0, 0.22)",
        };
      case "gray":
      default:
        return {
          bg: "#E5E7EB",
          bgHover: "#D1D5DB",
          text: SLATE_TEXT,
          border: "rgba(0,0,0,0.12)",
          shadow: "0 3px 0 rgba(0, 0, 0, 0.18)",
        };
    }
  })();

  return (
    <>
      <button
        type="button"
        className="pill-wrap"
        onClick={onClick}
        style={{
          color: colors.text,
          borderColor: colors.border,
          boxShadow: colors.shadow as any,
          background:
            tone === "blue" || tone === "red" ? (colors.bg as any) : undefined,
          backgroundColor: tone === "gray" ? (colors.bg as any) : undefined,
        }}
      >
        <span className="pill-label">
          <span className="pill-main">
            <span className="pill-market">{label}</span>
            <span className="pill-price">{price}</span>
          </span>
          {prob !== null && prob !== undefined && (
            <span className="pill-prob">{formatProb(prob)}</span>
          )}
        </span>
      </button>

      <style jsx>{`
        .pill-wrap {
          width: 100%;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1.2;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          border: 1px solid;
          transition: transform 0.08s ease, box-shadow 0.08s ease,
            background 0.12s ease;
          will-change: transform, box-shadow, background;
        }
        .pill-wrap:hover {
          filter: saturate(1.08);
        }
        .pill-wrap:active {
          transform: translateY(1px);
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
        }

        .pill-label {
          display: grid;
          row-gap: 4px;
          justify-items: center;
        }
        .pill-main {
          display: flex;
          gap: 8px;
          align-items: baseline;
          flex-wrap: wrap;
        }
        .pill-market {
          font-weight: 600;
          opacity: 0.95;
        }
        .pill-price {
          font-weight: 800;
          letter-spacing: 0.2px;
        }
        .pill-prob {
          font-size: 0.75rem;
          font-weight: 600;
          opacity: 0.95;
        }

        /* Hover color swap por tono */
        .pill-wrap:hover {
          background: ${
            tone === "blue"
              ? `linear-gradient(180deg, ${BLUE}, ${BLUE_DARK})`
              : tone === "red"
              ? "#991B1B"
              : "#ffffffff"
          };
        }
      `}</style>
    </>
  );
}

/* =========================================================
   GameCardScheduledWhite (elegante azul/blanco + prob)
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
  // Coloreo moneyline si no viene desde la data:
  function getToneForMoneyline(
    label: string,
    idx: number,
    totalOptions: number,
    toneFromData?: string
  ): "red" | "blue" | "gray" {
    if (toneFromData === "red") return "red";
    if (toneFromData === "blue") return "blue";
    if (toneFromData === "gray") return "gray";

    if (label.toUpperCase().includes("DRAW")) return "gray";
    if (totalOptions === 2) return idx === 0 ? "red" : "blue";
    if (totalOptions === 3) {
      if (idx === 0) return "red";
      if (idx === 2) return "blue";
      return "gray";
    }
    return "gray";
  }

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
            <div className="col-head">Moneyline</div>
            <div className="col-head">Spread</div>
            <div className="col-head">Total</div>
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

                {game.vol && <span className="vol">Vol: {game.vol}</span>}
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
                      (opt as any).tone
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
          row-gap: 10px;
          color: ${SLATE_TEXT};
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
          font-weight: 700;
          color: ${SLATE_TEXT};
        }

        .cols-labels {
          display: grid;
          grid-template-columns: repeat(3, minmax(160px, 1fr));
          column-gap: 16px;
          row-gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          color: ${SLATE_SUB};
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .col-head {
          text-align: center;
        }

        @media (max-width: 880px) {
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
          border: 1px solid ${GRAY_BORDER};
          border-radius: 14px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.05);
          padding: 16px;
          display: grid;
          row-gap: 16px;
        }

        .card-top {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          font-size: 0.85rem;
          line-height: 1.2;
          gap: 12px;
        }

        .left-meta {
          display: grid;
          row-gap: 4px;
          color: ${SLATE_TEXT};
        }

        .row-1 {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .time-chip {
          border-radius: 8px;
          background: ${GRAY_BG};
          border: 1px solid ${GRAY_BORDER};
          padding: 6px 10px;
          font-size: 0.82rem;
          font-weight: 600;
          line-height: 1.1;
          color: ${SLATE_TEXT};
          box-shadow: 0 2px 0 #cfcfcf;
        }

        .vol {
          color: ${SLATE_SUB};
          font-weight: 500;
        }

        .meta-extra {
          font-size: 0.75rem;
          line-height: 1.2;
          color: ${SLATE_SUB};
          font-weight: 500;
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
          border: 1px solid ${GRAY_BORDER};
          border-radius: 10px;
          font-size: 0.78rem;
          line-height: 1rem;
          padding: 8px 12px;
          color: ${SLATE_TEXT};
          box-shadow: 0 2px 0 #cfcfcf;
          cursor: pointer;
          white-space: nowrap;
          font-weight: 700;
        }

        .gameview-btn .bubble {
          background: #e5e7eb;
          border-radius: 8px;
          padding: 0 8px;
          font-weight: 800;
          font-size: 0.72rem;
          line-height: 1.2;
          color: ${SLATE_TEXT};
        }

        .gameview-btn .arrow {
          font-weight: 800;
          color: ${SLATE_SUB};
        }

        .bell-btn {
          background: #fff;
          border-radius: 10px;
          border: 1px solid ${GRAY_BORDER};
          box-shadow: 0 2px 0 #cfcfcf;
          font-size: 0.9rem;
          line-height: 1;
          padding: 8px 10px;
          cursor: pointer;
        }

        .lines-grid {
          display: grid;
          grid-template-columns:
            minmax(200px, 1.2fr)
            minmax(180px, 1fr)
            minmax(180px, 1fr)
            minmax(180px, 1fr);
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
          row-gap: 18px;
          min-width: 0;
        }

        .moneyline-col,
        .spread-col,
        .total-col {
          display: grid;
          row-gap: 10px;
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
              style={{ backgroundColor: side.color || BLUE }}
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
          align-items: center;
          column-gap: 12px;
          font-size: 0.95rem;
          line-height: 1.2;
          color: ${SLATE_TEXT};
        }

        .logo-wrap {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-img {
          width: 36px;
          height: 36px;
          object-fit: contain;
        }

        .logo-fallback {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 800;
          line-height: 36px;
          text-align: center;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.18);
          border: 1px solid rgba(0, 0, 0, 0.18);
          letter-spacing: 0.2px;
        }

        .team-meta {
          display: grid;
          row-gap: 2px;
        }

        .name-line {
          font-weight: 700;
          display: flex;
          flex-wrap: wrap;
          column-gap: 6px;
          color: ${SLATE_TEXT};
        }

        .abbr {
          font-weight: 900;
          color: ${BLUE};
        }

        .team-name {
          font-weight: 700;
        }

        .record {
          font-size: 0.8rem;
          color: ${SLATE_SUB};
          line-height: 1.2;
        }
      `}</style>
    </>
  );
}
