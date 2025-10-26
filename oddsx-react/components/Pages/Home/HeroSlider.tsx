"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// Iconos
import {
  IconBallFootball,
  IconBell,
  IconStar,
} from "@tabler/icons-react";

/* ============================
   Tipos
   ============================ */
type Moneyline = { home: number; draw?: number; away: number };
type TeamInfo = { name: string; icon: string };
type OutcomeKey = "home" | "draw" | "away";

type MatchItem = {
  id: string;
  league: string;
  startISO: string;
  live?: boolean;
  minute?: number;
  referee?: string;
  home: TeamInfo;
  away: TeamInfo;
  scoreHome: number;
  scoreAway: number;
  moneyline: Moneyline;
};

/* ============================
   Mock data
   ============================ */
const MATCHES_JSON: MatchItem[] = [
  {
    id: "epl-chel-liv-001",
    league: "Premier League",
    startISO: "2025-02-02T00:00:00Z",
    live: true,
    minute: 72,
    referee: "Joseph Hicks",
    home: { name: "Chelsea", icon: "/images/icon/chealse.png" },
    away: { name: "Liverpool", icon: "/images/icon/liverpool.png" },
    scoreHome: 2,
    scoreAway: 0,
    moneyline: { home: 1.87, draw: 3.4, away: 2.1 },
  },
  {
    id: "epl-mci-ars-002",
    league: "Premier League",
    startISO: "2025-02-02T02:00:00Z",
    live: false,
    minute: undefined,
    referee: "Michael Oliver",
    home: { name: "Man City", icon: "/images/icon/mancity.png" },
    away: { name: "Arsenal", icon: "/images/icon/arsenal.png" },
    scoreHome: 0,
    scoreAway: 0,
    moneyline: { home: 1.95, draw: 3.6, away: 2.25 },
  },
  {
    id: "laliga-rma-fcb-003",
    league: "LaLiga",
    startISO: "2025-02-02T20:00:00Z",
    live: true,
    minute: 54,
    referee: "Jesús Gil",
    home: { name: "Real Madrid", icon: "/images/icon/realmadrid.png" },
    away: { name: "Barcelona", icon: "/images/icon/barcelona.png" },
    scoreHome: 2,
    scoreAway: 2,
    moneyline: { home: 2.05, draw: 3.55, away: 2.05 },
  },
  {
    id: "seriea-juv-int-004",
    league: "Serie A",
    startISO: "2025-02-03T19:30:00Z",
    live: false,
    minute: undefined,
    referee: "Daniele Orsato",
    home: { name: "Juventus", icon: "/images/icon/juventus.png" },
    away: { name: "Inter", icon: "/images/icon/inter.png" },
    scoreHome: 0,
    scoreAway: 0,
    moneyline: { home: 2.2, draw: 3.2, away: 2.1 },
  },
  {
    id: "ligue1-psg-oly-005",
    league: "Ligue 1",
    startISO: "2025-02-04T19:00:00Z",
    live: true,
    minute: 12,
    referee: "Clément Turpin",
    home: { name: "PSG", icon: "/images/icon/psg.png" },
    away: { name: "Lyon", icon: "/images/icon/lyon.png" },
    scoreHome: 2,
    scoreAway: 0,
    moneyline: { home: 1.65, draw: 3.9, away: 3.2 },
  },
  {
    id: "erediv-aja-psv-006",
    league: "Eredivisie",
    startISO: "2025-02-04T21:00:00Z",
    live: false,
    minute: undefined,
    referee: "Danny Makkelie",
    home: { name: "Ajax", icon: "/images/icon/ajax.png" },
    away: { name: "PSV", icon: "/images/icon/psv.png" },
    scoreHome: 0,
    scoreAway: 0,
    moneyline: { home: 2.4, draw: 3.6, away: 1.95 },
  },
];

/* ============================
   Utils
   ============================ */
