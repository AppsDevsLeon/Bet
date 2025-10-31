"use client";

import React from "react";

/**
 * TIPOS
 */
type Team = {
  code: string;   // "NED"
  name: string;   // "Países Bajos"
};

type RoundOf16Match = {
  id: string;
  teamA: Team;
  teamB: Team;
};

const INITIAL_MATCHUPS: RoundOf16Match[] = [
  {
    id: "m1",
    teamA: { code: "NED", name: "Países Bajos" },
    teamB: { code: "USA", name: "Estados Unidos" },
  },
  {
    id: "m2",
    teamA: { code: "ARG", name: "Argentina" },
    teamB: { code: "AUS", name: "Australia" },
  },
  {
    id: "m3",
    teamA: { code: "JPN", name: "Japón" },
    teamB: { code: "CRO", name: "Croacia" },
  },
  {
    id: "m4",
    teamA: { code: "BRA", name: "Brasil" },
    teamB: { code: "KOR", name: "Corea del Sur" },
  },
  {
    id: "m5",
    teamA: { code: "ENG", name: "Inglaterra" },
    teamB: { code: "SEN", name: "Senegal" },
  },
  {
    id: "m6",
    teamA: { code: "FRA", name: "Francia" },
    teamB: { code: "POL", name: "Polonia" },
  },
  {
    id: "m7",
    teamA: { code: "MAR", name: "Marruecos" },
    teamB: { code: "ESP", name: "España" },
  },
  {
    id: "m8",
    teamA: { code: "POR", name: "Portugal" },
    teamB: { code: "SUI", name: "Suiza" },
  },
];

/**
 * Tarjeta de partido (2 equipos)
 */
function MatchCard({
  teamA,
  teamB,
  label,
  empty = false,
}: {
  teamA?: Team;
  teamB?: Team;
  label?: string;
  empty?: boolean;
}) {
  return (
    <div className={`match-card ${empty ? "empty-card" : ""}`}>
      {label && <div className="match-label">{label}</div>}

      <div className="team-row">
        <span className="team-code">{teamA ? teamA.code : "—"}</span>
        <span className="team-name">{teamA ? teamA.name : "—"}</span>
      </div>
      <div className="team-row">
        <span className="team-code">{teamB ? teamB.code : "—"}</span>
        <span className="team-name">{teamB ? teamB.name : "—"}</span>
      </div>
    </div>
  );
}

