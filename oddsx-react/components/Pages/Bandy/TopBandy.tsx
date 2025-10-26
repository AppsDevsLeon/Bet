"use client";

import Image from "next/image";
import React, { useState, useCallback } from "react";

/* ================= Tipos ================= */
type MarketOpt = {
  key: string;              // "1" | "X" | "2" | "O" | "U"
  label: string;            // texto que se muestra (1 / X / 2 / Over / Under)
  price: number;            // cuota decimal
  variant: "green" | "red" | "neutral";
};

type BandyMatch = {
  id: string;
  league: "Norway Eliteserien";
  title: string;            // Ronda / Jornada
  whenLocal: string;        // "Vie 10 ene, 19:00 (CET)"
  venue?: string;
  team1Logo: string;
  team2Logo: string;
  team1: string;
  team2: string;
  markets: {
    oneXtwo: MarketOpt[];
    total: { line: string; opts: MarketOpt[] }; // p.ej. line: "8.5"
  };
};

type BetSel = {
  matchId: string;
  market: string;     // "1x2" | "Total"
  option: string;     // "1" | "X" | "2" | "Over" | "Under"
  display: string;    // texto para el ticket
  price: number;
};

/* ========== Datos reales ILUSTRATIVOS (equipos reales de Eliteserien) ========== */
/* Fechas/horas son de ejemplo; ajusta contra tu feed si tienes API. */
const NORWAY_BANDY_REAL: BandyMatch[] = [
  {
    id: "stabak-solberg-2025-r3",
    league: "Norway Eliteserien",
    title: "Round 3",
    whenLocal: "Vie 10 ene, 19:00 (CET) • Nadderud",
    venue: "Nadderud",
    team1Logo: "/images/icon/bandy2.png",
    team2Logo: "/images/icon/bandy2.png",
    team1: "Stabæk",
    team2: "Solberg",
    markets: {
      oneXtwo: [
        { key: "1", label: "1", price: 1.95, variant: "green" },
        { key: "X", label: "X", price: 4.40, variant: "neutral" },
        { key: "2", label: "2", price: 2.35, variant: "red" },
      ],
      total: {
        line: "8.5",
        opts: [
          { key: "O", label: "Over", price: 1.87, variant: "green" },
          { key: "U", label: "Under", price: 1.95, variant: "red" },
        ],
      },
    },
  },
  {
    id: "ready-mjondalen-2025-r3",
    league: "Norway Eliteserien",
    title: "Round 3",
    whenLocal: "Vie 10 ene, 19:00 (CET) • Gressbanen",
    venue: "Gressbanen",
    team1Logo: "/images/icon/bandy2.png",
    team2Logo: "/images/icon/bandy2.png",
    team1: "Ready",
    team2: "Mjøndalen",
    markets: {
      oneXtwo: [
        { key: "1", label: "1", price: 2.10, variant: "green" },
        { key: "X", label: "X", price: 4.70, variant: "neutral" },
        { key: "2", label: "2", price: 2.05, variant: "red" },
      ],
      total: {
        line: "9.5",
        opts: [
          { key: "O", label: "Over", price: 1.90, variant: "green" },
          { key: "U", label: "Under", price: 1.92, variant: "red" },
        ],
      },
    },
  },
  {
    id: "ullern-drammen-2025-r3",
    league: "Norway Eliteserien",
    title: "Round 3",
    whenLocal: "Sáb 11 ene, 16:00 (CET) • Ullernbanen",
    venue: "Ullernbanen",
    team1Logo: "/images/icon/bandy2.png",
    team2Logo: "/images/icon/bandy2.png",
    team1: "Ullern",
    team2: "Drammen",
    markets: {
      oneXtwo: [
        { key: "1", label: "1", price: 2.65, variant: "green" },
        { key: "X", label: "X", price: 4.90, variant: "neutral" },
        { key: "2", label: "2", price: 1.75, variant: "red" },
      ],
      total: {
        line: "8.5",
        opts: [
          { key: "O", label: "Over", price: 1.84, variant: "green" },
          { key: "U", label: "Under", price: 2.00, variant: "red" },
        ],
      },
    },
  },
];

