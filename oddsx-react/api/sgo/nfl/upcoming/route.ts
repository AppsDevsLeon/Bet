import { NextResponse } from "next/server";

const BASE = process.env.SGO_BASE_URL!;
const KEY = process.env.SGO_API_KEY!;

const DEFAULT_PARAMS = {
  leagueID: "NFL",
  oddsAvailable: "true",
  limit: "12",
  // prueba con 1–2 casas para respuesta más chica
  bookmakerID: "fanduel,draftkings",
};

export async function GET() {
  try {
    if (!BASE || !KEY) {
      console.error("[SGO][SERVER] Faltan env vars", { BASE: !!BASE, KEY: !!KEY });
      return NextResponse.json(
        { error: "Faltan SGO_BASE_URL o SGO_API_KEY en .env.local" },
        { status: 500 }
      );
    }

    const qs = new URLSearchParams(DEFAULT_PARAMS).toString();
    const url = `${BASE}/events?${qs}`;
    console.log("[SGO][SERVER] Fetching:", url);

    const res = await fetch(url, { headers: { "X-Api-Key": KEY } });
    console.log("[SGO][SERVER] Status:", res.status);

    const text = await res.text();
    // intenta parsear el JSON, pero guarda el texto crudo por si hay HTML/error
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      console.error("[SGO][SERVER] Res no-JSON:", text.slice(0, 500));
      return NextResponse.json({ error: "Respuesta no JSON", raw: text }, { status: 502 });
    }

    // Normaliza items
    const items = Array.isArray(json) ? json : (json?.data ?? []);
    console.log("[SGO][SERVER] items.length:", items?.length ?? null);
    if (items?.length) {
      console.log("[SGO][SERVER] Ejemplo item[0] keys:", Object.keys(items[0] || {}));
    }

    return NextResponse.json({ items, _debug: { status: res.status } });
  } catch (e: any) {
    console.error("[SGO][SERVER] Exception:", e?.message, e);
    return NextResponse.json(
      { error: e?.message || "SGO error" },
      { status: 500 }
    );
  }
}
