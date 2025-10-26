// components/betting/Pill.tsx
"use client";

import React from "react";

export default function Pill({
  tone = "neutral",
  label,
  onClick,
}: {
  tone?: "neutral" | "green" | "red" | "yellow" | "blue";
  label: string;
  onClick: () => void;
}) {
  return (
    <>
      <button className={`pill ${tone}`} onClick={onClick} type="button">
        {label}
      </button>

      <style jsx>{`
        .pill {
          min-width: 140px;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 10px;
          padding: 12px;
          line-height: 1.2;
          box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);
          border: 1px solid #d1d5db;
          background: #f3f4f6;
          color: #111827;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }

        /* verde tipo Betis 30¢ / Over verde */
        .pill.green {
          background: #0d6b3a;
          color: #ffffff;
          border-color: #0a4c2a;
          box-shadow: 0 4px 0 #07361e;
        }

        /* rojo tipo Madrid 45¢ */
        .pill.red {
          background: #c6424a;
          color: #ffffff;
          border-color: #7a1f24;
          box-shadow: 0 4px 0 #6d2226;
        }

        /* amarillo tipo REA 77¢ */
        .pill.yellow {
          background: #ffcf2e;
          color: #1a1a1a;
          border-color: #b99300;
          box-shadow: 0 4px 0 #8a6e00;
        }

        /* azul tipo CEL 30¢ */
        .pill.blue {
          background: #3b82f6;
          color: #fff;
          border-color: #1e3a8a;
          box-shadow: 0 4px 0 #1e3a8a;
        }
      `}</style>
    </>
  );
}
