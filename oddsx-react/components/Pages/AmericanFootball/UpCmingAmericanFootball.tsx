
"use client";

import React, { useState, useCallback, useMemo } from "react";

import SideNav from "@/components/Shared/SideNav";
import LeagueHeader from "@/components/betting/LeagueHeader";
import GameCardLive from "@/components/betting/GameCardLive";
import GameCardScheduled from "@/components/betting/GameCardScheduled";
import PropsGrid from "@/components/betting/PropsGrid";
import BetTicket from "@/components/betting/BetTicket";
import GameDetailView from "@/components/betting/GameDetail";

import type {
  GameCardData,
  Seleccion,
  PropCard,
} from "@/components/betting/types";

import { SPORT_CONFIG } from "@/lib/sportConfig";

/* =========================================================
   Flexible mock generator — 10–15 per sport without huge code
   ---------------------------------------------------------
   - Add your sport slug in SPORTS if you want it supported.
   - Uses small team pools per sport and generates N fixtures.
   - Prices are pseudo-random but deterministic per index.
========================================================= */

type Team = { abbr: string; name: string; color: string };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const coin = (seed: number) => (seed % 2 === 0 ? "Yes" : "No");

function cents(seed: number, base = 45, spread = 15): string {
  const v = clamp(base + ((seed * 7) % (spread * 2)) - spread, 15, 85);
  return `${v}¢`;
}

function kickoffFor(idx: number): string {
  // Rotates through upcoming dates/times in English
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar"];
  const m = months[idx % months.length];
  const d = 12 + (idx % 17);
  const dow = days[idx % days.length];
  const h = 12 + (idx * 2) % 12;
  const suffix = h >= 12 ? "PM" : "AM";
  return `${m} ${d} - ${h}:00 ${suffix} (${dow})`;
}

/* ===== Team pools per sport (keep short; generator mixes them) ===== */

