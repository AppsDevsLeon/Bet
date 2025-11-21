"use client";

import React, { useState } from "react";
import Link from "next/link";
import type {
  MarketCard as MarketCardType,
  OutcomeOption,
} from "@/public/data/marketsData";
import { computeMarketStatus } from "@/public/data/marketsData";

/* =========================
   Helpers visuales
========================= */

const BLUE = "#1E3C8E";

function getPriceColor(tone?: "green" | "red" | "neutral") {
  if (tone === "green") return "#a7f3d0";
  if (tone === "red") return "#fecdd3";
  return "#ffffff";
}

/** Badge SOLO upcoming/live (compacto para el footer) */
function StatusBadgeUL({
  status,
  size = "sm",
}: {
  status: "upcoming" | "live" | "ended" | "resolved";
  size?: "sm" | "md";
}) {
  if (status !== "upcoming") return null; // 👈 sólo upcoming
  const s = { bg: "#fef3c7", color: "#92400e", text: "UPCOMING" } as const;
  const pad = size === "sm" ? "2px 8px" : "4px 10px";
  const font = size === "sm" ? 11 : 12;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: pad,
        borderRadius: 999,
        fontSize: font,
        fontWeight: 800,
        letterSpacing: 0.4,
        background: s.bg,
        color: s.color,
        whiteSpace: "nowrap",
      }}
    >
      {s.text}
    </span>
  );
}

/* =========================
   Rows outcomes
========================= */

function StaticPill({ kind }: { kind: "yes" | "no" }) {
  const base: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: 1,
    borderWidth: "1px",
    borderStyle: "solid",
    padding: "2px 8px",
    display: "inline-block",
    borderRadius: "999px",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
  };
  if (kind === "yes") {
    return (
      <span
        style={{
          ...base,
          color: "#065f46",
          backgroundColor: "#ecfdf5",
          borderColor: "#a7f3d0",
        }}
      >
        Yes
      </span>
    );
  }
  return (
    <span
      style={{
        ...base,
        color: "#be123c",
        backgroundColor: "#fff1f2",
        borderColor: "#fecdd3",
      }}
    >
      No
    </span>
  );
}

function OutcomeRowYesNo({
  opt,
  onClick,
}: {
  opt: OutcomeOption;
  onClick: () => void;
}) {
  const isYes = opt.label.trim().toLowerCase() === "yes";
  const isNo = opt.label.trim().toLowerCase() === "no";
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        backgroundColor: "transparent",
        border: "0",
        textAlign: "left",
        cursor: "pointer",
        padding: "10px 0",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 14,
          lineHeight: "1.4",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {isYes && <StaticPill kind="yes" />}
        {isNo && <StaticPill kind="no" />}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {opt.price && (
          <div
            style={{
              fontSize: 14,
              lineHeight: 1,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              color: "#0f172a",
            }}
          >
            {opt.price}
          </div>
        )}
      </div>
    </button>
  );
}

