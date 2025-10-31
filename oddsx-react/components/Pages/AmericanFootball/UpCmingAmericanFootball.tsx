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

/* ============ MOCK DATA (luego conectas API) ============ */
function getGamesForSport(sportSlug: string): GameCardData[] {
  if (sportSlug === "soccer") {
    return [
      {
        id: "rm-bar",
        isLive: true,
        liveLabel: "LIVE",
        liveClock: "2H - 69:21",
        vol: "$2.35m Vol.",
        home: {
          abbr: "BAR",
          name: "Barcelona",
          record: "6-1-1",
          rankOrSeed: "1",
          color: "#7a003c",
        },
        away: {
          abbr: "REA",
          name: "Real Madrid",
          record: "8-0-1",
          rankOrSeed: "2",
          color: "#d4af00",
        },
        moneyline: [
          { label: "REA", price: "77¢", tone: "yellow" },
          { label: "DRAW", price: "20¢" },
          { label: "BAR", price: "6¢", tone: "red" },
        ],
        spread: [
          { label: "REA -0.5", price: "97¢" },
          { label: "BAR +0.5", price: "79¢" },
        ],
        total: [
          { label: "O 3.5", price: "98¢" },
          { label: "U 3.5", price: "24¢" },
        ],
        marketsCount: "6",
      },
      {
        id: "osa-cel",
        isLive: false,
        kickoff: "11:30 AM",
        vol: "$37.83k Vol.",
        home: {
          abbr: "OSA",
          name: "Osasuna",
          record: "3-1-5",
          color: "#7a1a1a",
        },
        away: {
          abbr: "CEL",
          name: "Celta Vigo",
          record: "0-7-2",
          color: "#1e3a8a",
        },
        moneyline: [
          { label: "OSA", price: "40¢", tone: "red" },
          { label: "DRAW", price: "31¢" },
          { label: "CEL", price: "30¢", tone: "blue" },
        ],
        spread: [
          { label: "OSA -0.5", price: "42¢" },
          { label: "CEL +0.5", price: "62¢" },
        ],
        total: [
          { label: "O 2.5", price: "45¢" },
          { label: "U 2.5", price: "57¢" },
        ],
        marketsCount: "6",
      },
    ];
  }

  if (sportSlug === "nfl") {
    return [
      {
        id: "phi-dal-week10-snf",
        isLive: false,
        kickoff: "8:25 PM",
        vol: "$1.2m Vol.",
        home: {
          abbr: "DAL",
          name: "Dallas Cowboys",
          record: "5-2",
          rankOrSeed: "#3 NFC",
          color: "#1f2937", // gris oscuro tipo Cowboys
        },
        away: {
          abbr: "PHI",
          name: "Philadelphia Eagles",
          record: "6-1",
          rankOrSeed: "#1 NFC",
          color: "#065f46", // verde Eagles
        },
        moneyline: [
          { label: "PHI", price: "42¢", tone: "green" }, // visitante
          { label: "DAL", price: "58¢", tone: "blue" },  // local
        ],
        spread: [
          { label: "DAL -3.5", price: "51¢" },
          { label: "PHI +3.5", price: "49¢" },
        ],
        total: [
          { label: "O 47.5", price: "55¢" },
          { label: "U 47.5", price: "45¢" },
        ],
        marketsCount: "8",
        // opcional: puedes leer esto más adelante en GameDetailView
        stadium: "AT&T Stadium",
        week: "Week 10",
        broadcast: "SNF",
      },

      {
        id: "mia-buf-week10-afce",
        isLive: false,
        kickoff: "1:00 PM",
        vol: "$823k Vol.",
        home: {
          abbr: "BUF",
          name: "Buffalo Bills",
          record: "5-3",
          rankOrSeed: "#2 AFC East",
          color: "#003087", // azul Bills
        },
        away: {
          abbr: "MIA",
          name: "Miami Dolphins",
          record: "6-2",
          rankOrSeed: "#1 AFC East",
          color: "#008E97", // aqua Dolphins
        },
        moneyline: [
          { label: "MIA", price: "48¢", tone: "blue" }, // visitante slight dog
          { label: "BUF", price: "52¢", tone: "red" },  // local slight fav
        ],
        spread: [
          { label: "BUF -1.5", price: "54¢" },
          { label: "MIA +1.5", price: "46¢" },
        ],
        total: [
          { label: "O 51.5", price: "58¢" },
          { label: "U 51.5", price: "42¢" },
        ],
        marketsCount: "12",
        stadium: "Highmark Stadium",
        week: "Week 10",
        broadcast: "CBS",
      },

      {
        id: "kc-sf-week10-gotw",
        isLive: true,
        liveLabel: "LIVE",
        liveClock: "Q3 - 07:12",
        vol: "$2.05m Vol.",
        home: {
          abbr: "SF",
          name: "San Francisco 49ers",
          record: "7-1",
          rankOrSeed: "#1 NFC West",
          color: "#AA0000", // rojo Niners
        },
        away: {
          abbr: "KC",
          name: "Kansas City Chiefs",
          record: "7-1",
          rankOrSeed: "#1 AFC West",
          color: "#B20000", // rojo Chiefs (puedes afinar)
        },
        // en vivo normalmente no mostramos DRAW en NFL,
        // solo moneyline de cada lado
        moneyline: [
          { label: "KC", price: "44¢", tone: "red" },
          { label: "SF", price: "56¢", tone: "blue" },
        ],
        spread: [
          { label: "SF -2.5", price: "53¢" },
          { label: "KC +2.5", price: "47¢" },
        ],
        total: [
          { label: "O 49.5", price: "50¢" },
          { label: "U 49.5", price: "50¢" },
        ],
        marketsCount: "15",
        stadium: "Levi's Stadium",
        week: "Week 10",
        broadcast: "FOX",
      },
    ];
  }


  // fallback genérico si no reconoce sportSlug
  return [
    {
      id: "generic-a",
      isLive: false,
      kickoff: "10:00 AM",
      vol: "$12.3k Vol.",
      home: {
        abbr: "HOM",
        name: "Home Team",
        record: "—",
        color: "#0d6b3a",
      },
      away: {
        abbr: "AWY",
        name: "Away Team",
        record: "—",
        color: "#c6424a",
      },
      moneyline: [
        { label: "HOM", price: "60¢", tone: "green" },
        { label: "AWY", price: "40¢", tone: "red" },
      ],
      spread: [
        { label: "HOM -1.5", price: "55¢" },
        { label: "AWY +1.5", price: "45¢" },
      ],
      total: [
        { label: "O 2.5", price: "52¢" },
        { label: "U 2.5", price: "48¢" },
      ],
      marketsCount: "4",
    },
  ];
}

