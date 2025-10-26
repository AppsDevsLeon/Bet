// /components/betting/BetSlip.tsx
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
            <div className="item" key={`${s.partidoId}-${s.opcion}-${i}`}>
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

      <style jsx>{`
        .betslip {
          position: sticky;
          top: var(--header-h, 80px);
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          background: #ffffff;
          color: #111827;
          min-width: 300px;
          max-width: 360px;
          height: fit-content;
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
        }

        .bs-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .bs-head h4 {
          margin: 0;
          font-size: 0.9rem;
          color: #1248ff;
          font-weight: 700;
        }

        .clear {
          background: transparent;
          color: #6b7280;
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
          background: #ffffff;
        }
        .empty {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .item {
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 10px;
          padding: 12px;
          background: #fff;
          font-size: 0.9rem;
          line-height: 1.3;
          color: #111827;
          box-shadow: 0 8px 16px rgba(0,0,0,0.04);
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
          color: #1248ff;
        }
        .x {
          width: 12px;
          height: 12px;
          border: 0;
          background: transparent;
          cursor: pointer;
          position: relative;
          color: #111827;
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
          color: #111827;
        }
        .odd {
          font-variant-numeric: tabular-nums;
          opacity: 0.9;
          font-size: 0.9rem;
          color: #111827;
        }

        .bs-foot {
          padding: 12px 14px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        .cta {
          width: 100%;
          padding: 12px;
          border: 0;
          border-radius: 10px;
          background: #1248ff;
          box-shadow: 0 4px 0 #001f7a;
          color: #ffffff;
          font-weight: 700;
          cursor: pointer;
          font-size: 1rem;
        }
        .cta:disabled {
          opacity: 0.4;
          cursor: default;
        }
      `}</style>
    </aside>
  );
}
