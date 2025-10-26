"use client";

import React from "react";

export default function LeagueHeader({
  leagueName,
  leagueIcon,
  activeTab,
  onTabChange,
  showSpreads,
  onToggleSpreads,
  weekLabel,
  onWeekClick,
  dayLabel,
  showColumns,
}: {
  leagueName: string;                       // "NFL", "NBA", ...
  leagueIcon: React.ReactNode;              // <img .../> o "🏀"
  activeTab: "games" | "props";
  onTabChange: (tab: "games" | "props") => void;
  showSpreads: boolean;
  onToggleSpreads: (next: boolean) => void;
  weekLabel: string;                        // "Week 8", "Week 3", "Playoffs"
  onWeekClick?: () => void;                 // abrir dropdown semanas
  dayLabel: string;                         // "Sun, October 26"
  showColumns: boolean;                     // mostrar MONEYLINE/SPREAD/TOTAL?
}) {
  return (
    <>
      <header className="league-head">
        {/* LEFT: icon + league + tabs */}
        <div className="left-side">
          <div className="league-id">
            <div className="icon-box">{leagueIcon}</div>
            <h1 className="league-text">{leagueName}</h1>
          </div>

          <nav className="tabs">
            <button
              className={`tab-btn ${activeTab === "games" ? "active" : ""}`}
              onClick={() => onTabChange("games")}
            >
              Games
            </button>
            <button
              className={`tab-btn ${activeTab === "props" ? "active" : ""}`}
              onClick={() => onTabChange("props")}
            >
              Props
            </button>
          </nav>
        </div>

        {/* RIGHT: toggle + week chip */}
        <div className="right-side">
          <div className="toggle-shell">
            <span className="gear" aria-hidden>
              ⚙️
            </span>

            <button
              className="spread-toggle"
              onClick={() => onToggleSpreads(!showSpreads)}
            >
              <span className={`switch ${showSpreads ? "on" : ""}`}>
                <span className="knob" />
              </span>
              <span className="label">Show Spreads + Totals</span>
            </button>
          </div>

          <button
            className="week-chip"
            onClick={onWeekClick}
            type="button"
          >
            <span>{weekLabel}</span>
            <span className="caret">▾</span>
          </button>
        </div>
      </header>

      {/* second row: date + column headers (optional per tab / per sport) */}
      {showColumns && (
        <div className="sub-head">
          <div className="left-block">
            <div className="date-line">{dayLabel}</div>
          </div>

          <div className="cols-block">
            <span className="col-head">MONEYLINE</span>
            <span className="col-head">SPREAD</span>
            <span className="col-head">TOTAL</span>
          </div>
        </div>
      )}

      <style jsx>{`
        /* CONTAINER HEADER */
        .league-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-start;
          row-gap: 12px;
          column-gap: 16px;
          padding: 16px 16px 8px;
          background: #fff;
        }

        /* LEFT SIDE */
        .left-side {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          gap: 16px;
          min-width: 0;
        }

        .league-id {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .icon-box {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          background: #fff;
          border: 1px solid #d1d5db;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
          font-size: 20px;
          line-height: 36px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .league-text {
          font-size: 1.75rem;
          line-height: 1.2;
          font-weight: 700;
          color: #000;
          margin: 0;
        }

        .tabs {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .tab-btn {
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background: #f9fafb;
          box-shadow: 0 4px 0 rgba(0, 0, 0, 0.08);
          min-width: 90px;
          padding: 10px 14px;
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.2;
          color: #6b7280;
          text-align: center;
        }

        .tab-btn.active {
          background: #e5e7eb;
          color: #000;
          border-color: #6b7280;
          box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);
        }

        /* RIGHT SIDE */
        .right-side {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          gap: 16px;
          margin-left: auto;
        }

        .toggle-shell {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 8px 12px;
          background: #fff;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          font-size: 0.9rem;
          line-height: 1.2;
          color: #111827;
        }

        .gear {
          font-size: 1rem;
          line-height: 1;
          color: #111827;
        }

        .spread-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          color: #111827;
        }

        .switch {
          position: relative;
          width: 44px;
          height: 26px;
          border-radius: 999px;
          background: #e5e7eb;
          box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
          transition: background 0.15s;
        }
        .switch.on {
          background: #1248ff;
        }

        .knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
          transition: transform 0.15s;
        }
        .switch.on .knob {
          transform: translateX(18px);
        }

        .label {
          white-space: nowrap;
          color: #111827;
        }

        .week-chip {
          border-radius: 12px;
          background: #f9fafb;
          border: 1px solid #d1d5db;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.2;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #000;
          min-width: 110px;
        }

        .caret {
          font-size: 0.9rem;
          line-height: 1;
          color: #6b7280;
        }

        /* SUB-HEAD (optional row) */
        .sub-head {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          row-gap: 12px;
          padding: 0 16px 16px;
          background: #fff;
        }

        .date-line {
          font-size: 1.3rem;
          font-weight: 600;
          color: #000;
          line-height: 1.3;
        }

        .cols-block {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 120px));
          gap: 24px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b7280;
          line-height: 1.2;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        @media (max-width: 800px) {
          .cols-block {
            display: none;
          }

          .right-side {
            width: 100%;
            justify-content: space-between;
            order: 2;
          }

          .left-side {
            width: 100%;
            order: 1;
          }

          .league-head {
            padding-bottom: 16px;
          }

          .sub-head {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