function getPropsForSport(_sportSlug: string): PropCard[] {
  return [
    {
      id: "nfc-champ",
      icon: "🏈",
      title: "NFC Champion",
      volume: "$1m Vol.",
      rows: [
        {
          teamOrName: "Detroit",
          pct: "24%",
          yesPrice: "Yes 24¢",
          noPrice: "No 76¢",
        },
        {
          teamOrName: "Green Bay",
          pct: "20%",
          yesPrice: "Yes 20¢",
          noPrice: "No 80¢",
        },
      ],
    },
    {
      id: "sb-halftime",
      icon: "🎤",
      title: "Who will perform at Super Bowl halftime show?",
      volume: "$302k Vol.",
      rows: [
        {
          teamOrName: "Bad Bunny",
          pct: "92%",
          yesPrice: "Yes 92¢",
          noPrice: "No 8¢",
        },
        {
          teamOrName: "Cardi B",
          pct: "53%",
          yesPrice: "Yes 53¢",
          noPrice: "No 47¢",
        },
      ],
    },
  ];
}

/* ============ COMPONENTE PRINCIPAL EMBEBIBLE ============ */
export default function NFLSection({
  sportSlug = "nfl",
}: {
  sportSlug?: string;
}) {
  // 👉 ya NO usamos params. Home decide qué liga pasa.
  const meta =
    SPORT_CONFIG[sportSlug] ?? {
      leagueName: sportSlug.toUpperCase(),
      leagueIcon: "🏟",
      weekLabel: "This Week",
      dayLabel: "Today",
    };

  const GAMES = getGamesForSport(sportSlug);
  const PROPS_DATA = getPropsForSport(sportSlug);

  // state
  const [selecciones, setSelecciones] = useState<Seleccion[]>([]);
  const [currentSel, setCurrentSel] = useState<Seleccion | null>(null);

  const [activeTab, setActiveTab] = useState<"games" | "props">("games");
  const [viewMode, setViewMode] = useState<"games" | "props" | "detail">(
    "games"
  );
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const [showSpreads, setShowSpreads] = useState<boolean>(true);

  // handlers
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
        {/* NAV IZQUIERDA */}
        <aside className="left">
          <SideNav />
        </aside>

        {/* CONTENIDO CENTRAL */}
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
              console.log("abrir dropdown semanas");
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
                    gameDateLabel={match.dateLabel ?? match.week ?? "Upcoming"}
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

        {/* TICKET DERECHA */}
        <aside className="right">
          <BetTicket currentSel={currentSel} />
        </aside>
      </div>

      {/* estilos locales */}
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

      {/* variables globales */}
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
