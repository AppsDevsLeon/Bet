"use client";

import React from "react";
import type { GameInfo, Seleccion } from "./types";

// Botón pill individual en la lista (moneyline/spread/total)
function Pill({
  tone,
  left,
  right,
  active,
  onClick,
}: {
  tone: "neutral" | "green" | "red" | "blue" | "purple";
  left: string;
  right: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <>
      <button
        className={`pill ${tone} ${active ? "active" : ""}`}
        onClick={onClick}
      >
        <span className="l">{left}</span>
        <span className="r">{right}</span>
      </button>

      <style jsx>{`
        .pill {
          min-width: 130px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 10px;
          border: 1px solid #dcdcdc;
          background: #f9fafb;
          box-shadow: 0 3px 0 #cfcfcf;
          padding: 10px 12px;
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.2;
          color: #4b5563;
          cursor: pointer;
        }

        .pill.blue {
          background: #132b76;
          background-image: linear-gradient(#132b76, #0a1654);
          border-color: #0a1654;
          box-shadow: 0 3px 0 #02071f;
          color: #fff;
        }
        .pill.purple {
          background: #4d2cae;
          background-image: linear-gradient(#4d2cae, #2e1966);
          border-color: #2e1966;
          box-shadow: 0 3px 0 #170d36;
          color: #fff;
        }
        .pill.green {
          background: #0d6b3a;
          background-image: linear-gradient(#0d6b3a, #0a4c2a);
          border-color: #0a4c2a;
          box-shadow: 0 3px 0 #07361e;
          color: #fff;
        }
        .pill.red {
          background: #8a1a1a;
          background-image: linear-gradient(#8a1a1a, #4f0f0f);
          border-color: #4f0f0f;
          box-shadow: 0 3px 0 #2b0606;
          color: #fff;
        }

        .pill.active {
          outline: 2px solid #1248ff;
          outline-offset: 0;
        }

        .l {
          font-weight: 500;
        }
        .r {
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

export default function GameRow({
  game,
  selecciones,
  onSelect,
  onRequestDetail,
}: {
  game: GameInfo;
  selecciones: Seleccion[];
  onSelect: (sel: Seleccion) => void;     // agrega al betslip
  onRequestDetail: (gameId: string) => void; // abre GameDetail
}) {
  // helper: está activo en ticket?
  function isActive(opcion: string, cuota: string, mercado: string) {
    return selecciones.some(
      (s) =>
        s.partidoId === game.id &&
        s.opcion === opcion &&
        s.cuota === cuota &&
        s.mercado === mercado
    );
  }

  // fabrica de Seleccion que mandamos a onSelect()
  function handlePick(mercado: string, opcion: string, cuota: string) {
    onSelect({
      partidoId: game.id,
      mercado,
      opcion,
      cuota,
      etiqueta: `${opcion} ${cuota}`,
      timestamp: Date.now(),
    });
  }

  return (
    <>
      <section className="game-card">
        {/* fila superior (hora / vol / Game View) */}
        <div className="top-row">
          <div className="left-meta">
            <span className="time-chip">{game.kickoff}</span>
            <span className="vol">{game.vol}</span>
          </div>

          <button
            className="view-chip"
            onClick={() => onRequestDetail(game.id)}
          >
            <span className="bubble">30</span>
            <span className="txt">Game View ❯</span>
          </button>
        </div>

        {/* cuerpo principal */}
        <div className="body-grid">
          {/* Teams column */}
          <div className="teams-col">
            <div className="team-line">
              <span
                className="badge"
                style={{ background: game.visitantes.color || "#1a2a5a" }}
              >
                {game.visitantes.abbr}
              </span>
              <div className="meta">
                <div className="name">{game.visitantes.nombre}</div>
                {game.visitantes.record && (
                  <div className="rec">{game.visitantes.record}</div>
                )}
              </div>
            </div>

            <div className="team-line">
              <span
                className="badge"
                style={{ background: game.locales.color || "#4d3ba8" }}
              >
                {game.locales.abbr}
              </span>
              <div className="meta">
                <div className="name">{game.locales.nombre}</div>
                {game.locales.record && (
                  <div className="rec">{game.locales.record}</div>
                )}
              </div>
            </div>
          </div>

          {/* Moneyline col */}
          <div className="market-col">
            {game.markets.moneyline.map((m, i) => (
              <Pill
                key={`ml-${i}`}
                tone={i === 0 ? "blue" : "purple"}
                left={m.label}
                right={m.precio}
                active={isActive(m.label, m.precio, "Moneyline")}
                onClick={() => handlePick("Moneyline", m.label, m.precio)}
              />
            ))}
          </div>

          {/* Spread col */}
          <div className="market-col">
            {game.markets.spread.map((m, i) => (
              <Pill
                key={`sp-${i}`}
                tone={"neutral"}
                left={m.label}
                right={m.precio}
                active={isActive(m.label, m.precio, "Spreads")}
                onClick={() => handlePick("Spreads", m.label, m.precio)}
              />
            ))}
          </div>

          {/* Total col */}
          <div className="market-col">
            {game.markets.total.map((m, i) => (
              <Pill
                key={`tot-${i}`}
                tone={
                  m.tone === "green"
                    ? "green"
                    : m.tone === "red"
                    ? "red"
                    : "neutral"
                }
                left={m.label}
                right={m.precio}
                active={isActive(m.label, m.precio, "Totals")}
                onClick={() => handlePick("Totals", m.label, m.precio)}
              />
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .game-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.04);
          padding: 16px;
          display: grid;
          row-gap: 16px;
          color: #111827;
        }

        .top-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          row-gap: 8px;
          font-size: 0.8rem;
          line-height: 1.2;
        }

        .left-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        .time-chip {
          border-radius: 6px;
          background: #f5f5f5;
          border: 1px solid #dcdcdc;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 4px 8px;
          line-height: 1.1;
          box-shadow: 0 2px 0 #cfcfcf;
          color: #111827;
        }

        .vol {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .view-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f9fafb;
          border: 1px solid #dcdcdc;
          border-radius: 8px;
          padding: 4px 8px;
          font-size: 0.8rem;
          font-weight: 500;
          line-height: 1.1;
          box-shadow: 0 2px 0 #cfcfcf;
          color: #111827;
          cursor: pointer;
        }
        .bubble {
          background: #e5e7eb;
          color: #111827;
          border-radius: 999px;
          padding: 0 6px;
          font-size: 0.7rem;
          font-weight: 600;
          line-height: 1.2;
        }
        .txt {
          white-space: nowrap;
        }

        .body-grid {
          display: grid;
          grid-template-columns: minmax(160px, 1fr) repeat(3, minmax(140px, auto));
          gap: 16px;
        }

        .teams-col {
          display: grid;
          row-gap: 12px;
        }

        .team-line {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .badge {
          min-width: 44px;
          min-height: 36px;
          border-radius: 6px;
          color: #fff;
          font-weight: 700;
          font-size: 0.8rem;
          line-height: 36px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        }

        .meta .name {
          color: #111827;
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.3;
        }
        .meta .rec {
          color: #6b7280;
          font-size: 0.8rem;
          line-height: 1.2;
          font-weight: 400;
        }

        .market-col {
          display: grid;
          row-gap: 8px;
          align-content: start;
        }

        @media (max-width: 700px) {
          .body-grid {
            grid-template-columns: 1fr;
          }
          .market-col {
            grid-auto-flow: column;
            grid-auto-columns: minmax(140px, 1fr);
            column-gap: 10px;
            overflow-x: auto;
            white-space: nowrap;
            padding-bottom: 4px;
          }
        }
      `}</style>
    </>
  );
}
