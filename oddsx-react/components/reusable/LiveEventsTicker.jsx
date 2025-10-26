// src/components/reusable/LiveEventsTickerCompact.jsx
"use client";

import React, { useMemo } from "react";
import "flag-icon-css/css/flag-icons.min.css";

export default function LiveEventsTickerCompact({
  items = DEFAULT_ITEMS,
  speed = 200,        // muy lento (puedes bajar si lo quieres más rápido)
  fixedTop = false,
  showCenterBet = false, // ya no usamos botón global
  betHref = "/apuestas",
  betLabel = "bet",
  belowHeader = true,
  headerOffset = 88,
}) {
  const loop = useMemo(() => [...items, ...items], [items]);
  const offsetPx = typeof headerOffset === "number" ? `${headerOffset}px` : headerOffset;

  const wrapStyle = {
    position: fixedTop ? "fixed" : "relative",
    top: fixedTop ? offsetPx : 0,
    left: 0,
    right: 0,
    zIndex: 50,
    marginTop: !fixedTop && belowHeader ? offsetPx : undefined,
  };

  return (
    <div className="ltc-wrap" style={wrapStyle}>
      {/* ya no renderizamos CTA central */}

      <div className="ltc-bar">
        <div className="ltc-track" style={{ ["--d"]: `${speed}s` }}>
          {loop.map((ev, i) => (
            <Card key={i} ev={ev} betHref={betHref} betLabel={betLabel} />
          ))}
        </div>
      </div>

      <style>{CSS}</style>
    </div>
  );
}

