

const BASE = "http://localhost:3000"; // tu backend local


type SportKey = "soccer" | string;

export interface GamesReq { sportKey: SportKey }
export interface InPlayReq { sportKey: SportKey }
export interface EventReq { sportKey: SportKey; fixtureId: string }
export interface UpcomingReq { sportKey: SportKey; date: string }

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${await r.text()}`);
  return r.json();
}

export const apiSports = {
  games:    (p: GamesReq)    => postJSON<any>("games", p),
  inPlay:   (p: InPlayReq)   => postJSON<any>("games/in-play", p),
  event:    (p: EventReq)    => postJSON<any>("games/event", p),
  upcoming: (p: UpcomingReq) => postJSON<any>("games/upcoming", p),
};