/* ========== Botón de cuota (verde/rojo/neutro) ========== */
function PriceButton({
  label, price, active, variant = "green", onClick,
}: {
  label: string;
  price: number;
  active?: boolean;
  variant?: "green" | "red" | "neutral";
  onClick?: () => void;
}) {
  return (
    <>
      <button className={`odds ${variant} ${active ? "active" : ""}`} onClick={onClick} type="button">
        <span className="badge">{label}</span>
        <span className="val">{price.toFixed(2)}</span>
      </button>

      <style jsx>{`
        .odds{
          display:inline-flex; align-items:center; gap:10px;
          padding:10px 14px; border-radius:12px; font-weight:800;
          transition: background .15s ease, transform .05s ease, border-color .15s ease, box-shadow .15s ease;
          color:#E6F3F0;
        }
        .badge{ display:inline-grid; place-items:center; min-width:26px; height:26px; padding:0 6px;
                border-radius:999px; font-weight:900; background: rgba(0,0,0,.25); }
        .val{ font-variant-numeric: tabular-nums; letter-spacing:.2px; }

        /* VERDE puro (0,255,0) */
        .odds.green{ background: rgba(0,255,0,.20); border: 2px solid rgba(0,255,0,.65); box-shadow: 0 0 0 1px rgba(0,255,0,.15) inset; }
        .odds.green:hover{ background: rgba(0,255,0,.28); transform: translateY(-1px); }
        .odds.green.active{ background: rgba(0,255,0,.35); border-color: rgb(0,255,0); box-shadow: 0 0 0 2px rgba(0,255,0,.35) inset, 0 0 12px rgba(0,255,0,.25); }

        /* ROJO puro (255,0,0) */
        .odds.red{ background: rgba(255,0,0,.20); border: 2px solid rgba(255,0,0,.65); box-shadow: 0 0 0 1px rgba(255,0,0,.15) inset; }
        .odds.red:hover{ background: rgba(255,0,0,.28); transform: translateY(-1px); }
        .odds.red.active{ background: rgba(255,0,0,.35); border-color: rgb(255,0,0); box-shadow: 0 0 0 2px rgba(255,0,0,.35) inset, 0 0 12px rgba(255,0,0,.25); }

        /* Neutro / Dorado */
        .odds.neutral{ background: rgba(217,180,92,.18); border: 2px solid rgba(217,180,92,.55); }
        .odds.neutral:hover{ background: rgba(217,180,92,.26); transform: translateY(-1px); }
        .odds.neutral.active{ background: rgba(217,180,92,.34); border-color: #D9B45C; box-shadow: 0 0 0 2px rgba(217,180,92,.28) inset; }
      `}</style>
    </>
  );
}

/* ========== Ticket ========== */
function BetSlipBandy({
  list, onRemove, onClear,
}: { list: BetSel[]; onRemove: (idx: number) => void; onClear: () => void }) {
  return (
    <aside className="betslip">
      <div className="bs-head">
        <h4><span className="gold">Ticket</span> ({list.length})</h4>
        <button className="clear" onClick={onClear} disabled={!list.length}>Limpiar</button>
      </div>
      <div className="bs-body">
        {list.length === 0 ? (
          <div className="empty">No has seleccionado apuestas.</div>
        ) : (
          list.map((b, i) => (
            <div className="item" key={`${b.matchId}-${i}`}>
              <div className="top">
                <span className="tag">{b.market}</span>
                <button className="x" onClick={() => onRemove(i)} aria-label="Quitar" />
              </div>
              <div className="txt">{b.display}</div>
              <div className="odd">{b.price.toFixed(2)}</div>
            </div>
          ))
        )}
      </div>
      <div className="bs-foot">
        <button className="cta" disabled={!list.length}>Continuar</button>
      </div>

      <style jsx>{`
        .betslip{ position: sticky; top: var(--header-h, 80px);
          border:1px solid var(--stroke); border-radius:12px; background: var(--surface-2); overflow:hidden; }
        .bs-head{ display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid var(--stroke); }
        .gold{ color: var(--gold); }
        .clear{ background:transparent; border:0; color:var(--muted); cursor:pointer; }
        .bs-body{ display:grid; gap:8px; padding:10px; max-height:55vh; overflow:auto; }
        .empty{ color:var(--muted); }
        .item{ border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:10px; background:#0a3833; }
        .top{ display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
        .x{ width:12px; height:12px; border:0; background:transparent; cursor:pointer; position:relative; }
        .x::before,.x::after{ content:""; position:absolute; left:5px; top:0; width:2px; height:12px; background:currentColor; }
        .x::before{ transform:rotate(45deg) } .x::after{ transform:rotate(-45deg) }
        .txt{ font-weight:600; }
        .odd{ font-variant-numeric: tabular-nums; opacity:.9; }
        .bs-foot{ padding:10px; border-top:1px solid var(--stroke); }
        .cta{ width:100%; padding:10px 12px; border:0; border-radius:10px; background:#4b5bd1; color:#f3f4f6; font-weight:800; cursor:pointer; }
      `}</style>
    </aside>
  );
}

