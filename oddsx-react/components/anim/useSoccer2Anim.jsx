// components/anim/useSoccer2Anim.jsx
"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { createAnimeRegistry } from "../../util/animeRegistry";

export default function useSoccer2Anim(rootRef, { autoStart = false } = {}) {
  const registryRef = useRef(createAnimeRegistry());
  const tlRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef?.current;
    if (!root) return;

    let disposed = false;

    // Helper: prepara strokeDash* y guarda longitud en dataset
    const prep = (nodeList) => {
      const arr = Array.from(nodeList);
      arr.forEach((el) => {
        const len = el.getTotalLength ? el.getTotalLength() : 0;
        el.style.strokeDasharray = `${len} ${len}`;
        el.style.strokeDashoffset = `${len}`;
        el.dataset._len = String(len);
      });
      return arr;
    };

    (async () => {
      // ✅ Import único desde "animejs" y normalización robusta
      let mod = null;
      try {
        mod = await import("animejs");
      } catch (err) {
        console.error("[useSoccer2Anim] Error importando animejs:", err);
      }
      const animeCandidates = [
        mod?.default,         // ESM default
        mod?.anime,           // named export
        mod?.default?.anime,  // nested
        mod,                  // por si el objeto es la función
      ];
      const anime = animeCandidates.find((c) => typeof c === "function");

      // Selección de nodos del SVG (ajusta si cambiaste clases)
      const linePaths  = prep(root.querySelectorAll(".soccer2_line path"));
      const extraPaths = prep(root.querySelectorAll(".soccer2_extra-line > *"));
      const fillItems  = root.querySelectorAll(".soccer2_fill > *");

      // Si no hay anime, podemos dejar al menos la animación de relleno con GSAP
      const makeDashAnim = (targets, delayStep, dur = 2000) => {
        if (!anime || !targets?.length) return null;
        return registryRef.current.add(
          anime({
            targets,
            strokeDashoffset: (el) => [Number(el.dataset._len) || 0, 0],
            easing: "easeInOutSine",
            duration: dur,
            delay: (_, i) => 1000 + i * delayStep,
            autoplay: false,
          })
        );
      };

      const step2_bodyLines = makeDashAnim(linePaths, 20, 2500);
      const step2_bodyExtra = makeDashAnim(extraPaths, 20, 1500);

      const step2_bodyTL = () => {
        const tl = gsap.timeline({
          onStart: () => {
            step2_bodyExtra?.play?.();
            step2_bodyLines?.play?.();
          },
        });

        // Aparece el relleno
        tl.fromTo(
          fillItems,
          { scale: 0, transformOrigin: "100% 100%" },
          { scale: 1, duration: 0.2, stagger: 0.03 }
        );

        // Reverso de líneas y extra, luego las reproducimos
        tl.to(fillItems, {
          duration: 1,
          onStart: () => {
            step2_bodyExtra?.reverse?.();
            step2_bodyLines?.reverse?.();
            step2_bodyExtra?.play?.();
            step2_bodyLines?.play?.();
          },
        });

        // Desaparece el relleno con un poco de delay
        tl.to(fillItems, {
          scale: 0,
          duration: 0.2,
          delay: 2,
          stagger: 0.01,
        });

        return tl;
      };

      if (!disposed) {
        tlRef.current = gsap.timeline({ paused: true }).add(step2_bodyTL(), "start");
        if (autoStart) requestAnimationFrame(() => tlRef.current?.restart(true));
      }
    })();

    return () => {
      disposed = true;
      // Limpieza
      registryRef.current.all.forEach((inst) => inst?.pause?.());
      registryRef.current.clear();
      tlRef.current?.kill?.();
      tlRef.current = null;
    };
  }, [rootRef, autoStart]);

  const play = () => tlRef.current?.restart(true);
  const pause = () => tlRef.current?.pause();
  const reset = () => tlRef.current?.seek(0).pause();

  return { play, pause, reset, timeline: tlRef };
}
