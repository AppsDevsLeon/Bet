"use client";
import { useEffect, useState, useRef } from "react";

export function useInPlay(sportKey: string, intervalMs = 20000) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  async function load() {
    try {
      setError(null);
      const res = await fetch("/api/in-play", {          // ← Opción A (proxy)
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sportKey }),
        cache: "no-store",
      });
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (e: any) {
      setError(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, intervalMs);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [sportKey, intervalMs]);

  return { data, loading, error };
}
