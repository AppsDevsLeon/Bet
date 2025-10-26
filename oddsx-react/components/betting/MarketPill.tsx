"use client";

import React from "react";

export default function MarketPill({
  textLeft,
  textRight,
  tone = "neutral",
  active = false,
  onClick,
}: {
  textLeft: string;   // ej "NYJ +6.5" o "O 47.5"
  textRight: string;  // ej "55¢"
  tone?: "neutral" | "green" | "red";
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <>
      <button
        className={`pill ${tone} ${active ? "active" : ""}`}
        onClick={onClick}
        type="button"
      >
        <span className="l">{textLeft}</span>
        <span className="r">{textRight}</span>
      </button>

      <style jsx>{`
        .pill {
          appearance: none;
          border: 0;
          cursor: pointer;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.2;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 10px 12px;
          background: #f5f5f5;
          color: #000;
          box-shadow: 0 3px 0 #cfcfcf;
          border: 1px solid #dcdcdc;
          min-width: 130px;
          text-align: left;
          white-space: nowrap;
        }

        .pill.green {
          background: #0d6b3a;
          border-color: #0a4c2a;
          box-shadow: 0 3px 0 #07361e;
          color: #fff;
        }

        .pill.red {
          background: #c6424a;
          border-color: #913137;
          box-shadow: 0 3px 0 #6d2226;
          color: #fff;
        }

        .pill.active {
          outline: 2px solid #1a4fff; /* highlight like selection */
          box-shadow: 0 0 0 4px rgba(26, 79, 255, 0.15),
            0 6px 14px rgba(0, 0, 0, 0.22);
        }

        .l {
          font-weight: 600;
        }
        .r {
          font-variant-numeric: tabular-nums;
          font-weight: 700;
        }

        @media (max-width: 480px) {
          .pill {
            min-width: auto;
            flex: 1 1 auto;
          }
        }
      `}</style>
    </>
  );
}
