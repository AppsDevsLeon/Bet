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

/* ========== DATA DEMO PARTIDOS ========== */
const GAMES: GameCardData[] = [
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

  {
    id: "bet-atm",
    isLive: false,
    kickoff: "2:00 PM",
    vol: "$3.70k Vol.",
    home: {
      abbr: "BET",
      name: "Real Betis",
      record: "4-4-1",
      color: "#0d6b3a",
    },
    away: {
      abbr: "MAD",
      name: "Atletico Madrid",
      record: "4-4-1",
      color: "#c6424a",
    },
    moneyline: [
      { label: "BET", price: "30¢", tone: "green" },
      { label: "DRAW", price: "27¢" },
      { label: "MAD", price: "45¢", tone: "red" },
    ],
    spread: [
      { label: "BET +0.5", price: "57¢" },
      { label: "MAD -0.5", price: "46¢" },
    ],
    total: [
      { label: "O 2.5", price: "56¢" },
      { label: "U 2.5", price: "48¢" },
    ],
    marketsCount: "6",
  },
];

/* ========== DATA DEMO PROPS ========== */
const PROPS_DATA: PropCard[] = [
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

/* ========== PAGE COMPONENT ========== */
export default function LeaguePage() {
  // todas las selecciones que el user clickeó
  const [selecciones, setSelecciones] = useState<Seleccion[]>([]);

  // selección actualmente mostrada en el ticket derecho
  const [currentSel, setCurrentSel] = useState<Seleccion | null>(null);

  // "games" | "props"
  const [activeTab, setActiveTab] = useState<"games" | "props">("games");

  // "games" | "props" | "detail"
  const [viewMode, setViewMode] = useState<"games" | "props" | "detail">(
    "games"
  );

  // partido que abrimos en detalle
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  // switch azul del header
  const [showSpreads, setShowSpreads] = useState<boolean>(true);

  /* handlers */

  // cuando hago click en una pill de apuesta
  const handlePick = useCallback((sel: Seleccion) => {
    setSelecciones((prev) => [...prev, sel]);
    setCurrentSel(sel);
  }, []);

  // abrir detalle
  const handleOpenGame = useCallback((gameId: string) => {
    setSelectedGameId(gameId);
    setViewMode("detail");
  }, []);

  // volver desde el detalle
  const handleBackFromDetail = useCallback(() => {
    setViewMode("games");
    setSelectedGameId(null);
  }, []);

  // cambio de tab (Games / Props)
  const handleTabChange = useCallback((tab: "games" | "props") => {
    setActiveTab(tab);
    if (tab === "games") {
      setViewMode("games");
    } else {
      setViewMode("props");
      setSelectedGameId(null);
    }
  }, []);

  // partido seleccionado para el detail
  const gameSelected = useMemo(() => {
    if (!selectedGameId) return null;
    return GAMES.find((g) => g.id === selectedGameId) ?? null;
  }, [selectedGameId]);

  return (
    <>
      <div className="layout-grid">
        {/* NAV IZQUIERDA */}
        <aside className="left">
          <SideNav />
        </aside>

        {/* CENTRO */}
        <main className="main">
          {/* HEADER tipo NFL/NBA */}
          <LeagueHeader
            leagueName="NFL"
            leagueIcon={"🏈"} // cámbialo por logo svg si quieres
            activeTab={activeTab}
            onTabChange={handleTabChange}
            showSpreads={showSpreads}
            onToggleSpreads={(next) => setShowSpreads(next)}
            weekLabel="Week 8"
            onWeekClick={() => {
              console.log("abrir dropdown semanas");
            }}
            dayLabel="Sun, October 26"
            // en fútbol-style cards no usamos las columnas MONEYLINE/SPREAD/TOTAL arriba,
            // así que las ocultamos
            showColumns={false}
          />

          {/* CONTENIDO PRINCIPAL */}
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

        {/* PANEL DERECHO (Ticket Buy/Sell) */}
        <aside className="right">
          <BetTicket currentSel={currentSel} />
        </aside>
      </div>

      {/* LAYOUT STYLES */}
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

      {/* THEME GLOBAL light */}
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
