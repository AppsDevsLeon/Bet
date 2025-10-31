"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import html2canvas from "html2canvas";

import Soccer1 from "@/components/sports/Soccer1";
import Soccer2 from "@/components/sports/Soccer2";
import Basket from "@/components/sports/Basket";

/* ======================
   CONFIG
====================== */

const HEADER_SELECTORS = [".topbar-blue", ".header-section2 .navbar"];

const CARD_SKINS = [
  "https://i.imgur.com/DWWvCQJ.png",
  "https://i.imgur.com/S29qIGf.png",
  "https://i.imgur.com/BtUs9Ok.png",
  "https://i.imgur.com/k1UbFnO.png",
  "https://i.imgur.com/tUk5SC0.png",
];

const PLAYER_MEDIA_MAP = {
  soccer1: Soccer1,
  soccer2: Soccer2,
  basket: Basket,
  gm:'https://i.imgur.com/sdds9F1.png'
};

const MATCH_DATA = {
  phase: "MUNDIAL · MERCADO OFICIAL",
  homeTeam: "Argentina",
  awayTeam: "Brasil",
  dateLabel: "12 Jun 2026 · 18:00",
  venue: "Estadio Azteca",
  markets: [
    "Ganador 90’",
    "Más de 2.5 goles",
    "Ambos anotan",
    "Hándicap asiático",
  ],
  mediaType: "soccer1",
  badgeCountryLeft:
    "https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg",
  badgeCountryRight:
    "https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg",
  badgeClub:
    "https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg",
};