export default function WorldCupBracket() {
  // lado izquierdo octavos -> primeros 4
  const leftSide = INITIAL_MATCHUPS.slice(0, 4);
  // lado derecho octavos -> últimos 4
  const rightSide = INITIAL_MATCHUPS.slice(4, 8);

  return (
    <div className="bracket-wrapper">
      <h2 className="bracket-title">
        OCTAVOS DE FINAL <span className="bracket-sub">QATAR</span>
      </h2>

      <div className="bracket-grid">
        {/* ===== LADO IZQUIERDO OCTAVOS ===== */}
        <div className="round round-16">
          {leftSide.map((match, idx) => (
            <div className="round-slot" key={match.id}>
              <MatchCard
                teamA={match.teamA}
                teamB={match.teamB}
                label={`Octavos ${idx + 1}`}
              />
            </div>
          ))}
        </div>

        {/* ===== CUARTOS IZQ ===== */}
        <div className="round round-8">
          <div className="round-slot connector-up">
            <MatchCard label="Cuartos" empty />
          </div>
          <div className="round-slot connector-down">
            <MatchCard label="Cuartos" empty />
          </div>
        </div>

        {/* ===== SEMI IZQ ===== */}
        <div className="round round-4">
          <div className="round-slot connector-mid">
            <MatchCard label="Semifinal" empty />
          </div>
        </div>

        {/* ===== FINAL & TERCER LUGAR ===== */}
        <div className="round round-final">
          <div className="round-slot">
            <MatchCard label="Final" empty />
          </div>
          <div className="round-slot third-place">
            <MatchCard label="Tercer Lugar" empty />
          </div>
        </div>

        {/* ===== SEMI DER ===== */}
        <div className="round round-4">
          <div className="round-slot connector-mid">
            <MatchCard label="Semifinal" empty />
          </div>
        </div>

        {/* ===== CUARTOS DER ===== */}
        <div className="round round-8">
          <div className="round-slot connector-up">
            <MatchCard label="Cuartos" empty />
          </div>
          <div className="round-slot connector-down">
            <MatchCard label="Cuartos" empty />
          </div>
        </div>

        {/* ===== LADO DERECHO OCTAVOS ===== */}
        <div className="round round-16">
          {rightSide.map((match, idx) => (
            <div className="round-slot" key={match.id}>
              <MatchCard
                teamA={match.teamA}
                teamB={match.teamB}
                label={`Octavos ${idx + 5}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* estilos embebidos */}
      <style jsx>{`
        .bracket-wrapper {
          width: 100%;
          padding: 2rem 1rem 4rem;
          background: radial-gradient(
            circle at 20% 20%,
            #aa003c 0%,
            #7a0030 40%,
            #4a0020 80%
          );
          color: #fff;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Inter",
            Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bracket-title {
          text-align: center;
          font-size: clamp(1.2rem, 2vw, 1.5rem);
          font-weight: 700;
          line-height: 1.2;
          text-transform: uppercase;
          color: #ffffff;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .bracket-sub {
          display: block;
          font-size: 0.8em;
          font-weight: 600;
          color: #ffd75e;
        }

        /* ====== GRID DEL BRACKET ====== */

        .bracket-grid {
          width: 100%;
          max-width: 1200px;

          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1rem;

          overflow-x: auto;
          padding-bottom: 2rem;
        }

        .round {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .round-16 {
          gap: 2rem;
        }
        .round-8 {
          gap: 4rem;
        }
        .round-4 {
          gap: 8rem;
        }
        .round-final {
          justify-content: center;
          gap: 3rem;
        }

        /* ====== TARJETA DE PARTIDO ====== */

        .match-card {
          min-width: 170px;
          background: #ffffff10;
          border: 1px solid #ffffff33;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          box-shadow: 0 16px 32px rgb(0 0 0 / 0.4);
          backdrop-filter: blur(6px);
          position: relative;
        }

        .match-card.empty-card .team-row {
          opacity: 0.5;
        }

        .match-label {
          position: absolute;
          top: -0.75rem;
          left: 0.5rem;
          background: #ffd75e;
          color: #4a0020;
          font-size: 0.65rem;
          font-weight: 700;
          line-height: 1;
          padding: 0.3rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 10px rgb(0 0 0 / 0.5);
        }

        .team-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          background: rgba(0, 0, 0, 0.25);
          border-radius: 4px;
          padding: 0.5rem 0.6rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #fff;

          margin-top: 0.5rem;
        }

        .team-code {
          min-width: 2.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 4px;
          text-align: center;
          padding: 0.3rem 0.4rem;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .team-name {
          flex: 1;
          line-height: 1.2;
        }

        .third-place .match-label {
          background: #888;
          color: #fff;
        }

        /* ====== "LÍNEAS" CONECTORAS ====== */

        .round-slot {
          position: relative;
        }

        .connector-up::before,
        .connector-down::before {
          content: "";
          position: absolute;
          left: -1rem;
          width: 1rem;
          height: 2px;
          background: #fff5;
          top: 30%;
        }
        .connector-down::before {
          top: 70%;
        }

        .connector-mid::before {
          content: "";
          position: absolute;
          left: -1rem;
          width: 1rem;
          height: 2px;
          background: #fff5;
          top: 50%;
        }

        /* responsive */
        @media (max-width: 768px) {
          .match-card {
            min-width: 150px;
          }

          .team-row {
            font-size: 0.75rem;
          }

          .team-code {
            min-width: 2rem;
            font-size: 0.7rem;
          }

          .bracket-grid {
            grid-template-columns: repeat(7, minmax(160px, 1fr));
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
