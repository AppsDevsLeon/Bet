"use client";
import React, { useEffect, useState } from "react";
// Usa la ruta que corresponda a TU árbol de carpetas:
import { apiSports } from "@/lib/apiSports"; // o "../../lib/apiSports" / "@/lib/apiSports"

export default function LiveInPlay() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true); setErr("");
      try {
        const data = await apiSports.inPlay({ sportKey: "soccer" });
        setItems(Array.isArray(data) ? data : data?.response ?? data ?? []);
      } catch (e: any) {
        setErr(e?.message ?? "Error al cargar en vivo");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Cargando en vivo…</p>;
  if (err) return <p className="text-red-600">{err}</p>;

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold">Partidos en vivo</h3>
      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => {
          const id = it?.fixture?.id ?? `row-${i}`;
          const home = it?.teams?.home?.name ?? it?.teams?.home ?? "Home";
          const away = it?.teams?.away?.name ?? it?.teams?.away ?? "Away";
          const league = it?.league?.name ?? `League ${it?.league?.id ?? ""}`.trim();

          return (
            <li key={String(id)} className="p-4 rounded-2xl border">
              <div className="text-sm opacity-70">{league} • season {it?.league?.season ?? "-"}</div>
              <div className="mt-1 text-lg font-medium">{home} vs {away}</div>
              <button
                className="mt-3 px-3 py-1 rounded-xl border hover:bg-gray-50"
                onClick={async () => {
                  try {
                    const r = await apiSports.event({ sportKey: "soccer", fixtureId: String(id) });
                    console.log("Cuotas evento", id, r);
                    alert("Cuotas recibidas (ver consola)");
                  } catch (e: any) {
                    alert(e?.message ?? "Error al cargar cuotas");
                  }
                }}
              >
                Ver cuotas
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
