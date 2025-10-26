// components/anim/useSoccer1Anim.jsx
"use client";
import { useEffect, useRef } from "react";
import { gsap, Power4, Expo, Bounce } from "gsap";
import { createAnimeRegistry } from "@/util/animeRegistry";

export default function useSoccer1Anim(rootRef, { autoStart = false } = {}) {
  const registryRef = useRef(createAnimeRegistry());
  const tlRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard
    const root = rootRef.current;
    if (!root) return;

    gsap.set(root, { opacity: 1 });

    let disposed = false;

    // util: prepara strokeDash* y devuelve nodos
    const prep = (els) => {
      const arr = Array.from(els);
      arr.forEach((el) => {
        const len = el.getTotalLength ? el.getTotalLength() : 0;
        el.style.strokeDasharray = `${len} ${len}`;
        el.style.strokeDashoffset = `${len}`;
        el.dataset._len = String(len);
      });
      return arr;
    };

    (async () => {
      // ✅ Import ÚNICO desde "animejs" (sin subpaths)
      let mod = null;
      try {
        mod = await import("animejs");
      } catch (err) {
        console.error("[useSoccer1Anim] Error importando animejs:", err);
        mod = null;
      }

      // Normalización robusta para obtener la función anime()
      const animeCandidates = [
        mod?.default,         // ESM default
        mod?.anime,           // algunos bundles exponen named export
        mod?.default?.anime,  // otros lo anidan en default.anime
        mod,                  // por si el propio objeto es la función
      ];
      const anime = animeCandidates.find((c) => typeof c === "function");

      if (disposed) return;

      if (!anime) {
        console.warn("[useSoccer1Anim] animejs no devolvió una función; se omite trazo de líneas.");
      }

      // Selecciones (asegúrate que tu SVG conserva estas clases)
      const extraEls = prep(root.querySelectorAll(".soccer1_extra-line > *"));
      const bodyEls  = prep(root.querySelectorAll(".soccer1_line > *"));
      const ballEls  = prep(root.querySelectorAll(".soccer1ball > .soccer1ball-line > *"));

      // Helpers para arrancar anime si existe
      const makeDashAnim = (targets, delayStep) => {
        if (!anime || !targets?.length) return null;
        return registryRef.current.add(
          anime({
            targets,
            strokeDashoffset: (el) => [Number(el.dataset._len) || 0, 0],
            easing: "easeInOutSine",
            duration: 500,
            delay: (_, i) => 1000 + i * delayStep,
            autoplay: false,
          })
        );
      };

      const backLines = makeDashAnim(extraEls, 50);
      const bodyLines = makeDashAnim(bodyEls, 20);
      const ballLines = makeDashAnim(ballEls, 140);

      const step1_ballTL = () => {
        const tl = gsap.timeline({ onStart: () => ballLines?.play?.() });
        tl.fromTo(".soccer1ball > g:nth-child(1) > *",
          { scale: 0 },
          { scale: 1, duration: 0.5, stagger: 0.2 }
        ).to(".soccer1ball", {
          rotation: 760, x: 2000, transformOrigin: "50% 50%",
          ease: Expo.easeOut, duration: 3, delay: 1
        }).to(".soccer1ball", { autoAlpha: 0, duration: 1 }, "<");
        return tl;
      };

      const step1_backTL = () => {
        const tl = gsap.timeline({
          onStart: () => backLines?.play?.(),
          onComplete: () => {
            backLines?.reverse?.(); backLines?.play?.();
            gsap.to(".soccer1_extra-line > g", {
              scale: 0, transformOrigin: "50% 50%",
              ease: Bounce.easeOut, duration: 1, stagger: 0.2
            });
          }
        });
        tl.fromTo(".soccer1_extra-line > g",
          { x: -3500, rotation: -1000, transformOrigin: "50% 50%" },
          { x: 0, rotation: 0, ease: Power4.easeOut, duration: 1, stagger: 0.5 }
        );
        return tl;
      };

      const step1_bodyTL = () => {
        const tl = gsap.timeline({
          onStart: () => bodyLines?.play?.(),
          onComplete: () => {
            bodyLines?.reverse?.();
            setTimeout(() => {
              gsap.to(".soccer1_fill > *", {
                scale: 0, transformOrigin: "50% 50%", duration: 0.2, stagger: 0.01
              });
            }, 2000);
          }
        });
        tl.fromTo(".soccer1_fill > *",
          { x: -4500 },
          { x: 0, duration: 0.3, stagger: 0.03, ease: Expo.easeOut }
        );
        return tl;
      };

      if (!disposed) {
        tlRef.current = gsap.timeline({ paused: true })
          .add(step1_bodyTL(), "step1")
          .add(step1_backTL(), "step1")
          .add(step1_ballTL(), "step1");

        if (autoStart) {
          requestAnimationFrame(() => tlRef.current?.restart(true));
        }
      }
    })();

    return () => {
      disposed = true;
      registryRef.current.all.forEach((inst) => inst?.pause?.());
      registryRef.current.clear();
      tlRef.current?.kill?.();
      tlRef.current = null;
    };
  }, [rootRef, autoStart]);

  const play  = () => tlRef.current?.restart(true);
  const pause = () => tlRef.current?.pause();
  const reset = () => tlRef.current?.seek(0).pause();

  return { play, pause, reset, timeline: tlRef };
}