const POOLS: Record<string, Team[]> = {
  soccer: [
    { abbr: "MCI", name: "Manchester City", color: "#6CABDD" },
    { abbr: "LIV", name: "Liverpool", color: "#C8102E" },
    { abbr: "ARS", name: "Arsenal", color: "#EF0107" },
    { abbr: "CHE", name: "Chelsea", color: "#034694" },
    { abbr: "BAR", name: "Barcelona", color: "#7a003c" },
    { abbr: "REA", name: "Real Madrid", color: "#d4af00" },
    { abbr: "PSG", name: "Paris SG", color: "#001e62" },
    { abbr: "BAY", name: "Bayern", color: "#DC052D" },
    { abbr: "INT", name: "Inter", color: "#00A3E0" },
    { abbr: "JUV", name: "Juventus", color: "#000000" },
  ],
  nfl: [
    { abbr: "DAL", name: "Dallas Cowboys", color: "#1f2937" },
    { abbr: "PHI", name: "Philadelphia Eagles", color: "#065f46" },
    { abbr: "KC", name: "Kansas City Chiefs", color: "#E31837" },
    { abbr: "BUF", name: "Buffalo Bills", color: "#00338D" },
    { abbr: "SF", name: "San Francisco 49ers", color: "#AA0000" },
    { abbr: "DET", name: "Detroit Lions", color: "#0076B6" },
    { abbr: "GB", name: "Green Bay Packers", color: "#203731" },
    { abbr: "MIA", name: "Miami Dolphins", color: "#008E97" },
    { abbr: "BAL", name: "Baltimore Ravens", color: "#241773" },
    { abbr: "NYJ", name: "New York Jets", color: "#125740" },
  ],
  basketball: [
    { abbr: "LAL", name: "Los Angeles Lakers", color: "#552583" },
    { abbr: "BOS", name: "Boston Celtics", color: "#007A33" },
    { abbr: "GSW", name: "Golden State Warriors", color: "#1D428A" },
    { abbr: "MIL", name: "Milwaukee Bucks", color: "#00471B" },
    { abbr: "MIA", name: "Miami Heat", color: "#98002E" },
    { abbr: "PHX", name: "Phoenix Suns", color: "#E56020" },
    { abbr: "DAL", name: "Dallas Mavericks", color: "#00538C" },
    { abbr: "DEN", name: "Denver Nuggets", color: "#0E2240" },
  ],
  tennis: [
    { abbr: "DJO", name: "Novak Djokovic", color: "#001489" },
    { abbr: "SIN", name: "Jannik Sinner", color: "#FF6F00" },
    { abbr: "ALC", name: "Carlos Alcaraz", color: "#1f7a8c" },
    { abbr: "MED", name: "Daniil Medvedev", color: "#003399" },
    { abbr: "ZVE", name: "Alexander Zverev", color: "#666666" },
    { abbr: "RUB", name: "Andrey Rublev", color: "#c0392b" },
  ],
  "ice-hockey": [
    { abbr: "TOR", name: "Toronto Maple Leafs", color: "#00205B" },
    { abbr: "NYR", name: "New York Rangers", color: "#0038A8" },
    { abbr: "BOS", name: "Boston Bruins", color: "#FFB81C" },
    { abbr: "MTL", name: "Montréal Canadiens", color: "#AF1E2D" },
    { abbr: "EDM", name: "Edmonton Oilers", color: "#041E42" },
    { abbr: "VAN", name: "Vancouver Canucks", color: "#00205B" },
  ],
  cricket: [
    { abbr: "IND", name: "India", color: "#1C3FAA" },
    { abbr: "AUS", name: "Australia", color: "#F7B500" },
    { abbr: "ENG", name: "England", color: "#0a192f" },
    { abbr: "PAK", name: "Pakistan", color: "#1B5E20" },
    { abbr: "NZL", name: "New Zealand", color: "#000000" },
    { abbr: "SA", name: "South Africa", color: "#006341" },
  ],
  "table-tennis": [
    { abbr: "FAN", name: "Fan Zhendong", color: "#0a192f" },
    { abbr: "MA", name: "Ma Long", color: "#1f7a8c" },
    { abbr: "WANG", name: "Wang Chuqin", color: "#003580" },
    { abbr: "LIN", name: "Lin Gaoyuan", color: "#0066CC" },
  ],
  rugby: [
    { abbr: "IRE", name: "Ireland", color: "#169B62" },
    { abbr: "ENG", name: "England", color: "#FFFFFF" },
    { abbr: "FRA", name: "France", color: "#001D70" },
    { abbr: "SCO", name: "Scotland", color: "#1C3AA9" },
    { abbr: "WAL", name: "Wales", color: "#D30731" },
    { abbr: "ITA", name: "Italy", color: "#0066CC" },
  ],
  mma: [
    { abbr: "MAK", name: "Islam Makhachev", color: "#1E3C8E" },
    { abbr: "GAE", name: "Justin Gaethje", color: "#E7B958" },
    { abbr: "VOL", name: "Alexander Volkanovski", color: "#005F73" },
    { abbr: "OLI", name: "Charles Oliveira", color: "#9B2226" },
  ],
  boxing: [
    { abbr: "CAN", name: "Saúl Álvarez", color: "#006341" },
    { abbr: "BEN", name: "David Benavidez", color: "#A41E22" },
    { abbr: "FUR", name: "Tyson Fury", color: "#7A003C" },
    { abbr: "USY", name: "Oleksandr Usyk", color: "#0038A8" },
  ],
  esports: [
    { abbr: "FAZE", name: "FaZe Clan", color: "#D81222" },
    { abbr: "NAVI", name: "Natus Vincere", color: "#FFD100" },
    { abbr: "G2", name: "G2 Esports", color: "#000000" },
    { abbr: "VIT", name: "Team Vitality", color: "#FFCC00" },
  ],
  volleyball: [
    { abbr: "ITA", name: "Italy", color: "#0066CC" },
    { abbr: "BRA", name: "Brazil", color: "#FFCC00" },
    { abbr: "USA", name: "USA", color: "#0A3161" },
    { abbr: "POL", name: "Poland", color: "#D22630" },
  ],
  futsal: [
    { abbr: "BAR", name: "Barcelona Futsal", color: "#7a003c" },
    { abbr: "INT", name: "Inter FS", color: "#00A3E0" },
    { abbr: "SLB", name: "Benfica", color: "#D00000" },
    { abbr: "SCP", name: "Sporting CP", color: "#006341" },
  ],
};

/* ===== Generator for fixture list ===== */

function genMoneyline(seed: number, a: Team, b: Team) {
  const aC = cents(seed + 1, 52, 12);
  const bC = cents(seed + 2, 48, 12);
  const tones: (GameCardData["moneyline"][number]["tone"])[] = ["blue","green","red","purple","yellow","navy","orange","gold", undefined];
  return [
    { label: a.abbr, price: aC, tone: tones[(seed+3)%tones.length] },
    { label: b.abbr, price: bC, tone: tones[(seed+4)%tones.length] },
  ];
}

