"use client";

import React, { useEffect, useRef } from "react";

export default function HeroWorldCupBanner() {
  const ticketRef = useRef<HTMLDivElement | null>(null);
  const holoRef = useRef<HTMLDivElement | null>(null);

  // tilt y holo shift del boleto
  useEffect(() => {
    const el = ticketRef.current;
    const glareEl = holoRef.current;
    if (!el || !glareEl) return;

    function handleMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotY = (x / w) * 16 - 8;
      const rotX = -((y / h) * 16 - 8);

      el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;

      const percent = (x / w) * 200;
      (glareEl as HTMLElement).style.backgroundPosition = percent + "%";
    }

    function handleLeave() {
      el.style.transform =
        "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
      (glareEl as HTMLElement).style.backgroundPosition = "0%";
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <>
      <section className="hero-wrap">
        <div className="hero-inner">
          {/* ================= LEFT COPY ================= */}
          <div className="left-col">
            <div className="eyebrow">
              COPA DEL MUNDO 2026 • ACCESO OFICIAL
            </div>

            <h1 className="headline">
              ENTRA AL PARTIDO{" "}
              <span className="headline-accent">EN VIVO</span>
            </h1>

            <p className="subtext">
              Boletos oficiales FIFA WORLD CUP™ 26.
              Selecciona tu sede, vive la experiencia VIP y
              accede al lounge de cuotas en tiempo real.
            </p>

            <button className="cta-main">COMPRAR BOLETOS</button>

            <div className="dates">
              JUNIO 11 — JULIO 19, 2026 · KANSAS CITY · NORTH AMERICA
            </div>
          </div>

          {/* ================= RIGHT TICKET ================= */}
          <div className="right-col">
            {/* boleto + detalles pegados */}
            <div className="ticket-stack">
              {/* boleto dorado */}
              <div className="ticket-container" ref={ticketRef}>
                <div
                  className="ticket-holo-bg"
                  ref={holoRef}
                ></div>

                <div className="ticket-visual">
                  <div className="ticket-overlay">
                    {/* logo mundial */}
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Football_%28soccer_ball%29.svg/240px-Football_%28soccer_ball%29.svg.png"
                      alt="World Cup Logo"
                      className="ticket-logo"
                    />

                    {/* badge negro/oro */}
                    <div className="ticket-badge">
                      ★ FIFA WORLD CUP™ 26 ★
                    </div>

                    {/* ACCESS PASS GOLD */}
                    <div
                      className="ticket-pass-name"
                      data-text="ACCESS PASS GOLD"
                    >
                      ACCESS PASS GOLD
                    </div>

                    <div className="ticket-line1">
                      MATCH DAY ADMIT
                    </div>

                    <div className="ticket-line2">
                      VIP LOUNGE · LIVE ODDS MARKET
                    </div>
                  </div>
                </div>
              </div>

              {/* caja blanca con detalles (debajo del boleto, no flotando encima) */}
              <div className="ticket-details">
                <div className="detail">
                  <span className="label">EVENTO:</span>{" "}
                  FIFA WORLD CUP 26™
                </div>
                <div className="detail">
                  <span className="label">FECHA:</span>{" "}
                  JUN 11 — JUL 19 · 2026
                </div>
                <div className="detail">
                  <span className="label">SEDE:</span>{" "}
                  KANSAS CITY · NORTH AMERICA
                </div>
                <div className="detail">
                  <span className="label">NIVEL:</span>{" "}
                  GOLD INSIDER
                </div>
                <div className="detail">
                  <span className="label">PASS ID:</span>{" "}
                  WC26-KC-0941-GOLD
                </div>

                <div className="deadline">
                  ⚠ PRESENTA ESTE PASE ANTES DEL KICKOFF
                </div>

                {/* fila códigos abajo */}
                <div className="codes-row">
                  <div className="code-left">
                    FIFA·WC26·KSCITY·GOLD
                  </div>
                  <div className="code-right">
                    WC2626KC26VIP
                  </div>
                </div>

                {/* botones compra / nft debajito del detalle */}
                <div className="actions-row">
                  <button className="cta-gold">
                    COMPRAR BOLETO
                  </button>
                  <button className="cta-outline">
                    TOKENIZAR COMO NFT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* ---------- HERO LAYER ---------- */
        .hero-wrap {
          width: 100%;
          background: radial-gradient(
              circle at 30% 30%,
              rgba(0, 255, 200, 0.08) 0%,
              rgba(0, 0, 0, 0) 60%
            ),
            radial-gradient(
              circle at 70% 60%,
              rgba(255, 200, 0, 0.08) 0%,
              rgba(0, 0, 0, 0) 60%
            ),
            linear-gradient(135deg, #0a0a1a 0%, #101835 50%, #0a0f2f 100%);
          color: #fff;
          font-family: "Georgia", serif;
          box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.8);
          padding: 40px 16px;
        }

        .hero-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          gap: 32px;
          grid-template-columns: 1fr minmax(320px, 420px);
          align-items: start;
        }

        @media (max-width: 900px) {
          .hero-inner {
            grid-template-columns: 1fr;
          }
        }

        /* ---------- LEFT TEXT ---------- */
        .left-col {
          max-width: 560px;
        }

        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          margin-bottom: 16px;
          text-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
        }

        .headline {
          font-size: clamp(2rem, 1vw + 1.5rem, 3rem);
          font-weight: 800;
          line-height: 1.1;
          color: #fff;
          text-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
          margin: 0 0 16px;
          max-width: 12ch;
        }

        .headline-accent {
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.6),
            0 0 40px rgba(255, 215, 0, 0.4);
          white-space: nowrap;
        }

        .subtext {
          font-size: 15px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.7);
          text-shadow: 0 10px 20px rgba(0, 0, 0, 0.8);
          margin-bottom: 24px;
          max-width: 40ch;
        }

        .cta-main {
          padding: 12px 24px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #000;
          background: linear-gradient(
            180deg,
            #e6c764 0%,
            #b48917 100%
          );
          border: 1px solid rgba(0, 0, 0, 0.4);
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.4);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6),
            0 5px 15px rgba(255, 215, 0, 0.25);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          margin-bottom: 24px;
        }

        .cta-main:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.8),
            0 8px 20px rgba(255, 215, 0, 0.3);
        }

        .dates {
          font-size: 12px;
          line-height: 1.4;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          text-shadow: 0 10px 20px rgba(0, 0, 0, 0.8);
        }

        /* ---------- RIGHT SIDE (TICKET + DETAILS) ---------- */
        .right-col {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ticket-stack {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* boleto */
        .ticket-container {
          position: relative;
          width: 100%;
          aspect-ratio: 2.5 / 1;
          transform-style: preserve-3d;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .ticket-holo-bg {
          position: absolute;
          inset: -10px;
          border-radius: 16px;
          background: linear-gradient(
            45deg,
            #ffd700,
            #ffed4e,
            #fff5b8,
            #ffe55d,
            #ffd700,
            #ffb700,
            #ffd700,
            #ffe87c
          );
          background-size: 300%;
          background-position: 0%;
          box-shadow: 0 0 60px rgba(255, 215, 0, 0.6),
            0 0 100px rgba(255, 215, 0, 0.4),
            0 20px 60px rgba(0, 0, 0, 0.6);
          animation: shimmer-react 3s ease-in-out infinite;
          border: 2px solid rgba(255, 215, 0, 0.5);
        }

        @keyframes shimmer-react {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.2);
          }
        }

        .ticket-visual {
          position: relative;
          width: 100%;
          height: 100%;
          background-image: url("https://studio-j.app/images/blank-ticket01.PNG");
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .ticket-overlay {
          position: relative;
          text-align: center;
          max-width: 80%;
          color: #1a1a2e;
          font-family: "Georgia", serif;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ticket-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
          opacity: 0.9;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
          margin-bottom: 8px;
        }

        .ticket-badge {
          background: linear-gradient(135deg, #000000 0%, #2d2d2d 100%);
          color: #ffd700;
          padding: 6px 18px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border: 2px solid #ffd700;
          box-shadow: inset 0 1px 2px rgba(255, 215, 0, 0.3),
            0 4px 12px rgba(0, 0, 0, 0.8);
          margin-bottom: 12px;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.5),
            0 0 32px rgba(255, 215, 0, 0.25);
        }

        .ticket-pass-name {
          font-family: "Aboreto", system-ui;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 8px;
          background: linear-gradient(
            180deg,
            #2a2a3e 0%,
            #1a1a2e 50%,
            #000 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 1px 0 rgba(255, 215, 0, 0.3));
          position: relative;
          color: transparent;
          text-align: center;
        }

        .ticket-pass-name::before {
          content: attr(data-text);
          position: absolute;
          top: -1px;
          left: -1px;
          z-index: -1;
          background: linear-gradient(
            180deg,
            rgba(255, 215, 0, 0.4),
            rgba(255, 215, 0, 0.2)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ticket-line1 {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #2a2a3e;
          margin-bottom: 4px;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.4);
        }

        .ticket-line2 {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: #3a3a4e;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.4);
        }

        /* caja blanca detalles del ticket */
        .ticket-details {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(4px);
          border-radius: 8px;
          border: 2px solid #ffd966;
          box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.2),
            0 20px 40px rgba(0, 0, 0, 0.4);
          padding: 16px;
          color: #1a1a2e;
          font-family: "Share Tech Mono", monospace;
          font-size: 11px;
          line-height: 1.4em;
        }

        .detail {
          margin-bottom: 4px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .label {
          color: #000;
        }

        .deadline {
          font-size: 11px;
          color: #d32f2f;
          font-weight: bold;
          margin-top: 8px;
          letter-spacing: 0.5em;
          line-height: 1.4em;
        }

        .codes-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 12px;
          background: rgba(0, 0, 0, 0.75);
          border: 1px solid rgba(255, 215, 0, 0.4);
          border-radius: 8px;
          padding: 8px 12px;
          text-align: center;
          color: #ffd700;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.5),
            0 0 32px rgba(255, 215, 0, 0.25);
          font-family: "Share Tech Mono", monospace;
        }

        .code-left {
          font-size: 10px;
          letter-spacing: 0.1em;
          font-weight: 600;
          text-transform: uppercase;
        }

        .code-right {
          font-family: "Libre Barcode 128 Text", cursive;
          font-size: 20px;
          line-height: 1;
          letter-spacing: 1px;
          color: #ffd700;
        }

        .actions-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
          font-family: "Georgia", serif;
        }

        @media (min-width: 480px) {
          .actions-row {
            flex-direction: row;
          }
        }

        .cta-gold {
          flex: 1;
          padding: 12px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #000;
          background: linear-gradient(
            180deg,
            #e6c764 0%,
            #b48917 100%
          );
          border: 1px solid rgba(0, 0, 0, 0.4);
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.4);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6),
            0 5px 15px rgba(255, 215, 0, 0.25);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .cta-gold:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.8),
            0 8px 20px rgba(255, 215, 0, 0.3);
        }

        .cta-outline {
          flex: 1;
          padding: 12px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #ffd700;
          background: rgba(0, 0, 0, 0.8);
          border: 2px solid #ffd700;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6),
            0 5px 15px rgba(255, 215, 0, 0.15);
          cursor: pointer;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.5),
            0 0 32px rgba(255, 215, 0, 0.25);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          white-space: nowrap;
        }

        .cta-outline:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.8),
            0 8px 20px rgba(255, 215, 0, 0.4);
        }
      `}</style>
    </>
  );
}