/* ========== Componente principal ========== */
export default function TopBandyNorway({
  data = NORWAY_BANDY_REAL,
  headerH = "80px", sidebarW = "260px", gutterX = "16px", extraTop = "18px",
}: {
  data?: BandyMatch[];
  headerH?: number | string;
  sidebarW?: number | string;
  gutterX?: number | string;
  extraTop?: number | string;
}) {
  const [bets, setBets] = useState<BetSel[]>([]);
  const toDim = (v: number | string) => (typeof v === "number" ? `${v}px` : v);

  const onToggle = useCallback(
    (m: BandyMatch, market: "1x2" | "Total", opt: MarketOpt | { key: string; label: string; price: number; variant: "green"|"red"|"neutral" }) => {
      const display =
        market === "1x2"
          ? `${m.team1} vs ${m.team2} • ${opt.label}`
          : `${opt.label} ${m.markets.total.line}`;
      const key = `${m.id}-${market}-${opt.key}-${opt.price}`;
      setBets((cur) => {
        const i = cur.findIndex(b => `${b.matchId}-${b.market}-${b.option}-${b.price}` === key);
        if (i >= 0) { const copy = [...cur]; copy.splice(i,1); return copy; }
        return [...cur, { matchId: m.id, market, option: opt.label, display, price: opt.price }];
      });
    },
    []
  );

  return (
    <section
      className="bandy-wrap"
      style={
        {
          ["--header-h" as any]: toDim(headerH),
          ["--sidebar-w" as any]: toDim(sidebarW),
          ["--gutter-x" as any]: toDim(gutterX),
          ["--extra-top" as any]: toDim(extraTop),
        } as React.CSSProperties
      }
    >
      <div className="container-fluid">
        <div className="header">
          <div className="title d-flex align-items-center gap-2">
            <Image src="/images/icon/poland2.png" width={30} height={30} alt="Icon" />
            <h3>Norway</h3>
          </div>
          <p className="muted">Eliteserien Bandy — cuotas ilustrativas. Haz clic para añadir al ticket.</p>
        </div>

        <div className="grid">
          <div className="list">
            {data.map((m) => {
              const isGreenActive = (key: string, price: number) =>
                bets.some(b => b.matchId === m.id && (b.option === key || b.option === key.toUpperCase()) && b.price === price);

              return (
                <article className="card" key={m.id}>
                  <div className="left">
                    <div className="meta">
                      <div className="league">
                        <Image src="/images/icon/bandy.png" width={13} height={13} alt="Icon" />
                        <span className="t">{m.title}</span>
                      </div>
                      <div className="when">{m.whenLocal}</div>
                    </div>

                    <div className="teams">
                      <div className="team">
                        <Image className="rounded-5" src={m.team1Logo} width={24} height={24} alt={m.team1} />
                        <span>{m.team1}</span>
                      </div>
                      <div className="team">
                        <Image className="rounded-5" src={m.team2Logo} width={24} height={24} alt={m.team2} />
                        <span>{m.team2}</span>
                      </div>
                    </div>
                  </div>

                  <div className="right">
                    {/* 1x2 */}
                    <div className="market">
                      <span className="label gold">1x2</span>
                      <div className="choices">
                        {m.markets.oneXtwo.map((o) => (
                          <PriceButton
                            key={`${m.id}-${o.key}`}
                            label={o.label}
                            price={o.price}
                            variant={o.variant}
                            active={bets.some(b => b.matchId === m.id && b.market === "1x2" && b.option === o.label && b.price === o.price)}
                            onClick={() => onToggle(m, "1x2", o)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="market">
                      <span className="label gold">Total {m.markets.total.line}</span>
                      <div className="choices">
                        {m.markets.total.opts.map((o) => (
                          <PriceButton
                            key={`${m.id}-tot-${o.key}`}
                            label={o.label}
                            price={o.price}
                            variant={o.variant}
                            active={bets.some(b => b.matchId === m.id && b.market === "Total" && b.option === o.label && b.price === o.price)}
                            onClick={() => onToggle(m, "Total", o)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="slip">
            <BetSlipBandy
              list={bets}
              onRemove={(i) => setBets(cur => cur.filter((_, idx) => idx !== i))}
              onClear={() => setBets([])}
            />
          </div>
        </div>
      </div>

      {/* ================= Estilos + Overrides ================= */}
      <style jsx>{`
        :global(html), :global(body), :global(#__next){ background:#062925 !important; }
        :global(body){ color-scheme: dark; }

        .bandy-wrap{
          --surface-1:#062925; --surface-2:#0A3833; --surface-3:#0D4641;
          --stroke:#14534D; --muted:#9BB6B0; --text-1:#E6F3F0; --text-2:#BFD2CE;
          --gold:#D9B45C;

          padding-top: calc(var(--header-h,80px) + var(--extra-top,18px));
          padding-left: calc(var(--sidebar-w,260px) + var(--gutter-x,16px));
          padding-right: var(--gutter-x,16px);
          padding-bottom: 16px;
          background: var(--surface-1); color: var(--text-1);
        }

        .header{ padding: 6px 0 14px; }
        .title h3{ margin:0; color: var(--text-1); }
        .muted{ color: var(--muted); margin: 4px 0 0; }

        .grid{ display:grid; grid-template-columns: 1fr minmax(300px,360px); gap:16px; align-items:start; }
        .slip{ align-self:start; }
        @media (max-width: 992px){ .grid{ grid-template-columns:1fr; } }

        .card{
          display:grid; grid-template-columns: 1.1fr 1fr; gap:16px;
          border:1px solid var(--stroke); border-radius:12px;
          background: linear-gradient(180deg, rgba(255,255,255,.02), rgba(0,0,0,.02)), var(--surface-2);
          padding:16px;
        }
        @media (max-width: 768px){ .card{ grid-template-columns:1fr; } }

        .meta{ display:flex; align-items:center; justify-content:space-between; padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid var(--stroke); }
        .league{ display:flex; align-items:center; gap:8px; }
        .league .t{ font-weight:700; color: var(--gold); }
        .when{ color: var(--muted); font-size:.9rem; }
        .teams{ display:flex; gap:18px; }
        .team{ display:flex; align-items:center; gap:8px; }

        .right{ display:grid; gap:10px; }
        .market{
          display:flex; align-items:center; gap:14px;
          background: var(--surface-3);
          border:1px solid var(--stroke);
          border-radius:12px; padding:10px 12px;
        }
        .label{ font-size:.9rem; color: var(--gold); white-space:nowrap; }
        .choices{ display:flex; align-items:center; gap:10px; }

        /* Antiblancos del template */
        :global(.bandy-wrap .table), :global(.bandy-wrap .table *),
        :global(.bandy-wrap thead), :global(.bandy-wrap tbody),
        :global(.bandy-wrap tr), :global(.bandy-wrap th), :global(.bandy-wrap td){
          background: transparent !important; box-shadow: none !important;
        }
        :global(.bandy-wrap .bg-white), :global(.bandy-wrap .bg-light),
        :global(.bandy-wrap .white-bg), :global(.bandy-wrap .p2-bg), :global(.bandy-wrap .n11-bg){
          background: var(--surface-2) !important; border-color: var(--stroke) !important;
        }
        :global(.bandy-wrap hr){ border:0; border-top:1px solid var(--stroke) !important; opacity:1 !important; }
      `}</style>
    </section>
  );
}