function formatKickoff(iso: string) {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, "0");
  const monthShort = d.toLocaleString("en-GB", { month: "short" }); // Feb
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${day} ${monthShort} at ${hh}:${mm}`;
}

/* ============================
   Sub-card (una tarjeta)
   ============================ */
function MatchSlideCard({
  match,
  selected,
  onSelect,
}: {
  match: MatchItem;
  selected: OutcomeKey | null;
  onSelect: (key: OutcomeKey) => void;
}) {
  const odds = [
    { key: "home" as const, label: "1", value: match.moneyline.home },
    ...(match.moneyline.draw !== undefined
      ? [{ key: "draw" as const, label: "X", value: match.moneyline.draw }]
      : []),
    { key: "away" as const, label: "2", value: match.moneyline.away },
  ];

  const minuteVisible = match.live && typeof match.minute === "number";
  const minuteClass = minuteVisible ? "minute" : "minute is-empty";

  return (
    <div className="match-card">
      {/* HEADER */}
      <div className="mc-header">
        <div className="mc-left">
          {match.live && <span className="mc-live">Live</span>}
          <IconBallFootball size={16} />
          <span className="mc-league">{match.league}</span>
        </div>
        <div className="mc-actions">
          <button className="btn-icon" aria-label="Notify">
            <IconBell size={16} />
          </button>
          <button className="btn-icon" aria-label="Favorite">
            <IconStar size={16} />
          </button>
        </div>
      </div>

      {/* MAIN (body + footer abajo fijo) */}
      <div className="mc-main">
        {/* BODY */}
        <div className="mc-body">
          {/* HOME */}
          <div className="team">
            <div className="badge-ring">
              <Image
                src={match.home.icon}
                alt={`${match.home.name} logo`}
                width={48}
                height={48}
              />
            </div>
            <div className="team-label">{match.home.name}</div>
          </div>

          {/* CENTER */}
          <div className="center-col">
            <div className="kickoff">{formatKickoff(match.startISO)}</div>

            <div className="score">
              <span className="home">{match.scoreHome}</span>
              <span className="sep">:</span>
              <span className="away">{match.scoreAway}</span>
            </div>

            <div className={minuteClass}>
              {minuteVisible ? `${match.minute}’` : ""}
            </div>

            <div className="meta">
              {match.referee ? (
                <>
                  Referee: <strong>{match.referee}</strong>
                </>
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </div>

          {/* AWAY */}
          <div className="team">
            <div className="badge-ring">
              <Image
                src={match.away.icon}
                alt={`${match.away.name} logo`}
                width={48}
                height={48}
              />
            </div>
            <div className="team-label">{match.away.name}</div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mc-footer">
          <div className="odds-group">
            {odds.map((o) => (
              <button
                key={o.key}
                type="button"
                className={`odd-btn ${
                  selected === o.key ? "is-selected" : ""
                }`}
                onClick={() => {
                  onSelect(o.key);
                }}
              >
                {o.label} {o.value.toFixed(2)}
              </button>
            ))}
          </div>

          <button
            className="cta-bet"
            disabled={!selected}
            onClick={() => {
              console.log("BET:", match.id, selected);
            }}
          >
            Place a bet
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================
   Slider principal
   ============================ */
export default function TopSlider() {
  const matches = useMemo(() => MATCHES_JSON, []);
  const [selected, setSelected] = useState<Record<string, OutcomeKey | null>>(
    {}
  );

  const toggleSelect = (matchId: string, key: OutcomeKey) => {
    setSelected((prev) => {
      const curr = prev[matchId] ?? null;
      const next = curr === key ? null : key;
      return { ...prev, [matchId]: next };
    });
  };

  return (
    <>
      <section className="hero_area pb-5">
        <div
          className="container-fluid w-95vw-center"
          style={{
            width: "95vw",
            margin: "0 auto",
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          <div className="row">
            <div className="col-12 gx-0">
              <div className="hero_area__main">
                <div className="row w-100 m-0 p-0">
                  <div className="col-12">
                    <div className="live-playing">
                      <Swiper
                        className="slider_hero"

                        /* 👇 autoplay cada 2 segundos */
                        loop={true}
                        speed={400}
                        autoplay={{
                          delay: 2000,
                          disableOnInteraction: false,
                        }}

                        slidesPerView={"auto"}
                        centeredSlides={false}
                        modules={[Autoplay]}
                        allowTouchMove
                        breakpoints={{
                          0:    { slidesPerView: "auto", spaceBetween: 12 },
                          480:  { slidesPerView: "auto", spaceBetween: 12 },
                          768:  { slidesPerView: "auto", spaceBetween: 14 },
                          1200: { slidesPerView: "auto", spaceBetween: 16 },
                        }}
                      >
                        {matches.map((m) => (
                          <SwiperSlide
                            key={m.id}
                            className="match-slide-wrapper"
                          >
                            <MatchSlideCard
                              match={m}
                              selected={selected[m.id] ?? null}
                              onSelect={(key) => toggleSelect(m.id, key)}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* corrección de padding lateral */}
      <style jsx>{`
        .w-95vw-center {
          width: 95vw !important;
          max-width: 95vw !important;
        }
        .hero_area .container-fluid,
        .hero_area__main {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
      `}</style>
    </>
  );
}
