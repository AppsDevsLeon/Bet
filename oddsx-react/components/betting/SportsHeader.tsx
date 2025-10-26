"use client";

import React from "react";

export default function SportsHeader({
  activeTab = "games", // "games" | "props"
}: {
  activeTab?: "games" | "props";
}) {
  return (
    <>
      <header className="sports-head">
        <div className="left-side">
          <div className="league-block">
            <div className="league-logo">🏈</div>
            <div className="league-name">NFL</div>
            <button className="icon-btn">⚙️</button>
          </div>

          <nav className="tabs">
            <button
              className={`tab-btn ${activeTab === "games" ? "active" : ""}`}
            >
              Games
            </button>
            <button
              className={`tab-btn ${activeTab === "props" ? "active" : ""}`}
            >
              Props
            </button>
          </nav>
        </div>

        <div className="right-side">
          <div className="toggle-wrap">
            <div className="fake-toggle">
              <div className="dot" />
            </div>
            <span className="toggle-text">Show Spreads + Totals</span>
          </div>

          <button className="week-chip">
            Week 8 <span className="caret">▾</span>
          </button>
        </div>
      </header>

      <style jsx>{`
        .sports-head {
          display: flex;
          flex-wrap: wrap;
          row-gap: 12px;
          justify-content: space-between;
          align-items: flex-start;
          color: #111827;
        }

        .left-side {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          row-gap: 12px;
          column-gap: 16px;
        }

        .league-block {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.2;
          color: #111827;
        }
        .league-logo {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: #113c7f;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
        .league-name {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
        }
        .icon-btn {
          background: transparent;
          border: 0;
          font-size: 1rem;
          line-height: 1;
          cursor: pointer;
          color: #111827;
        }

        .tabs {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }
        .tab-btn {
          background: #f5f5f5;
          border: 1px solid #dcdcdc;
          box-shadow: 0 2px 0 #cfcfcf;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 1rem;
          line-height: 1.2;
          font-weight: 500;
          color: #111827;
          cursor: pointer;
        }
        .tab-btn.active {
          background: #e5e7eb;
          box-shadow: 0 2px 0 #bfc1c4;
          font-weight: 600;
        }

        .right-side {
          display: flex;
          flex-wrap: wrap;
          row-gap: 12px;
          column-gap: 16px;
          align-items: flex-start;
          font-size: 0.9rem;
          line-height: 1.2;
          color: #111827;
        }

        .toggle-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #111827;
          font-weight: 500;
        }
        .fake-toggle {
          width: 44px;
          height: 24px;
          background: #1248ff;
          border-radius: 999px;
          border: 2px solid #0034c7;
          box-shadow: 0 2px 0 #001f7a;
          position: relative;
        }
        .fake-toggle .dot {
          position: absolute;
          top: 2px;
          left: 22px;
          width: 16px;
          height: 16px;
          background: #fff;
          border-radius: 999px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .toggle-text {
          font-weight: 500;
          color: #111827;
        }

        .week-chip {
          background: #f5f5f5;
          border: 1px solid #dcdcdc;
          box-shadow: 0 2px 0 #cfcfcf;
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 1rem;
          font-weight: 500;
          color: #111827;
          cursor: pointer;
          line-height: 1.2;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .caret {
          font-size: 0.8rem;
          color: #111827;
        }

        @media (max-width: 700px) {
          .week-chip {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
}