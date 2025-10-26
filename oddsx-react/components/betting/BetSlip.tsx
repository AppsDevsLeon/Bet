"use client";

import React from "react";
import type { Seleccion } from "@/components/betting/types";

export default function BetSlip({
  selecciones,
  onRemove,
  onClear,
  headerH = "80px",
}: {
  selecciones: Seleccion[];
  onRemove: (index: number) => void;
  onClear: () => void;
  headerH?: string;
}) {
  const totalSelecciones = selecciones.length;

  return (
    <aside
      className="betslip"
      style={
        {
          "--header-h": headerH,
        } as React.CSSProperties
      }
    >
      <div className="bs-head">
        <h4>Ticket ({totalSelecciones})</h4>
        <button
          className="clear"
          onClick={onClear}
          disabled={!totalSelecciones}
        >
          Limpiar
        </button>
      </div>

      <div className="bs-body">
        {totalSelecciones === 0 ? (
          <div className="empty">No has seleccionado apuestas.</div>
        ) : (
          selecciones.map((s, i) => (
            <div className="item" key={`${s.partidoId}-${i}`}>
              <div className="top">
                <span className="tag">{s.mercado}</span>
                <button
                  className="x"
                  onClick={() => onRemove(i)}
                  aria-label="Quitar"
                />
              </div>

              <div className="txt">{s.etiqueta}</div>
              <div className="odd">{s.cuota}</div>
            </div>
          ))
        )}
      </div>

      <div className="bs-foot">
        <button className="cta" disabled={!totalSelecciones}>
          Continuar
        </button>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .betslip {
          position: sticky;
          top: var(--header-h, 80px);
          border: 1px solid var(--gray_light);
          border-radius: 12px;
          overflow: hidden;
          background: var(--surface);
          color: var(--text);
          min-width: 300px;
          max-width: 360px;
          height: fit-content;
        }

        .bs-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-bottom: 1px solid var(--gray_light);
          background: var(--surface-2);
        }

        .bs-head h4 {
          margin: 0;
          font-size: 0.9rem;
          color: var(--cta-bg);
          font-weight: 700;
        }

        .clear {
          background: transparent;
          color: var(--muted);
          border: 0;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .clear:disabled {
          opacity: 0.4;
          cursor: default;
        }

        .bs-body {
          display: grid;
          gap: 8px;
          padding: 12px;
          max-height: 55vh;
          overflow: auto;
          background: var(--surface);
        }

        .empty {
          color: var(--muted);
          font-size: 0.9rem;
        }

        .item {
          border: 1px solid var(--slip-card-border);
          border-radius: 10px;
          padding: 12px;
          background: var(--slip-card-bg);
          font-size: 0.9rem;
          line-height: 1.3;
          color: var(--text);
        }

        .item .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }

        .tag {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--cta-bg);
        }

        .x {
          width: 12px;
          height: 12px;
          border: 0;
          background: transparent;
          cursor: pointer;
          position: relative;
          color: var(--text);
        }
        .x::before,
        .x::after {
          content: "";
          position: absolute;
          left: 5px;
          top: 0;
          width: 2px;
          height: 12px;
          background: currentColor;
        }
        .x::before {
          transform: rotate(45deg);
        }
        .x::after {
          transform: rotate(-45deg);
        }

        .txt {
          font-weight: 600;
          margin-bottom: 2px;
          color: var(--text);
        }

        .odd {
          font-variant-numeric: tabular-nums;
          opacity: 0.9;
          font-size: 0.9rem;
          color: var(--text);
        }

        .bs-foot {
          padding: 12px 14px;
          border-top: 1px solid var(--gray_light);
          background: var(--surface-2);
        }

        .cta {
          width: 100%;
          padding: 12px;
          border: 0;
          border-radius: 10px;
          background: var(--cta-bg);
          color: var(--cta-text);
          font-weight: 800;
          cursor: pointer;
          font-size: 1rem;
        }

        .cta:hover {
          background: var(--cta-bg-hover);
        }

        @media (max-width: 900px) {
          .betslip {
            position: static;
            max-width: 100%;
            width: 100%;
          }
        }
      `}</style>
    </aside>
  );
}