function genSpread(seed: number, a: Team, b: Team) {
  const line = (seed % 2 === 0 ? -1 : +1) * (1 + (seed % 3));
  return [
    { label: `${a.abbr} ${line > 0 ? "+" : ""}${line}.5`, price: cents(seed + 5) },
    { label: `${b.abbr} ${line < 0 ? "+" : ""}${-line}.5`, price: cents(seed + 6) },
  ];
}

function genTotal(seed: number, sport: string) {
  const bases: Record<string, number> = {
    soccer: 2.5, nfl: 47.5, basketball: 227.5, tennis: 23.5, cricket: 550.5,
    "ice-hockey": 6.5, rugby: 44.5, boxing: 10.5, mma: 2.5, esports: 2.5, volleyball: 4.5,
    futsal: 6.5, "table-tennis": 6.5,
  };
  const base = bases[sport] ?? 10.5;
  const adj = ((seed % 5) - 2) * (sport === "basketball" ? 2 : 0.5);
  const line = (base + adj).toFixed(1);
  return [
    { label: `O ${line}`, price: cents(seed + 7) },
    { label: `U ${line}`, price: cents(seed + 8) },
  ];
}

function pairs<T>(arr: T[]): [T, T][] {
  const out: [T, T][] = [];
  for (let i = 0; i < arr.length - 1; i += 2) {
    out.push([arr[i], arr[i + 1]]);
  }
  return out;
}

export function getGamesForSport(sportSlug: string, count = 12): GameCardData[] {
  const pool = POOLS[sportSlug] ?? POOLS["soccer"];
  // If odd length, drop last to pair cleanly
  const prepared = pool.length % 2 === 0 ? pool.slice() : pool.slice(0, -1);
  const p = pairs(prepared);

  const games: GameCardData[] = [];
  for (let i = 0; i < count; i++) {
    const [home, away] = p[i % p.length];
    const idBase = `${home.abbr.toLowerCase()}-${away.abbr.toLowerCase()}-${sportSlug}-${i+1}`;
    const isLive = i % 7 === 0; // every 7th looks live
    games.push({
      id: idBase,
      isLive,
      kickoff: kickoffFor(i),
      vol: "$0 Vol.",
      home: { abbr: home.abbr, name: home.name, record: "—", color: home.color },
      away: { abbr: away.abbr, name: away.name, record: "—", color: away.color },
      moneyline: genMoneyline(i, home, away),
      spread: genSpread(i, home, away),
      total: genTotal(i, sportSlug),
      marketsCount: String(3 + (i % 8)),
      stadium: isLive ? undefined : undefined,
      week: sportSlug === "nfl" ? `Week ${11 + (i % 6)}` : undefined,
      broadcast: sportSlug === "nfl" && (i % 3 === 0) ? "SNF" : undefined,
    } as GameCardData);
  }
  return games;
}

/* ===== Props (fun examples) ===== */
export function getPropsForSport(_sportSlug: string): PropCard[] {
  return [
    {
      id: "nfc-champ",
      icon: "🏈",
      title: "NFC Champion",
      volume: "$0 Vol.",
      rows: [
        { teamOrName: "Detroit", pct: "24%", yesPrice: "Yes 24¢", noPrice: "No 76¢" },
        { teamOrName: "Green Bay", pct: "20%", yesPrice: "Yes 20¢", noPrice: "No 80¢" },
      ],
    },
    {
      id: "sb-halftime",
      icon: "🎤",
      title: "Who performs at Super Bowl halftime?",
      volume: "$0 Vol.",
      rows: [
        { teamOrName: "Bad Bunny", pct: "92%", yesPrice: "Yes 92¢", noPrice: "No 8¢" },
        { teamOrName: "Cardi B", pct: "53%", yesPrice: "Yes 53¢", noPrice: "No 47¢" },
      ],
    },
  ];
}

