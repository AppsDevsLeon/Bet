"use client";
import React, { useState } from "react";
import { apiSports } from "@/lib/apiSports"; // ajusta la ruta

export default function UpcomingByDate() {
  const [date, setDate] = useState("2025-09-16");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function buscar() {
    setLoading(true); setErr("");
    try {
      const data = await apiSports.upcoming({ sportKey: "soccer", date });
      const arr = Array.isArray(data) ? data : (data?.result ?? data?.response ?? data?.fixtures ?? []);
      setItems(arr);
    } catch (e: any) {
      setErr(e?.message ?? "Error al cargar próximos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end">
        <div>
          <label className="block text-sm">Fecha (AAAA-MM-DD)</label>
          <input
            className="border rounded-lg px-3 py-2"
            value={date}
            onChange={e => setDate(e.target.value)}
            placeholder="2025-09-16"
          />
        </div>
        <button className="h-10 px-4 rounded-lg border" onClick={buscar} disabled={loading}>
          {loading ? "Buscando..." : "Buscar próximos"}
        </button>
      </div>

      {err && <p className="text-red-600">{err}</p>}

      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, idx) => {
          const fx = it.fixture ?? {};
          const tm = it.teams ?? {};
          const league = it.league?.name ?? `League ${it.league?.id ?? ""}`.trim();
          const home = tm.home?.name ?? tm.home ?? "Home";
          const away = tm.away?.name ?? tm.away ?? "Away";
          return (
            <li key={fx.id ?? idx} className="p-4 rounded-2xl border">
              <div className="text-sm opacity-70">{league} • {fx.date ?? "-"}</div>
              <div className="mt-1 text-lg font-medium">{home} vs {away}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
