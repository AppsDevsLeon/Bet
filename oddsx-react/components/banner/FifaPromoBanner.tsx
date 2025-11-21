"use client";

import React, { useEffect, useRef } from "react";

export default function HeroWorldCupBanner() {
  const ticketRef = useRef(null);
  const holoRef = useRef(null);

  // Tilt + holographic shift for the ticket
  useEffect(() => {
    const elNode = ticketRef.current;
    const glareNode = holoRef.current;
    if (!elNode || !glareNode) return;

    function handleMove(e) {
      const rect = elNode.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotY = (x / w) * 16 - 8;
      const rotX = -((y / h) * 16 - 8);

      elNode.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;

      const percent = (x / w) * 200;
      glareNode.style.backgroundPosition = percent + "%";
    }

    function handleLeave() {
      elNode.style.transform =
        "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
      glareNode.style.backgroundPosition = "0%";
    }

    elNode.addEventListener("mousemove", handleMove);
    elNode.addEventListener("mouseleave", handleLeave);
    return () => {
      elNode.removeEventListener("mousemove", handleMove);
      elNode.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <>
      <section className="hero-wrap">
        <div className="hero-shell">
          <div className="hero-inner">
            {/* ================= LEFT COPY ================= */}
            <div className="left-col">
              <div className="eyebrow">WORLD CUP 2026 • OFFICIAL ACCESS</div>

              <h1 className="headline">
                STEP INTO THE MATCH <span className="headline-accent">LIVE</span>
              </h1>

              <p className="subtext">
                Official FIFA WORLD CUP™ 26 tickets. Pick your venue, enjoy the VIP
                experience, and access the live odds lounge in real time.
              </p>

              <button className="cta-main">BUY TICKETS</button>

              <div className="dates">
                JUNE 11 — JULY 19, 2026 · KANSAS CITY · NORTH AMERICA
              </div>
            </div>

            {/* ================= RIGHT TICKET ================= */}
            <div className="right-col">
              <div className="ticket-stack">
                {/* interactive gold ticket */}
                <div className="ticket-container" ref={ticketRef}>
                  <div className="ticket-holo-bg" ref={holoRef}></div>

                  <div className="ticket-visual">
                    <div className="ticket-overlay">
                      {/* world cup logo (optional img here) */}

                      {/* black/gold badge */}
                      <div className="ticket-badge">★ FIFA WORLD CUP™ 26 ★</div>

                      {/* ACCESS PASS GOLD */}
                      <div className="ticket-pass-name" data-text="ACCESS PASS GOLD">
                        ACCESS PASS GOLD
                      </div>

                      <div className="ticket-line1">MATCH DAY ADMIT</div>

                      <div className="ticket-line2">
                        VIP LOUNGE · LIVE ODDS MARKET
                      </div>
                    </div>
                  </div>
                </div>

                {/* white box with details */}
                <div className="ticket-details">
                  <div className="detail">
                    <span className="label">EVENT:</span> FIFA WORLD CUP 26™
                  </div>
                  <div className="detail">
                    <span className="label">DATE:</span> JUN 11 — JUL 19 · 2026
                  </div>
                  <div className="detail">
                    <span className="label">VENUE:</span> KANSAS CITY · NORTH AMERICA
                  </div>
                  <div className="detail">
                    <span className="label">TIER:</span> GOLD INSIDER
                  </div>
                  <div className="detail">
                    <span className="label">PASS ID:</span> WC26-KC-0941-GOLD
                  </div>

                  <div className="deadline">⚠ PRESENT THIS PASS BEFORE KICKOFF</div>

                  {/* codes row */}
                  <div className="codes-row">
                    <div className="code-left">FIFA·WC26·KSCITY·GOLD</div>
                    <div className="code-right">WC2626KC26VIP</div>
                  </div>

                  {/* purchase / nft buttons */}
                  <div className="actions-row">
                    <button className="cta-gold">BUY TICKET</button>
                    <button className="cta-outline">TOKENIZE AS NFT</button>
                  </div>
                </div>
              </div>
            </div>
            {/* ================= /RIGHT ================= */}
          </div>
        </div>
      </section>

      <style jsx>{`
        /* ---------- HERO WRAP ---------- */
        .hero-wrap {
          width: 100%;
          background: #ffffff; /* solid white */
          padding: 24px 16px;
          margin-top: 72px; /* leave room under fixed header */
        }

        /* ---------- WHITE CARD SHELL ---------- */
        .hero-shell {
          max-width: 1300px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          padding: 32px 24px;
        }

        @media (min-width: 768px) {
          .hero-shell {
            padding: 40px 32px 48px;
          }
        }

        /* ---------- INNER GRID ---------- */
        .hero-inner {
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
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
            sans-serif;
          color: #0f172a; /* slate-900 */
        }

        .eyebrow {
          font-size: 11px;
          line-height: 1.2;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #475569; /* slate-600 */
          font-weight: 600;
          margin-bottom: 16px;
        }

        .headline {
          font-size: clamp(1.9rem, 1vw + 1.5rem, 2.5rem);
          font-weight: 700;
          line-height: 1.15;
          color: #0f172a; /* slate-900 */
          margin: 0 0 16px;
          max-width: 14ch;
          font-family: ui-sans-serif, system-ui, "Inter", -apple-system,
            BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        .headline-accent {
          color: #b5891a;
          background-image: linear-gradient(180deg, #e6c764 0%, #b48917 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
          white-space: nowrap;
        }

        .subtext {
          font-size: 15px;
          line-height: 1.5;
          color: #475569; /* slate-600 */
          margin-bottom: 24px;
          max-width: 45ch;
        }

        .cta-main {
          padding: 12px 20px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #1e1e1e;
          background: linear-gradient(180deg, #e6c764 0%, #b48917 100%);
          border: 1px solid rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.15s ease;
          margin-bottom: 20px;
        }

        .cta-main:hover {
          transform: translateY(-1px) scale(1.02);
        }

        .dates {
          font-size: 11px;
          line-height: 1.4;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #64748b; /* slate-500 */
          text-transform: uppercase;
        }

        /* ---------- RIGHT SIDE (TICKET + DETAILS) ---------- */
        .right-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: ui-sans-serif, system-ui, "Inter", -apple-system,
            BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: #0f172a;
        }

        .ticket-stack {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* gold ticket with tilt */
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
          border: 2px solid rgba(255, 215, 0, 0.5);
          animation: shimmer-react 3s ease-in-out infinite;
        }

        @keyframes shimmer-react {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.15);
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
          color: #1e1e2e;
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
          margin-bottom: 8px;
        }

        .ticket-badge {
          background: #111;
          background-image: linear-gradient(135deg, #000 0%, #2d2d2d 100%);
          color: #ffd700;
          padding: 6px 18px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border: 2px solid #ffd700;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.6),
            inset 0 1px 2px rgba(255, 215, 0, 0.3);
          margin-bottom: 12px;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.4),
            0 0 32px rgba(255, 215, 0, 0.2);
        }

        .ticket-pass-name {
          font-family: "Aboreto", system-ui;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 8px;
          background: linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 50%, #000 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          color: transparent;
          text-align: center;
          filter: drop-shadow(0 1px 0 rgba(255, 215, 0, 0.25));
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
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #2a2a3e;
          margin-bottom: 4px;
        }

        .ticket-line2 {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.5px;
          color: #3a3a4e;
        }

        /* ---------- DETAILS BOX UNDER TICKET ---------- */
        .ticket-details {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid rgba(15, 23, 42, 0.07);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.07),
            0 2px 4px rgba(15, 23, 42, 0.05);
          padding: 16px 16px 20px;
          color: #0f172a;
          font-family: "Share Tech Mono", ui-monospace, SFMono-Regular, Menlo,
            Consolas, Liberation Mono, monospace;
          font-size: 11px;
          line-height: 1.4em;
        }

        .detail {
          margin-bottom: 4px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #1e293b;
        }

        .label {
          color: #000;
        }

        .deadline {
          font-size: 11px;
          font-weight: 700;
          margin-top: 10px;
          line-height: 1.4em;
          letter-spacing: 0.4em;
          color: #b91c1c;
          text-transform: uppercase;
        }

        .codes-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 14px;
          background: #0f172a;
          border: 1px solid rgba(255, 215, 0, 0.4);
          border-radius: 8px;
          padding: 10px 12px;
          text-align: center;
          color: #ffd700;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.5),
            0 0 32px rgba(255, 215, 0, 0.25);
          font-family: "Share Tech Mono", ui-monospace, monospace;
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
          margin-top: 18px;
          font-family: ui-sans-serif, system-ui, "Inter", -apple-system,
            BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
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
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #1e1e1e;
          background: linear-gradient(180deg, #e6c764 0%, #b48917 100%);
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 18px 32px rgba(180, 137, 23, 0.28),
            0 3px 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: center;
        }

        .cta-gold:hover {
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 24px 44px rgba(180, 137, 23, 0.35),
            0 5px 6px rgba(0, 0, 0, 0.24);
        }

        .cta-outline {
          flex: 1;
          padding: 12px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #0f172a;
          background: #ffffff;
          border: 2px solid #b48917;
          box-shadow: 0 10px 18px rgba(15, 23, 42, 0.07),
            0 2px 4px rgba(15, 23, 42, 0.05);
          cursor: pointer;
          text-align: center;
          white-space: nowrap;
        }

        .cta-outline:hover {
          background: #fff7e0;
        }
      `}</style>
    </>
  );
}
