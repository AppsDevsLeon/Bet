"use client";

import Image from "next/image";
import React, { useState, useCallback } from "react";

/* ========= Tipos ========= */
type AussieMatch = {
  id: string;
  league: "AFLW" | "AFL";
  title: string;
  whenLocal: string;
  clubOneLogo: string;
  clubTwoLogo: string;
  clubOneName: string;
  clubTwoName: string;
  market: { label: string; options: { sel: "1" | "2"; price: number; team: string }[] };
};
type BetSel = { matchId: string; market: string; team: string; sel: "1" | "2"; price: number };

/* ========= Datos reales ilustrativos ========= */
const AUS_REAL_DATA: AussieMatch[] = [
  {
    id: "aflw-r7-geel-haw-2025-09-25",
    league: "AFLW",
    title: "AFLW Round 7",
    whenLocal: "Jue 25 sep, 04:15 (CDMX) • GMHBA",
    clubOneLogo: "/images/teams/geelong.png",
    clubTwoLogo: "/images/teams/hawthorn.png",
    clubOneName: "Geelong (W)",
    clubTwoName: "Hawthorn (W)",
    market: { label: "Winner", options: [
      { sel: "1", price: 1.62, team: "Geelong (W)" },
      { sel: "2", price: 2.30, team: "Hawthorn (W)" },
    ]},
  },
  {
    id: "aflw-r7-melb-gcs-2025-09-26",
    league: "AFLW",
    title: "AFLW Round 7",
    whenLocal: "Vie 26 sep, 03:45 (CDMX)",
    clubOneLogo: "/images/teams/melbourne.png",
    clubTwoLogo: "/images/teams/goldcoast.png",
    clubOneName: "Melbourne (W)",
    clubTwoName: "Gold Coast (W)",
    market: { label: "Winner", options: [
      { sel: "1", price: 1.85, team: "Melbourne (W)" },
      { sel: "2", price: 2.00, team: "Gold Coast (W)" },
    ]},
  },
  {
    id: "afl-gf-bris-geel-2025-09-27",
    league: "AFL",
    title: "AFL Grand Final",
    whenLocal: "Sáb 27 sep, 23:30 (CDMX) • MCG",
    clubOneLogo: "/images/teams/brisbane.png",
    clubTwoLogo: "/images/teams/geelong.png",
    clubOneName: "Brisbane",
    clubTwoName: "Geelong",
    market: { label: "Winner", options: [
      { sel: "1", price: 1.75, team: "Brisbane" },
      { sel: "2", price: 2.10, team: "Geelong" },
    ]},
  },
];

/* ========= Botón de cuota (con variantes green/red) ========= */
function PriceButton({
  sel, price, active, variant = "green", onClick,
}: {
  sel: "1" | "2";
  price: number;
  active?: boolean;
  variant?: "green" | "red";
  onClick?: () => void;
}) {
  return (
    <>
      <button className={`odds ${variant} ${active ? "active" : ""}`} onClick={onClick} type="button">
        <span className="badge">{sel}</span>
        <span className="val">{price.toFixed(2)}</span>
      </button>

      <style jsx>{`
        .odds{
          display:inline-flex; align-items:center; gap:10px;
          padding:10px 14px; border-radius:12px; font-weight:800;
          backdrop-filter: saturate(140%);
          transition: background .15s ease, transform .05s ease, border-color .15s ease, box-shadow .15s ease;
          color:#f5f9f7;
        }
        .badge{ display:inline-grid; place-items:center; min-width:26px; height:26px; padding:0 6px;
                border-radius:999px; font-weight:900; background: rgba(0,0,0,.25); }

        /* ===== VERDE (0,255,0) ===== */
        .odds.green{
          background: rgba(0,255,0,.20);
          border: 2px solid rgba(0,255,0,.65);
          box-shadow: 0 0 0 1px rgba(0,255,0,.15) inset;
        }
        .odds.green:hover{ background: rgba(0,255,0,.28); transform: translateY(-1px); }
        .odds.green.active{
          background: rgba(0,255,0,.35);
          border-color: rgb(0,255,0);
          box-shadow: 0 0 0 2px rgba(0,255,0,.35) inset, 0 0 12px rgba(0,255,0,.25);
        }

        /* ===== ROJO (255,0,0) ===== */
        .odds.red{
          background: rgba(255,0,0,.20);
          border: 2px solid rgba(255,0,0,.65);
          box-shadow: 0 0 0 1px rgba(255,0,0,.15) inset;
        }
        .odds.red:hover{ background: rgba(255,0,0,.28); transform: translateY(-1px); }
        .odds.red.active{
          background: rgba(255,0,0,.35);
          border-color: rgb(255,0,0);
          box-shadow: 0 0 0 2px rgba(255,0,0,.35) inset, 0 0 12px rgba(255,0,0,.25);
        }

        .val{ font-variant-numeric: tabular-nums; letter-spacing:.2px; }
      `}</style>
    </>
  );
}

