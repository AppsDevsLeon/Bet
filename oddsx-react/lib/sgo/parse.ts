// lib/sgo/parse.ts
export type SgoEvent = Record<string, any>;

type MarketPick = {
  moneyline?: { home?: number; away?: number };
  spread?:    { home?: number; away?: number; points?: number };
  total?:     { over?: number; under?: number; points?: number };
};

export function pickMainMarkets(ev: SgoEvent): MarketPick {
  const oddsObj = ev?.odds || {};
  const keys = Object.keys(oddsObj);
  const out: MarketPick = {};
  const has = (k: string, s: string) => k.toLowerCase().includes(s);

  // moneyline
  const mlKey = keys.find(k => has(k, "moneyline"));
  if (mlKey) {
    const ml = oddsObj[mlKey];
    out.moneyline = {
      home: ml?.home?.price ?? ml?.homeOdds ?? ml?.homePrice,
      away: ml?.away?.price ?? ml?.awayOdds ?? ml?.awayPrice,
    };
  }

  // spread
  const spKey = keys.find(k => has(k, "spread"));
  if (spKey) {
    const sp = oddsObj[spKey];
    out.spread = {
      points: sp?.points ?? sp?.line ?? sp?.handicap,
      home: sp?.home?.price ?? sp?.homeOdds ?? sp?.homePrice,
      away: sp?.away?.price ?? sp?.awayOdds ?? sp?.awayPrice,
    };
  }

  // total (over/under)
  const totKey = keys.find(k => has(k, "total") || has(k, "ou"));
  if (totKey) {
    const tot = oddsObj[totKey];
    out.total = {
      points: tot?.points ?? tot?.line,
      over: tot?.over?.price ?? tot?.overOdds,
      under: tot?.under?.price ?? tot?.underOdds,
    };
  }
  return out;
}

export function safeGet<T=any>(obj: any, path: string, fallback?: T): T | undefined {
  try {
    return path.split(".").reduce((a, k) => (a ? a[k] : undefined), obj) ?? fallback;
  } catch {
    return fallback;
  }
}
