// app/api/sgo/nfl/upcoming/route.ts
import { NextResponse } from "next/server";

const BASE = process.env.SGO_BASE_URL!;
const KEY = process.env.SGO_API_KEY!;

// Ajusta si quieres menos/más eventos o casas concretas
const DEFAULT_PARAMS = {
  leagueID: "NFL",
  oddsAvailable: "true",
  limit: "12",
  bookmakerID: "fanduel,draftkings,betmgm",
};

export async function GET() {
  if (!BASE || !KEY) {
    return NextResponse.json(
      { error: "Faltan SGO_BASE_URL o SGO_API_KEY en .env.local" },
      { status: 500 }
    );
  }

  try {
    const qs = new URLSearchParams(DEFAULT_PARAMS).toString();
    const url = `${BASE}/events?${qs}`;

    const res = await fetch(url, {
      headers: { "X-Api-Key": KEY },
      // next: { revalidate: 20 }, // opcional
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: await res.text() },
        { status: res.status }
      );
    }

    const data = await res.json();
    const items = Array.isArray(data) ? data : (data?.data ?? []);
    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "SGO error" },
      { status: 500 }
    );
  }
}