/* =====================
   MAIN EMBEDDABLE VIEW
===================== */
export default function SportSection({
  sportSlug = "nfl",
  perSportCount = 12, // ← generate 10–15 (default 12)
}: {
  sportSlug?: string;
  perSportCount?: number;
}) {
  const meta =
    SPORT_CONFIG[sportSlug] ?? {
      leagueName: sportSlug.toUpperCase(),
      leagueIcon: "🏟",
      weekLabel: "This Week",
      dayLabel: "Today",
    };

  const GAMES = useMemo(() => getGamesForSport(sportSlug, perSportCount), [sportSlug, perSportCount]);
  const PROPS_DATA = useMemo(() => getPropsForSport(sportSlug), [sportSlug]);

  const [selecciones, setSelecciones] = useState<Seleccion[]>([]);
  const [currentSel, setCurrentSel] = useState<Seleccion | null>(null);

  const [activeTab, setActiveTab] = useState<"games" | "props">("games");
  const [viewMode, setViewMode] = useState<"games" | "props" | "detail">("games");
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const [showSpreads, setShowSpreads] = useState<boolean>(true);

  const handlePick = useCallback((sel: Seleccion) => {
    setSelecciones((prev) => [...prev, sel]);
    setCurrentSel(sel);
  }, []);

  const handleOpenGame = useCallback((gameId: string) => {
    setSelectedGameId(gameId);
    setViewMode("detail");
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setViewMode("games");
    setSelectedGameId(null);
  }, []);

  const handleTabChange = useCallback((tab: "games" | "props") => {
    setActiveTab(tab);
    if (tab === "games") {
      setViewMode("games");
    } else {
      setViewMode("props");
      setSelectedGameId(null);
    }
  }, []);

  const gameSelected = useMemo(() => {
    if (!selectedGameId) return null;
    return GAMES.find((g) => g.id === selectedGameId) ?? null;
  }, [selectedGameId, GAMES]);

  return (
    <>
      <div className="layout-grid">
        {/* LEFT NAV */}
        <aside className="left">
          <SideNav />
        </aside>

        {/* CENTER CONTENT */}
        <main className="main">
          <LeagueHeader
            leagueName={meta.leagueName}
            leagueIcon={meta.leagueIcon}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            showSpreads={showSpreads}
            onToggleSpreads={(next) => setShowSpreads(next)}
            weekLabel={meta.weekLabel ?? ""}
            onWeekClick={() => {
              console.log("open week dropdown");
            }}
            dayLabel={meta.dayLabel ?? ""}
            showColumns={false}
          />

          {viewMode === "games" && (
            <section className="games-stack">
              {GAMES.map((match) =>
                match.isLive ? (
                  <GameCardLive
                    key={match.id}
                    game={match}
                    onPick={handlePick}
                    onOpenGame={handleOpenGame}
                  />
                ) : (
                  <GameCardScheduled
                    key={match.id}
                    game={match}
                    onPick={handlePick}
                    onOpenGame={handleOpenGame}
                    gameDateLabel={(match as any).dateLabel ?? (match as any).week ?? "Upcoming"}
                  />
                )
              )}
            </section>
          )}

          {viewMode === "props" && <PropsGrid cards={PROPS_DATA} />}

          {viewMode === "detail" && gameSelected && (
            <GameDetailView
              game={gameSelected as any}
              onBack={handleBackFromDetail}
              onPick={handlePick}
            />
          )}
        </main>

        {/* RIGHT TICKET */}
        <aside className="right">
          <BetTicket currentSel={currentSel} />
        </aside>
      </div>

      {/* local styles */}
      <style jsx>{`
        .layout-grid {
          display: grid;
          grid-template-columns: 220px 1fr 360px;
          gap: 16px;
          padding: 16px;
          background: #ffffff;
          color: #0a1a4a;
        }

        .left {
          position: sticky;
          top: 80px;
          align-self: start;
          max-height: calc(100vh - 80px);
          overflow-y: auto;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.04);
          padding: 16px;
        }

        .main {
          min-width: 0;
          display: grid;
          row-gap: 16px;
        }

        .games-stack {
          display: grid;
          row-gap: 16px;
        }

        .right {
          min-width: 0;
        }

        @media (max-width: 1100px) {
          .layout-grid {
            grid-template-columns: 200px 1fr;
          }
          .right {
            order: 3;
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 900px) {
          .layout-grid {
            grid-template-columns: 1fr;
          }
          .left {
            position: static;
            max-height: none;
            order: 1;
            margin-bottom: 16px;
          }
          .main {
            order: 2;
          }
          .right {
            order: 3;
          }
        }
      `}</style>

      {/* globals */}
      <style jsx global>{`
        :root {
          --bg: #ffffff;
          --surface: #ffffff;
          --surface-2: #f9fafb;

          --text: #0a1a4a;
          --text-soft: #4a567a;
          --muted: #6b6f80;
          --muted-2: #8d91a6;

          --border: #d1d5db;
          --gray_light: #d1d5db;
          --gray: #6b6f80;

          --cta-bg: #1248ff;
          --cta-bg-hover: #0034c7;
          --cta-text: #ffffff;

          --slip-card-bg: #ffffff;
          --slip-card-border: rgba(0, 0, 0, 0.08);

          --green-bg: #0d6b3a;
          --green-shadow: #07361e;
          --red-bg: #c6424a;
          --red-shadow: #6d2226;
        }

        body {
          background: var(--bg);
          color: var(--text);
        }
      `}</style>
    </>
  );
}
