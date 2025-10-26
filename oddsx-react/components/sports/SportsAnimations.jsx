// src/components/SportsAnimations.jsx
import React, { useEffect } from "react";

// Importa los SVG convertidos a componentes (los que ya separaste)
import Soccer1 from "./Soccer1";
import Soccer2 from "./Soccer2";
import Basket from "./Basket";

// Importa GSAP y Anime.js
import { TimelineMax, TweenMax, Expo, Power4, Bounce } from "gsap";
import anime from "animejs";

export default function SportsAnimations() {
  useEffect(() => {
    // === Animaciones principales ===

    // Animaciones de Soccer1
    const backLines = anime({
      targets: ".soccer1_extra-line > *",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 500,
      delay: (el, i) => 1000 + i * 50,
      autoplay: false,
    });

    const bodyLines = anime({
      targets: ".soccer1_line > *",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 500,
      delay: (el, i) => 1000 + i * 20,
      autoplay: false,
    });

    const ballLines = anime({
      targets: ".soccer1ball > .soccer1ball-line > *",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 500,
      delay: (el, i) => 1000 + i * 140,
      autoplay: false,
    });

    function step1_ballTL() {
      const ball = new TimelineMax({
        onStart: () => ballLines.play(),
      });
      ball
        .staggerFromTo(
          ".soccer1ball > g:nth-child(1) > *",
          0.5,
          { scale: 0 },
          { scale: 1 },
          0.2
        )
        .to(".soccer1ball", 3, {
          rotation: 760,
          x: 2000,
          transformOrigin: "50% 50%",
          ease: Expo.easeOut,
          delay: 1,
        })
        .to(".soccer1ball", 1, { autoAlpha: 0 }, "-=1");
      return ball;
    }

    // Puedes pegar aquí las otras funciones step1_backTL, step1_bodyTL, step2_bodyTL, step3_bodyTL
    // directamente de tu script.js:contentReference[oaicite:2]{index=2}

    // Timeline principal
    const mainTL = new TimelineMax({});
    function init() {
      mainTL
        .add(step1_ballTL(), "step1")
        // .add(step1_backTL(), "step1")
        // .add(step1_bodyTL(), "step1")
        // .add(hide("#soccer1"), "step2")
        // .add(show("#soccer2"), "step3")
        // .add(step2_bodyTL(), "step4")
        // .add(hide("#soccer2"), "step5")
        // .add(show("#basket"), "step6")
        // .add(step3_bodyTL(), "step7")
    }

    init();
  }, []);

  return (
    <div className="sports-container">
      <Soccer1 />
      <Soccer2 />
      <Basket />
    </div>
  );
}
