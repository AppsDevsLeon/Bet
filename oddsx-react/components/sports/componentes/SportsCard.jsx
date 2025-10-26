"use client";
import { useEffect } from "react";

/**
 * Contenedor para animaciones SVG con JSON (animejs + gsap).
 * Props:
 *  - config: { id, svgId, scripts, init }
 *  - children: <svg> con id === config.svgId
 */
export default function SportsCard({ config, children }) {
  useEffect(() => {
    if (typeof window === "undefined" || !config) return;

    // Shim para gsap v3 → alias v2 que esperan tus scripts
    try {
      const w = window;
      if (w.gsap && !w.TweenMax) w.TweenMax = w.gsap;
      if (w.gsap && !w.TimelineMax) w.TimelineMax = (opts) => w.gsap.timeline(opts);
      if (w.gsap && !w.Power4) w.Power4 = { easeOut: "power4.out" };
      if (w.gsap && !w.Expo)   w.Expo   = { easeOut: "expo.out" };
      if (w.gsap && !w.Bounce) w.Bounce = { easeOut: "bounce.out" };
    } catch {}

    try {
      const fn = new Function(config.scripts);
      fn();
      if (typeof window[config.init] === "function") {
        window[config.init]();
      }
    } catch (e) {
      console.error("SportsCard init error:", e);
    }
  }, [config]);

  return (
    <div className="relative rounded-xl overflow-hidden border p-3 bg-transparent">
      {children}
    </div>
  );
}