/* ======================
   CARTA
====================== */
function FifaCardWorldCup({ matchData, skinIndex = 0 }) {
  const cardRef = useRef(null);
  const shineRef = useRef(null);
  const boundsRef = useRef(null);

  const skin = CARD_SKINS[skinIndex % CARD_SKINS.length];
  const MediaComp =
    PLAYER_MEDIA_MAP[matchData.mediaType] || PLAYER_MEDIA_MAP["soccer1"];

  const rotateToMouse = useCallback((e) => {
    const cardEl = cardRef.current;
    if (!cardEl || !boundsRef.current) return;
    const bounds = boundsRef.current;

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2,
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

    cardEl.style.transform = `
      scale3d(1.07,1.07,1.07)
      rotate3d(
        ${center.y / 100},
        ${-center.x / 100},
        0,
        ${Math.log(distance) * 2}deg
      )
    `;
  }, []);

  useEffect(() => {
    const cardEl = cardRef.current;
    const shineEl = shineRef.current;
    if (!cardEl || !shineEl) return;

    const handleEnter = () => {
      boundsRef.current = cardEl.getBoundingClientRect();
      shineEl.style.backgroundSize = "100%";
      document.addEventListener("mousemove", rotateToMouse);
    };

    const handleLeave = () => {
      shineEl.style.backgroundSize = "0%";
      document.removeEventListener("mousemove", rotateToMouse);
      cardEl.style.transform = "";
      cardEl.style.backgroundColor = "";
    };

    cardEl.addEventListener("mouseenter", handleEnter);
    cardEl.addEventListener("mouseleave", handleLeave);

    return () => {
      cardEl.removeEventListener("mouseenter", handleEnter);
      cardEl.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mousemove", rotateToMouse);
    };
  }, [rotateToMouse]);

  const handleGenerate = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    });
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "worldcup-card.png";
    link.click();
  };

  return (
    <div className="fifa-card-wrapper">
      <div className="fifa-card" ref={cardRef}>
        {/* fondo / skin */}
        <div
          className="bg"
          style={{
            backgroundImage: `url(${skin})`,
          }}
        />
        {/* brillo */}
        <div className="shine" ref={shineRef} />

        {/* barra lateral (banderas / LIVE) */}
        <div className="status">
          <div className="status-top">
            <div
              className="flag"
              style={{
                backgroundImage: `url(${matchData.badgeCountryLeft})`,
              }}
            />
            <div className="vs-box">VS</div>
            <div
              className="flag"
              style={{
                backgroundImage: `url(${matchData.badgeCountryRight})`,
              }}
            />
          </div>

          <div className="live-chip">LIVE</div>

          <div
            className="teamLogo"
            style={{
              backgroundImage: `url(${matchData.badgeClub})`,
            }}
          />
        </div>

        {/* jugador / animación */}
        <div className="player-media">
          <MediaComp />
        </div>

        {/* detalles inferiores dentro de la carta */}
        <div className="details">
          <h2 className="match-name">
            <span className="underline">
              {matchData.homeTeam} vs {matchData.awayTeam}
            </span>
          </h2>

          <div className="match-meta">
            <div>{matchData.dateLabel}</div>
            <div>{matchData.venue}</div>
          </div>

          <div className="bet-tags">
            {matchData.markets.map((m, i) => (
              <span className="tag" key={i}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>



      <style jsx>{`
        .fifa-card-wrapper {
          color: #0b1020;
          font-family: "Heebo", sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          user-select: none;
          max-width: 360px;
        }

        .fifa-card {
          width: 350px;
          height: 500px;
          background: #0f1117;
          position: relative;
          transition-duration: 300ms;
          transition-property: transform;
          transition-timing-function: ease-out;
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          color: #fff;
        }

        .bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          z-index: 1;
        }

        .shine {
          width: 290px;
          height: 470px;
          border-radius: 50%;
          top: 0;
          left: 35px;
          background-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/13471/sparkles.gif");
          background-position: center;
          background-repeat: no-repeat;
          background-size: 0%;
          mix-blend-mode: color-dodge;
          opacity: 1;
          z-index: 2;
          position: absolute;
          pointer-events: none;
        }

        .status {
          position: absolute;
          top: 40px;
          left: 20px;
          width: 90px;
          background: radial-gradient(
            ellipse at top,
            rgba(11, 16, 32, 0.9) 0%,
            rgba(11, 16, 32, 0.2) 70%
          );
          border-radius: 16px;
          padding: 12px 10px;
          z-index: 4;
          color: #fff;
          text-shadow: 0 2px 3px #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .status-top {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
        }

        .flag {
          width: 24px;
          height: 16px;
          background-size: cover;
          background-position: center;
          border-radius: 2px;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
        }

        .vs-box {
          background: #e8d074;
          color: #1a1a1a;
          font-size: 0.6rem;
          font-weight: 800;
          line-height: 1;
          padding: 2px 6px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
        }

        .live-chip {
          font-size: 0.6rem;
          font-weight: 700;
          background: #d73737;
          color: #fff;
          padding: 2px 8px;
          border-radius: 999px;
          line-height: 1.2;
          box-shadow: 0 2px 6px rgba(215, 55, 55, 0.6);
          letter-spacing: 0.03em;
        }

        .teamLogo {
          width: 36px;
          height: 36px;
          background-size: cover;
          background-position: center;
          filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.8));
        }

        .player-media {
          position: absolute;
          top: 40px;
          right: 20px;
          width: 220px;
          height: 200px;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.8));
          pointer-events: none;
        }

        .player-media :global(svg),
        .player-media :global(canvas),
        .player-media :global(img),
        .player-media :global(video) {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .details {
          position: absolute;
          bottom: 40px;
          left: 0;
          width: 100%;
          padding: 0 24px;
          z-index: 5;
          color: #fff;
          text-shadow: 2px 2px 2px black;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }

        .match-name {
          margin: 0;
          font-size: 1rem;
          line-height: 1.3;
          font-weight: 800;
          text-transform: uppercase;
        }

        .underline {
          border-bottom: 1px solid #24ccff;
        }

        .match-meta {
          font-size: 0.7rem;
          line-height: 1.3;
          color: #dcdcdc;
        }

        .bet-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
          max-width: 280px;
        }
        .tag {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 0.65rem;
          font-weight: 600;
          line-height: 1.2;
          white-space: nowrap;
          color: #fff;
        }

        .controls {
          margin-top: 12px;
        }

        .btnCard {
          background: linear-gradient(
            135deg,
            #cdaf4e,
            #e8d074 45%,
            #b68d2c 100%
          );
          color: #1a1a1a;
          border: 0;
          padding: 8px 14px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 0.75rem;
          line-height: 1.2;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(226, 200, 84, 0.35);
        }
      `}</style>
    </div>
  );
}

/* ======================
   HERO PÁGINA (BLANCO)
   + BLOQUE AZUL DEL MUNDIAL ABAJO
====================== */
export default function WorldCupLandingHome() {
  // calcular --header-h
  useEffect(() => {
    const docEl = document.documentElement;

    const calcHeaderHeight = () => {
      let total = 0;
      for (const sel of HEADER_SELECTORS) {
        const el = document.querySelector(sel);
        if (!el) continue;
        const cs = getComputedStyle(el);
        if (cs.position === "fixed" || cs.position === "sticky") {
          total += el.getBoundingClientRect().height || 0;
        }
      }
      const safeTop =
        parseFloat(getComputedStyle(docEl).getPropertyValue("--sat")) || 0;
      docEl.style.setProperty("--header-h", `${total + safeTop}px`);
    };

    const ro = new ResizeObserver(calcHeaderHeight);
    HEADER_SELECTORS.forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) ro.observe(el);
    });
    window.addEventListener("resize", calcHeaderHeight);
    setTimeout(calcHeaderHeight, 0);
    requestAnimationFrame(calcHeaderHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calcHeaderHeight);
    };
  }, []);

  return (
    <>
      {/* HERO PRINCIPAL */}
      <section className="hero-white">
        <div className="hero-inner">
          {/* texto izquierda */}
          <div className="left-col">
            <div className="phase-badge">{MATCH_DATA.phase}</div>

            <h1 className="big-title">
              APUESTA EN TIEMPO REAL CON TECNOLOGÍA BLOCKCHAIN
            </h1>

            

            <button className="cta-bet">ENTRAR AL MERCADO</button>
          </div>

          {/* carta derecha */}
          <div className="right-col">
            <FifaCardWorldCup matchData={MATCH_DATA} skinIndex={0} />
          </div>
        </div>
      </section>

      {/* BLOQUE AZUL WORLD CUP INFO */}
      <section className="worldcup-info">
       
      </section>

      <style jsx global>{`
        :root {
          --header-h: 140px;
          --sat: env(safe-area-inset-top, 0px);

          --txt-main: #0b1020;
          --txt-dim: #555;
          --accent-gold-start: #cdaf4e;
          --accent-gold-mid: #e8d074;
          --accent-gold-end: #b68d2c;

          --brand-blue: #1a1fdd; /* violeta/azul brillante tipo tu screenshot */
          --brand-blue-light: #4a4fff;
          --bg-blue-fade: radial-gradient(
              circle at 50% 0%,
              rgba(255, 255, 255, 0.15) 0%,
              rgba(0, 0, 0, 0) 70%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #eef0ff 40%,
              #dfe2ff 100%
            );
        }

        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          font-family: "Heebo", system-ui, sans-serif;
          background: #ffffff;
          color: var(--txt-main);
          overflow-x: hidden;
        }

        /* HERO BLANCO */
        .hero-white {
          margin-top: var(--header-h);
          /* altura tipo hero, pero que no se quede enano en pantallas bajitas */
          min-height: calc(100vh - var(--header-h));
          width: 100vw;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(16px, 3vw, 48px) 16px;
          box-sizing: border-box;
        }

        /* Contenido centrado con max-width para que no se pegue a bordes */
        .hero-inner {
          width: 100%;
          max-width: 1300px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 420px);
          gap: clamp(24px, 3vw, 48px);
          align-items: start;
        }

        .left-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
          color: var(--txt-main);
          max-width: 780px;
        }

        .phase-badge {
           margin-top:5vh;
          display: inline-block;
          background: #0b1020;
          color: #fff;
          font-size: 0.7rem;
          line-height: 1.2;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-radius: 999px;
          padding: 6px 12px;
          width: fit-content;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .big-title {
          margin-top: 25vh;
          font-weight: 800;
          text-transform: uppercase;
          line-height: 1.05;
          letter-spacing: 0.02em;
          color: var(--txt-main);
          font-size: clamp(28px, 2.5vw, 60px); /* un poco más compacto */
          max-width: 30ch;
        }

        .pitch {
          font-size: clamp(0.95rem, 0.9vw, 1.05rem);
          line-height: 1.5;
          font-weight: 400;
          color: var(--txt-dim);
          max-width: 60ch;
        }

        .cta-bet {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          line-height: 1.2;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          padding: 14px 20px;
          border-radius: 999px;
          border: 0;
          cursor: pointer;
          background: linear-gradient(
            135deg,
            var(--accent-gold-start),
            var(--accent-gold-mid) 45%,
            var(--accent-gold-end) 100%
          );
          color: #1a1a1a;
          box-shadow: 0 8px 24px rgba(226, 200, 84, 0.35);
          width: fit-content;
        }

        .right-col {
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        /* BLOQUE AZUL */
        .worldcup-info {
          width: 100vw;
          background: var(--bg-blue-fade);
          text-align: center;
          padding: 40px 16px 48px;
          box-sizing: border-box;
        }

        .wc-inner {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          gap: 12px;
          place-items: center;
        }

        .wc-headline {
          margin: 0;
          font-size: clamp(20px, 2vw, 28px);
          line-height: 1.2;
          font-weight: 800;
          color: var(--brand-blue);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .wc-dates {
          margin: 0;
          font-size: clamp(18px, 1.8vw, 24px);
          line-height: 1.2;
          font-weight: 700;
          color: var(--brand-blue);
          letter-spacing: 0.04em;
        }

        .wc-sub {
          margin: 0;
          max-width: 70ch;
          font-size: 0.9rem;
          line-height: 1.4;
          font-weight: 500;
          color: var(--brand-blue);
        }

        /* RESPONSIVE STACK */
        @media (max-width: 900px) {
          .hero-inner {
            grid-template-columns: 1fr;
            grid-auto-rows: auto auto;
          }

          .left-col {
            order: 2;
            text-align: center;
            align-items: center;
          }

          .right-col {
            order: 1;
          }

          .cta-bet {
            align-self: center;
          }
        }
      `}</style>
    </>
  );
}