/* ========= Ticket ========= */
function BetSlipAussie({
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
              <div className="txt">{b.team}</div>
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
          border:1px solid var(--stroke); border-radius:12px;
          background: var(--surface-2); overflow:hidden; }
        .bs-head{ display:flex; align-items:center; justify-content:space-between;
          padding:10px 12px; border-bottom:1px solid var(--stroke); }
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
        .cta{ width:100%; padding:10px 12px; border:0; border-radius:10px;
          background:#4b5bd1; color:#f3f4f6; font-weight:800; cursor:pointer; }
      `}</style>
    </aside>
  );
}

/* ========= Componente principal ========= */
export default function TopAussieRulesGreenRed({
  data = AUS_REAL_DATA, headerH = "80px", sidebarW = "260px", gutterX = "16px", extraTop = "18px",
}: {
  data?: AussieMatch[];
  headerH?: number | string;
  sidebarW?: number | string;
  gutterX?: number | string;
  extraTop?: number | string;
}) {
  const [bets, setBets] = useState<BetSel[]>([]);
  const toDim = (v: number | string) => (typeof v === "number" ? `${v}px` : v);

  const onToggleBet = useCallback((m: AussieMatch, o: { sel: "1" | "2"; price: number; team: string }) => {
    setBets((cur) => {
      const key = `${m.id}-${o.sel}-${o.price}`;
      const i = cur.findIndex(b => `${b.matchId}-${b.sel}-${b.price}` === key);
      if (i >= 0) { const copy = [...cur]; copy.splice(i,1); return copy; }
      return [...cur, { matchId: m.id, market: m.market.label, team: o.team, sel: o.sel, price: o.price }];
    });
  }, []);

  return (
    <section
      className="aus-wrap"
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
          <div className="title">
            <Image src="/images/icon/australia2.png" width={30} height={30} alt="Icon" />
            <h3>Australia</h3>
          </div>
          <p className="muted">Haz clic para agregar al ticket. Los precios son ilustrativos.</p>
        </div>

        <div className="grid">
          <div className="list">
            {data.map((m) => (
              <article className="card" key={m.id}>
                <div className="left">
                  <div className="meta">
                    <div className="league">
                      <Image src="/images/icon/aussie-rules.png" width={16} height={16} alt="Icon" />
                      <span className="t">{m.title}</span>
                    </div>
                    <div className="when">{m.whenLocal}</div>
                  </div>

                  <div className="teams">
                    <div className="team">
                      <Image className="rounded-5" src={m.clubOneLogo} width={24} height={24} alt={m.clubOneName} />
                      <span>{m.clubOneName}</span>
                    </div>
                    <div className="team">
                      <Image className="rounded-5" src={m.clubTwoLogo} width={24} height={24} alt={m.clubTwoName} />
                      <span>{m.clubTwoName}</span>
                    </div>
                  </div>
                </div>

                <div className="right">
                  <div className="winner">
                    <span className="label">{m.market.label}</span>
                    <div className="choices">
                      {m.market.options.map((o, idx) => {
                        const active = bets.some(b => b.matchId === m.id && b.sel === o.sel && b.price === o.price);
                        const variant = idx === 0 ? "green" : "red"; // primera opción verde, segunda roja
                        return (
                          <PriceButton
                            key={`${m.id}-${o.sel}`}
                            sel={o.sel}
                            price={o.price}
                            active={active}
                            variant={variant as "green" | "red"}
                            onClick={() => onToggleBet(m, o)}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="slip">
            <BetSlipAussie
              list={bets}
              onRemove={(i) => setBets(cur => cur.filter((_, idx) => idx !== i))}
              onClear={() => setBets([])}
            />
          </div>
        </div>
      </div>

      {/* ======= Estilos + Overrides ======= */}
      <style jsx>{`
        /* Fondo global (primera capa), dorado y verdes */
        :global(html), :global(body), :global(#__next){ background:#062925 !important; }
        :global(body){ color-scheme: dark; }

        .aus-wrap{
          --page-bg: #062925;
          --surface-1:#062925; --surface-2:#0A3833; --surface-3:#0D4641;
          --stroke:#14534D; --muted:#9BB6B0; --text-1:#E6F3F0; --text-2:#BFD2CE;
          --gold:#D9B45C; /* acento como en tu captura */

          padding-top: calc(var(--header-h,80px) + var(--extra-top,18px));
          padding-left: calc(var(--sidebar-w,260px) + var(--gutter-x,16px));
          padding-right: var(--gutter-x,16px);
          padding-bottom: 16px;
          background: var(--surface-1);
          color: var(--text-1);
        }

        .header{ padding: 6px 0 14px; }
        .title{ display:flex; align-items:center; gap:8px; }
        .title h3{ margin:0; color: var(--text-1); }
        .muted{ color: var(--muted); margin: 4px 0 0; }

        .grid{ display:grid; grid-template-columns: 1fr minmax(300px,360px); gap:16px; align-items:start; }
        .slip{ align-self:start; }
        @media (max-width: 992px){ .grid{ grid-template-columns:1fr; } }

        .card{
          display:grid; grid-template-columns: 1.1fr 0.9fr; gap:12px;
          border:1px solid var(--stroke); border-radius:12px;
          background: linear-gradient(180deg, rgba(255,255,255,.02), rgba(0,0,0,.02)), var(--surface-2);
          padding:16px;
        }
        @media (max-width: 768px){ .card{ grid-template-columns:1fr; } }

        .meta{ display:flex; align-items:center; justify-content:space-between;
               padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid var(--stroke); }
        .league{ display:flex; align-items:center; gap:8px; }
        .league .t{ font-weight:700; color: var(--gold); }
        .when{ color: var(--muted); font-size:.9rem; }
        .teams{ display:flex; gap:18px; }
        .team{ display:flex; align-items:center; gap:8px; }

        .right{ display:flex; align-items:center; justify-content:center; }
        .winner{
          display:flex; align-items:center; gap:14px;
          background: var(--surface-3);
          border:1px solid var(--stroke);
          border-radius:12px; padding:10px 12px;
        }
        .winner .label{ font-size:.9rem; color: var(--gold); white-space:nowrap; letter-spacing:.2px; }
        .choices{ display:flex; align-items:center; gap:10px; }

        /* Matar blancos heredados solo aquí */
        :global(.aus-wrap .table), :global(.aus-wrap .table *),
        :global(.aus-wrap thead), :global(.aus-wrap tbody),
        :global(.aus-wrap tr), :global(.aus-wrap th), :global(.aus-wrap td){
          background: transparent !important;
          box-shadow: none !important;
        }
        :global(.aus-wrap .bg-white), :global(.aus-wrap .bg-light),
        :global(.aus-wrap .white-bg), :global(.aus-wrap .p2-bg), :global(.aus-wrap .n11-bg){
          background: var(--surface-2) !important; border-color: var(--stroke) !important;
        }
        :global(.aus-wrap hr){ border:0; border-top:1px solid var(--stroke) !important; opacity:1 !important; }
      `}</style>
    </section>
  );
}