function Card({ ev, betHref, betLabel }) {
  return (
    <div className="ltc-item" tabIndex={0}>
      {/* Fila superior */}
      <div className="ltc-top">
        <div className="ltc-hour">{ev.hour}</div>
        <div className="ltc-meta">
          <div className="ltc-dow">{ev.dow}</div>
          <div className="ltc-date">{ev.date}</div>
        </div>
        <div className="ltc-stage">
          <div>{ev.stageTop}</div>
          <div className="sub">{ev.stageBottom}</div>
        </div>
      </div>

      <div className="ltc-sep" />

      {/* Fila inferior */}
      <div className="ltc-bottom">
        <div className="team l">
          <span className="name">{ev.leftTeam.name}</span>
          <i className={`flag-icon ${ev.leftTeam.flagClass}`} />
        </div>

        <div className="score">
          <span className="box">{ev.leftTeam.score}</span>
          <span className="dots">:</span>
          <span className="box">{ev.rightTeam.score}</span>
        </div>

        <div className="team r">
          <i className={`flag-icon ${ev.rightTeam.flagClass}`} />
          <span className="name">{ev.rightTeam.name}</span>
        </div>
      </div>

      {/* Overlay CTA: aparece SOLO en hover/focus */}
      <a
        className="ltc-hover-cta"
        href={`${betHref}?match=${encodeURIComponent(ev.leftTeam.name + "-" + ev.rightTeam.name)}`}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Apostar ${ev.leftTeam.name} vs ${ev.rightTeam.name}`}
      >
        {betLabel}
      </a>
    </div>
  );
}

/* ==== 20 PARTIDOS FIFA ==== */
const DEFAULT_ITEMS = [
  { hour: "18:00", dow: "VIERNES", date: "12 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "MÉXICO", flagClass: "flag-icon-mx", score: 0 },
    rightTeam:{ name: "EE.UU.", flagClass: "flag-icon-us", score: 0 } },
  { hour: "20:30", dow: "VIERNES", date: "12 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "ARGENTINA", flagClass: "flag-icon-ar", score: 0 },
    rightTeam:{ name: "CHILE", flagClass: "flag-icon-cl", score: 0 } },
  { hour: "19:45", dow: "SÁBADO", date: "13 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "BRASIL", flagClass: "flag-icon-br", score: 0 },
    rightTeam:{ name: "COLOMBIA", flagClass: "flag-icon-co", score: 0 } },
  { hour: "21:00", dow: "SÁBADO", date: "13 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "URUGUAY", flagClass: "flag-icon-uy", score: 0 },
    rightTeam:{ name: "PARAGUAY", flagClass: "flag-icon-py", score: 0 } },
  { hour: "17:30", dow: "DOMINGO", date: "14 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "ESPAÑA", flagClass: "flag-icon-es", score: 0 },
    rightTeam:{ name: "SUECIA", flagClass: "flag-icon-se", score: 0 } },
  { hour: "20:00", dow: "DOMINGO", date: "14 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "FRANCIA", flagClass: "flag-icon-fr", score: 0 },
    rightTeam:{ name: "PAÍSES BAJOS", flagClass: "flag-icon-nl", score: 0 } },
  { hour: "18:15", dow: "MARTES", date: "16 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "INGLATERRA", flagClass: "flag-icon-gb", score: 0 },
    rightTeam:{ name: "ITALIA", flagClass: "flag-icon-it", score: 0 } },
  { hour: "19:00", dow: "MARTES", date: "16 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "PORTUGAL", flagClass: "flag-icon-pt", score: 0 },
    rightTeam:{ name: "ALEMANIA", flagClass: "flag-icon-de", score: 0 } },
  { hour: "16:40", dow: "MIÉRCOLES", date: "17 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "BÉLGICA", flagClass: "flag-icon-be", score: 0 },
    rightTeam:{ name: "CROACIA", flagClass: "flag-icon-hr", score: 0 } },
  { hour: "21:10", dow: "MIÉRCOLES", date: "17 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "SUIZA", flagClass: "flag-icon-ch", score: 0 },
    rightTeam:{ name: "DINAMARCA", flagClass: "flag-icon-dk", score: 0 } },
  { hour: "18:00", dow: "JUEVES", date: "18 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "POLONIA", flagClass: "flag-icon-pl", score: 0 },
    rightTeam:{ name: "REP. CHECA", flagClass: "flag-icon-cz", score: 0 } },
  { hour: "20:30", dow: "JUEVES", date: "18 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "TURQUÍA", flagClass: "flag-icon-tr", score: 0 },
    rightTeam:{ name: "GRECIA", flagClass: "flag-icon-gr", score: 0 } },
  { hour: "19:20", dow: "VIERNES", date: "19 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "NORUEGA", flagClass: "flag-icon-no", score: 0 },
    rightTeam:{ name: "ESCOCIA", flagClass: "flag-icon-gb", score: 0 } },
  { hour: "21:00", dow: "VIERNES", date: "19 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "AUSTRALIA", flagClass: "flag-icon-au", score: 0 },
    rightTeam:{ name: "JAPÓN", flagClass: "flag-icon-jp", score: 0 } },
  { hour: "13:30", dow: "SÁBADO", date: "20 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "COREA SUR", flagClass: "flag-icon-kr", score: 0 },
    rightTeam:{ name: "CHINA", flagClass: "flag-icon-cn", score: 0 } },
  { hour: "15:00", dow: "SÁBADO", date: "20 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "SENEGAL", flagClass: "flag-icon-sn", score: 0 },
    rightTeam:{ name: "MARRUECOS", flagClass: "flag-icon-ma", score: 0 } },
  { hour: "17:15", dow: "DOMINGO", date: "21 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "NIGERIA", flagClass: "flag-icon-ng", score: 0 },
    rightTeam:{ name: "GHANA", flagClass: "flag-icon-gh", score: 0 } },
  { hour: "19:45", dow: "DOMINGO", date: "21 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "IRÁN", flagClass: "flag-icon-ir", score: 0 },
    rightTeam:{ name: "IRAQ", flagClass: "flag-icon-iq", score: 0 } },
  { hour: "20:00", dow: "MARTES", date: "23 SEP 2025", stageTop: "CLASIFICATORIA", stageBottom: "FIFA MUNDIAL",
    leftTeam: { name: "RUSIA", flagClass: "flag-icon-ru", score: 0 },
    rightTeam:{ name: "UCRANIA", flagClass: "flag-icon-ua", score: 0 } },
  { hour: "21:10", dow: "MARTES", date: "23 SEP 2025", stageTop: "AMISTOSO", stageBottom: "INTERNACIONAL FIFA",
    leftTeam: { name: "ESLOVENIA", flagClass: "flag-icon-si", score: 0 },
    rightTeam:{ name: "CROACIA", flagClass: "flag-icon-hr", score: 0 } },
];

/* ===== CSS ===== */
const CSS = `
:root {
  --toneA: #0b2f53;
  --toneB: #0f446f;
  --sep: rgba(255,255,255,.25);
  --ink: #eaf2ff;
  --muted: #9fc3e6;
  --white: #fff;

  --ctaSquare: #16a34a;
}

.ltc-wrap { position: relative; }
.ltc-bar { background: #08233f; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,.08); }

.ltc-track {
  display: inline-flex;
  animation: slide var(--d,200s) linear infinite;
  white-space: nowrap;
}
.ltc-bar:hover .ltc-track { animation-play-state: paused; }

@keyframes slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }

.ltc-item {
  position: relative;
  display: grid;
  grid-template-rows: 34px 1px 32px;
  width: 400px;
  color: var(--ink);
  text-transform: uppercase;
  border-right: 1px solid var(--sep);
  outline: none;
}
.ltc-item:focus { box-shadow: inset 0 0 0 2px rgba(255,255,255,.15); }

/* Fila superior */
.ltc-top {
  background: var(--toneA);
  display: grid;
  grid-template-columns: 100px 1fr 100px;
  align-items: center;
  padding: 0 10px;
  font-size: 11px;
}
.ltc-hour { font-size: 20px; font-weight: 600; color: var(--white); }
.ltc-meta { text-align: center; line-height: 1.05; }
.ltc-dow { font-weight: 700; }
.ltc-date { color: var(--muted); }
.ltc-stage { text-align: right; }
.ltc-stage .sub { color: var(--muted); font-size: 10px; }

/* Franja divisoria */
.ltc-sep { background: var(--sep); height: 1px; }

/* Fila inferior */
.ltc-bottom {
  background: var(--toneB);
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  align-items: center;
  padding: 0 10px;
  height: 32px;
}
.team { display: flex; align-items: center; gap: 6px; }
.team .name { font-size: 11px; font-weight: 700; color: var(--white); }
.flag-icon { width: 16px; height: 11px; }
.score { display: flex; align-items: center; justify-content: center; gap: 6px; }
.score .box { background: transparent; color: var(--white); font-weight: 800; font-size: 14px; min-width: 14px; text-align: center; }
.score .dots { font-size: 14px; color: var(--white); }

/* === Overlay CTA que aparece SOLO en hover/focus-within === */
.ltc-hover-cta {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-decoration: none;
  pointer-events: none;     /* evita bloquear el swipe cuando está oculto */
  opacity: 0;
  transform: translateY(8px);
  transition: opacity .18s ease, transform .18s ease;
}
.ltc-hover-cta::before {
  content: attr(aria-label);
  pointer-events: auto;     /* el botón sí recibe click */
  padding: 10px 22px;
  border-radius: 0px;      /* cuadrado con esquinas suaves */
  background: var(--ctaSquare);
  color: #fff;
  font-weight: 800;
  letter-spacing: .2px;
  border: 1px solid rgba(255,255,255,.2);
  box-shadow: 0 10px 28px rgba(22,163,74,.35);
  margin-top:10px;
}

.ltc-item:hover .ltc-hover-cta,
.ltc-item:focus-within .ltc-hover-cta {
  opacity: 1;
  transform: translateY(0);
  pointer-events: none;     /* el fondo sigue sin bloquear; el ::before es clickeable */
}
`;
