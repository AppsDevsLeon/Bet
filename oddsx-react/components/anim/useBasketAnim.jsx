// src/anim/useBasketAnim.js
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import anime from "animejs";
import { createAnimeRegistry } from "@/util/animeRegistry";

export default function useBasketAnim(rootRef) {
  const registryRef = useRef(createAnimeRegistry());
  const tlRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if(!root) return;

    const step3_bodyLines = registryRef.current.add(anime({
      targets: ".basket_extra-line > *",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 1500,
      delay: (_, i) => i * 20,
      autoplay: false
    }));

    const step3_extraLines = registryRef.current.add(anime({
      targets: ".basket_line > *",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 3500,
      delay: (_, i) => i * 20,
      autoplay: false
    }));

    const step3_bodyTL = () => {
      const tl = gsap.timeline({ onStart: () => { step3_bodyLines.play(); step3_extraLines.play(); } });
      tl.fromTo(".basket_fill > *",
        { scale: 0, y: 300, transformOrigin: "0% 0%" },
        { scale: 1, y: 0, duration: 0.3, stagger: -0.008 }
      );
      return tl;
    };

    tlRef.current = gsap.timeline({ paused: true }).add(step3_bodyTL(), "start");

    return () => {
      registryRef.current.all.forEach(inst => inst.pause && inst.pause());
      registryRef.current.clear();
      tlRef.current && tlRef.current.kill();
      tlRef.current = null;
    }
  }, [rootRef]);

  const play = () => tlRef.current && tlRef.current.restart(true);
  const pause = () => tlRef.current && tlRef.current.pause();
  const reset = () => tlRef.current && tlRef.current.seek(0).pause();

  return { play, pause, reset, timeline: tlRef };
}