function HoverPill({
  kind,
  correct,
  incorrect,
}: {
  kind: "yes" | "no";
  correct?: string;
  incorrect?: string;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: 1,
    borderWidth: "1px",
    borderStyle: "solid",
    padding: "6px 10px",
    minWidth: "44px",
    textAlign: "center",
    borderRadius: "999px",
    cursor: "pointer",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
  };
  if (kind === "yes") {
    return (
      <span
        style={{
          ...base,
          color: "#065f46",
          backgroundColor: "#ecfdf5",
          borderColor: "#a7f3d0",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title="Buy Yes"
      >
        {hover && correct ? correct : "Yes"}
      </span>
    );
  }
  return (
    <span
      style={{
        ...base,
        color: "#be123c",
        backgroundColor: "#fff1f2",
        borderColor: "#fecdd3",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="Buy No"
    >
      {hover && incorrect ? incorrect : "No"}
    </span>
  );
}

function OutcomeRowMulti({
  opt,
  onClick,
}: {
  opt: OutcomeOption;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        backgroundColor: "transparent",
        border: "0",
        textAlign: "left",
        cursor: "pointer",
        padding: "10px 0",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "nowrap",
        }}
      >
        <div
          style={{
            flex: "1 1 auto",
            minWidth: 0,
            fontSize: 14,
            lineHeight: "1.4",
            color: "#1e293b",
            fontWeight: 600,
            wordBreak: "break-word",
          }}
        >
          {opt.label}
        </div>
        <div
          style={{
            flexShrink: 0,
            minWidth: 36,
            textAlign: "right",
            fontSize: 14,
            lineHeight: 1,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            color: "#0f172a",
          }}
        >
          {opt.price || "--"}
        </div>
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <HoverPill kind="yes" correct={opt.probCorrect} incorrect={opt.probIncorrect} />
          <HoverPill kind="no"  correct={opt.probCorrect} incorrect={opt.probIncorrect} />
        </div>
      </div>
    </button>
  );
}

/* =========================
   Probability bar
========================= */

function getProbabilityNumber(probLabel?: string): number | null {
  if (!probLabel) return null;
  const firstPart = probLabel.split(" ")[0];
  if (!firstPart) return null;
  if (firstPart.startsWith("<")) return 1;
  const numStr = firstPart.replace("%", "");
  const numVal = Number(numStr);
  if (isNaN(numVal)) return null;
  return Math.max(0, Math.min(100, numVal));
}

function ProbabilityBlock({
  probLabel,
  theme = "light",
}: {
  probLabel?: string;
  theme?: "light" | "onBlue";
}) {
  const pct = getProbabilityNumber(probLabel);
  if (!probLabel || pct === null) return null;
  const percentText = probLabel.split(" ")[0];
  const restText = probLabel.replace(/^\S+\s*/, "");
  const isBlue = theme === "onBlue";
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", marginTop: 8, marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", lineHeight: 1.2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: isBlue ? "#ffffff" : "#0f172a", letterSpacing: 0.2 }}>
          {percentText}
        </div>
        <div style={{ fontSize: 11, color: isBlue ? "rgba(255,255,255,0.8)" : "#64748b", fontWeight: 500 }}>
          {restText || "chance"}
        </div>
      </div>
      <div style={{ marginTop: 6, width: "100%", height: 6, backgroundColor: isBlue ? "rgba(255,255,255,0.2)" : "#e2e8f0", overflow: "hidden", borderRadius: 999 }}>
        <div style={{ width: `${pct}%`, height: "100%", backgroundColor: isBlue ? "#ffffff" : BLUE, transition: "width 0.18s linear" }} />
      </div>
    </div>
  );
}

/* =========================
   Outcomes container
========================= */

function OutcomesSection({
  market,
  onSelectOutcome,
}: {
  market: MarketCardType;
  onSelectOutcome: (m: MarketCardType, o: OutcomeOption) => void;
}) {
  const isYesNo = market.marketType === "yesno";
  const containerStyle: React.CSSProperties = {
    borderTop: "1px solid #e2e8f0",
    maxHeight: isYesNo ? "unset" : "220px",
    overflowY: isYesNo ? "visible" : "auto",
    paddingRight: isYesNo ? undefined : "10px",
  };
  const containerClass = isYesNo ? undefined : "outcomes-scrollarea";

  return (
    <div style={containerStyle} className={containerClass}>
      {market.outcomes.map((opt, idx) => (
        <div key={idx} style={{ borderBottom: idx === market.outcomes.length - 1 ? "0" : "1px solid #e2e8f0" }}>
          {isYesNo ? (
            <OutcomeRowYesNo opt={opt} onClick={() => onSelectOutcome(market, opt)} />
          ) : (
            <OutcomeRowMulti opt={opt} onClick={() => onSelectOutcome(market, opt)} />
          )}
        </div>
      ))}
    </div>
  );
}

