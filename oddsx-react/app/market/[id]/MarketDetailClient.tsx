"use client";

import * as React from "react";
import type { MarketCard, OutcomeOption, PoolToken } from "@/public/data/marketsData";

function pctFromStr(s?: string): number {
  if (!s) return 0;
  const t = s.trim();
  if (t.startsWith("<")) return 1;
  const n = Number(t.replace("%", ""));
  return Number.isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
}

function findOutcome(outcomes: OutcomeOption[], label: "yes" | "no") {
  return outcomes.find((x) => x.label.trim().toLowerCase() === label);
}

const CARD: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 16,
  background: "#fff",
};

const HSTACK: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12 };
const VSTACK: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 8 };

function YesNoBar({ yesPct, noPct }: { yesPct: number; noPct: number }) {
  const total = Math.max(1, yesPct + noPct);
  const yesWidth = Math.round((yesPct / total) * 100);
  const noWidth = 100 - yesWidth;
  return (
    <div style={{ width: "100%", height: 20, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
      <div style={{ width: `${yesWidth}%`, height: "100%", background: "#10b981", float: "left" }} />
      <div style={{ width: `${noWidth}%`, height: "100%", background: "#ef4444", float: "left" }} />
    </div>
  );
}

function TokenRow({ token, totalYes = 0, totalNo = 0 }: { token: PoolToken; totalYes?: number; totalNo?: number }) {
  const total = totalYes + totalNo;
  return (
    <div style={{ ...HSTACK, justifyContent: "space-between", fontVariantNumeric: "tabular-nums" }}>
      <div style={{ fontWeight: 600 }}>{token}</div>
      <div style={{ display: "flex", gap: 12 }}>
        <span title="Total YES">{totalYes.toLocaleString()}</span>
        <span title="Total NO">{totalNo.toLocaleString()}</span>
        <span style={{ color: "#475569" }} title="Total">{total.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function MarketDetailClient({ market }: { market: MarketCard }) {
  const yes = findOutcome(market.outcomes, "yes");
  const no = findOutcome(market.outcomes, "no");
  const yesPct = pctFromStr(yes?.price) || pctFromStr(yes?.probCorrect);
  const noPct  = pctFromStr(no?.price)  || pctFromStr(no?.probIncorrect);

  const tokens: PoolToken[] = market.poolTokens?.length
    ? market.poolTokens
    : (["USDT", "USDC", "WETH", "WBTC"] as PoolToken[]);

  const zero = 0;

  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ ...HSTACK, flexWrap: "wrap", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{market.title}</h1>
          {market.subtitle && <p style={{ color: "#64748b", marginTop: 6 }}>{market.subtitle}</p>}
        </div>
        <div style={{ ...VSTACK, alignItems: "flex-end" }}>
          <div style={{ fontSize: 12, color: "#64748b" }}>Total Volume</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{market.volume || "—"}</div>
        </div>
      </div>

      <section style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", marginBottom: 16 }}>
        <div style={CARD}>
          <div style={{ ...HSTACK, justifyContent: "space-between", marginBottom: 8 }}>
            <strong>YES / NO (market data)</strong>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ color: "#065f46", fontWeight: 700 }}>YES: {yesPct}%</span>
              <span style={{ color: "#991b1b", fontWeight: 700 }}>NO: {noPct}%</span>
            </div>
          </div>
          <YesNoBar yesPct={yesPct} noPct={noPct} />
          <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>
            Fuente: <em>price</em> (o <em>probCorrect/probIncorrect</em>) en <code>marketsData.ts</code>.
          </div>
        </div>

        <div style={CARD}>
          <strong>Estado</strong>
          <div style={{ marginTop: 8, fontSize: 14 }}>
            <span style={{ padding: "4px 10px", background: "#e5e7eb", borderRadius: 999, fontWeight: 700, letterSpacing: 0.4 }}>
              DETALLE DEL MERCADO
            </span>
          </div>
        </div>
      </section>

      <section style={{ ...VSTACK }}>
        <div style={{ ...HSTACK, justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Pools por token (on-chain)</h2>
          <span style={{ fontSize: 12, color: "#64748b" }}>Sin contrato: se muestran 0 en todos los totales.</span>
        </div>

        <div style={{ ...CARD }}>
          <div style={{ ...HSTACK, justifyContent: "space-between", color: "#475569", marginBottom: 8, fontWeight: 700 }}>
            <div>Token</div>
            <div style={{ display: "flex", gap: 12 }}>
              <span>YES</span>
              <span>NO</span>
              <span>Total</span>
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            {tokens.map((t) => (
              <TokenRow key={t} token={t} totalYes={zero} totalNo={zero} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
