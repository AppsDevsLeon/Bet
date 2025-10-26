const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function fetchInPlay(sportKey: string) {
  const res = await fetch(`${BASE_URL}/matches/in-play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ sportKey }),
  });
  if (!res.ok) throw new Error("Error al obtener in-play");
  return res.json();
}

export async function fetchEvento(sportKey: string, fixtureId: number | string) {
  const res = await fetch(`${BASE_URL}/matches/evento`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ sportKey, fixtureId }),
  });
  if (!res.ok) throw new Error("Error al obtener evento");
  return res.json();
}