/* =========================
   CARD
========================= */

export default function MarketCardSimple({
  market,
  onSelectOutcome,
}: {
  market?: MarketCardType;
  onSelectOutcome: (m: MarketCardType, o: OutcomeOption) => void;
}) {
  if (!market) {
    return (
      <div
        style={{
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          padding: 12,
          fontSize: 13,
          color: "#64748b",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
        }}
      >
        (no market data)
      </div>
    );
  }

  const status = computeMarketStatus(market); // upcoming | live | ended | resolved
  const isLive = status === "live";

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
        lineHeight: 1.4,
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(30,60,142,0.25)",
      }}
    >
      {/* HEADER AZUL */}
      <div
        style={{
          background: BLUE,
          color: "#ffffff",
          padding: "14px 16px 10px 16px",
          position: "relative",
        }}
      >
        {/* NOTA: icono REMOVIDO temporalmente */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {/* TITULOS: ahora clickeable al detalle */}
          <div style={{ minWidth: 0, flex: "1 1 auto" }}>
            <div title={market.title}>
              <Link
                href={`/market/${market.id}`}
                aria-label={`Open market: ${market.title}`}
                style={{
                  display: "inline-block",
                  fontSize: 15,
                  fontWeight: 800,
                  lineHeight: 1.25,
                  color: "#ffffff",
                  letterSpacing: "0.1px",
                  textDecoration: "none",
                  textShadow: "0 1px 0 rgba(0,0,0,0.08)",
                  wordBreak: "break-word",
                }}
              >
                {market.title}
              </Link>
            </div>

            {market.subtitle ? (
              <div
                style={{
                  fontSize: 12,
                  lineHeight: 1.25,
                  color: "rgba(255,255,255,0.85)",
                  marginTop: 2,
                  fontWeight: 500,
                }}
              >
                {market.subtitle}
              </div>
            ) : null}
          </div>

          {market.spot && (
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: getPriceColor(market.spotTone || "neutral"),
                fontVariantNumeric: "tabular-nums",
                textAlign: "right",
                flexShrink: 0,
                marginLeft: 8,
              }}
              title="Spot / last"
            >
              {market.spot}
            </div>
          )}
        </div>

        <ProbabilityBlock probLabel={market.probabilityLabel} theme="onBlue" />
      </div>

      {/* BODY */}
      <div style={{ padding: "12px 16px" }}>
        <OutcomesSection market={market} onSelectOutcome={onSelectOutcome} />
      </div>

      {/* FOOTER */}
      {(market.volume || isLive) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "10px 16px",
            borderTop: "1px solid #e2e8f0",
            background: "#fafafa",
            fontSize: 12,
            color: "#475569",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <StatusBadgeUL status={status} size="sm" />
            {market.volume && (
              <span
                title="Total Volume"
                style={{
                  color: "#0f172a",
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {market.volume}
              </span>
            )}
            {isLive && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#e11d48",
                  fontWeight: 800,
                }}
                title="Market is live"
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 9999,
                    backgroundColor: "#e11d48",
                    boxShadow: "0 0 0 4px rgba(225,29,72,0.15)",
                  }}
                />
                LIVE
              </span>
            )}
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              fontSize: 16,
            }}
          >
            <Link href="/promotions" title="Promotions / Bonuses">
              🎁
            </Link>
          </div>
        </div>
      )}

      {/* Scrollbar custom */}
      <style jsx global>{`
        .outcomes-scrollarea {
          scrollbar-width: thin;
          scrollbar-color: ${BLUE} #e5e7eb;
        }
        .outcomes-scrollarea::-webkit-scrollbar {
          width: 8px;
        }
        .outcomes-scrollarea::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 999px;
        }
        .outcomes-scrollarea::-webkit-scrollbar-thumb {
          background: ${BLUE};
          border-radius: 999px;
          border: 2px solid #f1f5f9;
        }
      `}</style>
    </div>
  );
}
