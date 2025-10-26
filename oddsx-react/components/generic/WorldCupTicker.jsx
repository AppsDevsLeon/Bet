"use client";

import Link from "next/link";
import React, { useMemo } from "react";

/**
 * Un ticker horizontal simple con banderas (emoji) y partidos próximos.
 * - speed: 1..10 (más alto = más lento en esta implementación)
 */
export default function WorldCupTicker({ speed = 5 }) {
  // Datos de ejemplo: rumbo a Mundial 2026 (puedes reemplazar por tu feed real)
  const items = useMemo(
    () => [
      { home: "🇲🇽", homeName: "México", away: "🇺🇸", awayName: "USA", date: "12 Oct", time: "19:30", comp: "WC Qual." },
      { home: "🇦🇷", homeName: "Argentina", away: "🇺🇾", awayName: "Uruguay", date: "13 Oct", time: "20:10", comp: "WC Qual." },
      { home: "🇧🇷", homeName: "Brasil", away: "🇨🇴", awayName: "Colombia", date: "14 Oct", time: "18:45", comp: "WC Qual." },
      { home: "🇪🇸", homeName: "España", away: "🇫🇷", awayName: "Francia", date: "15 Oct", time: "21:00", comp: "Amistoso" },
      { home: "🇩🇪", homeName: "Alemania", away: "🇮🇹", awayName: "Italia", date: "16 Oct", time: "20:30", comp: "Amistoso" },
      { home: "🇬🇧", homeName: "Inglaterra", away: "🇵🇹", awayName: "Portugal", date: "17 Oct", time: "19:45", comp: "Amistoso" },
    ],
    []
  );

  // duración de la animación (más grande => más lento)
  const durationSec = 25 + (speed - 5) * 5; // speed=5 => 25s; speed=10 => 50s; speed=1 => 5s aprox.

  return (
    <>
      <div className="wc-ticker-wrap">
        <div className="wc-ticker" style={{ animationDuration: `${durationSec}s` }}>
          {[...items, ...items].map((it, idx) => (
            <div className="wc-item" key={idx}>
              <span className="flag">{it.home}</span>
              <span className="name">{it.homeName}</span>
              <span className="vs">vs</span>
              <span className="flag">{it.away}</span>
              <span className="name">{it.awayName}</span>
              <span className="meta">{it.date} • {it.time} • {it.comp}</span>
              <Link className="mini-bet" href={`/apuestas?match=${encodeURIComponent(it.homeName + "-" + it.awayName)}`}>
                Bet
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .wc-ticker-wrap {
          position: relative;
          overflow: hidden;
          background: rgba(9, 13, 24, 0.8);
          border: 1px solid rgba(147,189,255,0.25);
          border-radius: 14px;
          padding: 8px 0;
        }
        .wc-ticker {
          display: inline-flex;
          align-items: center;
          gap: 22px;
          white-space: nowrap;
          animation-name: wcScroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .wc-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 4px 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(147,189,255,0.18);
          border-radius: 999px;
        }
        .flag { font-size: 18px; line-height: 1; }
        .name { color: #e6efff; font-weight: 600; font-size: 14px; }
        .vs { color: #8fb1ff; opacity: .85; font-size: 12px; }
        .meta { color: #a7c2ff; font-size: 12px; opacity: .9; margin-left: 6px; }
        .mini-bet {
          margin-left: 10px;
          padding: 4px 10px;
          border-radius: 999px;
          background: #16a34a;
          color: #fff;
          font-weight: 700;
          font-size: 12px;
          border: 1px solid rgba(255,255,255,.18);
        }

        @keyframes wcScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
