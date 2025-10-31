// lib/sportConfig.ts

export type SportMeta = {
  leagueName: string;     // lo que ve LeagueHeader arriba
  leagueIcon: string;     // puede ser emoji temporal o luego svg
  weekLabel?: string;     // para NFL / torneos con jornada
  dayLabel?: string;      // fecha visible en header
};

export const SPORT_CONFIG: Record<string, SportMeta> = {
  nfl: {
    leagueName: "NFL",
    leagueIcon: "🏈",
    weekLabel: "Week 8",
    dayLabel: "Sun, October 26",
  },
  soccer: {
    leagueName: "La Liga",
    leagueIcon: "⚽",
    weekLabel: "Matchday 10",
    dayLabel: "Fri, October 31",
  },
  basketball: {
    leagueName: "NBA",
    leagueIcon: "🏀",
    weekLabel: "Regular Season",
    dayLabel: "Sat, Nov 1",
  },
  mma: {
    leagueName: "UFC / MMA",
    leagueIcon: "🥋",
    weekLabel: "Fight Night",
    dayLabel: "Sat, Nov 2",
  },
  tennis: {
    leagueName: "Tennis",
    leagueIcon: "🎾",
    weekLabel: "ATP / WTA",
    dayLabel: "Today",
  },
  // ...agregas todos los demás de popularData / otherSportsData
};
