"use client";

import Link from "next/link";
import React, { useMemo, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade"
/* Tus componentes */
import Soccer1 from "@/components/sports/Soccer1";
import Soccer2 from "@/components/sports/Soccer2";
import Basket from "@/components/sports/Basket";

/* Mapa tipo->componente */
const compMap = { soccer1: Soccer1, soccer2: Soccer2, basket: Basket };

/* ⬇️ Selectores de TUS dos headers fijos (ajusta si usas otros) */
const HEADER_SELECTORS = [
  ".topbar-blue",              // barra azul fija (arriba del todo)
  ".header-section2 .navbar",  // navbar blanca fija
];

export default function Home() {
  const sliderGroups = useMemo(
    () => [
      {
        id: "top-works",
        slides: [
          { type: "soccer2", href: "#", alt: "Soccer 2", title: "SPORTS" },
          { type: "basket", href: "#", alt: "Basket", title: "BASKETBALL" },
          { type: "soccer1", href: "#", alt: "Soccer 1", title: "SOCCER" },
        ],
      },
    ],
    []
  );

  const baseOptions = useMemo(
    () => ({
      modules: [Autoplay, EffectFade],
      loop: true,
      centeredSlides: true,
      slidesPerView: 1,
      spaceBetween: 0,
      effect: "fade",
      fadeEffect: { crossFade: true },
      autoplay: { delay: 3000, disableOnInteraction: false },
      allowTouchMove: true,
    }),
    []
  );

  const slideRefsPerGroup = useMemo(
    () => sliderGroups.map((g) => g.slides.map(() => React.createRef())),
    [sliderGroups]
  );
  const swiperRefs = useRef(Array(sliderGroups.length).fill(null));

  /* 🧠 Mide la altura combinada de headers fijos y la mete en --header-h */
  useEffect(() => {
    const docEl = document.documentElement;

    const calcHeaderHeight = () => {
      let total = 0;
      for (const sel of HEADER_SELECTORS) {
        const el = document.querySelector(sel);
        if (!el) continue;
        const cs = getComputedStyle(el);
        // Solo sumamos si son fijos/sticky (los que “tapan” el contenido)
        if (cs.position === "fixed" || cs.position === "sticky") {
          total += el.getBoundingClientRect().height || 0;
        }
      }
      // Añade safe-area (iOS notch) si aplica
      const safeTop = parseFloat(getComputedStyle(docEl).getPropertyValue("--sat")) || 0;
      docEl.style.setProperty("--header-h", `${total + safeTop}px`);
    };

    // recalcular en resize / cambios de fuente
    const ro = new ResizeObserver(calcHeaderHeight);
    HEADER_SELECTORS.forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) ro.observe(el);
    });
    window.addEventListener("resize", calcHeaderHeight);
    // primer cálculo (tras pintar)
    setTimeout(calcHeaderHeight, 0);
    requestAnimationFrame(calcHeaderHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calcHeaderHeight);
    };
  }, []);

  useEffect(() => {
    const swp = swiperRefs.current[0];
    if (!swp) return;
    const r = slideRefsPerGroup[0][swp.activeIndex]?.current;
    r?.reset?.();
    r?.play?.();
  }, [slideRefsPerGroup]);

  return (
    <>
      <div className="below-header">
        {/* (Opcional) Rail redes */}
        <aside className="social-rail" aria-hidden="true">
          <a href="#" aria-label="Facebook"><i className="ti ti-brand-facebook" /></a>
          <a href="#" aria-label="Instagram"><i className="ti ti-brand-instagram" /></a>
          <a href="#" aria-label="YouTube"><i className="ti ti-brand-youtube" /></a>
          <a href="#" aria-label="X/Twitter"><i className="ti ti-brand-x" /></a>
        </aside>

        {/* Hero fullscreen real */}
        <div className="slider-hero">
          {sliderGroups.map((group, gi) => {
            const options = {
              ...baseOptions,
              onSwiper: (swp) => (swiperRefs.current[gi] = swp),
              onInit: (swp) => {
                const r = slideRefsPerGroup[gi][swp.activeIndex]?.current;
                r?.reset?.(); r?.play?.();
              },
              onSlideChange: (swp) => {
                const r = slideRefsPerGroup[gi][swp.activeIndex]?.current;
                r?.reset?.(); r?.play?.();
              },
            };

            return (
              <div key={group.id} className="slider-block">
                <Swiper {...options} className="swiper-fade hero-swiper">
                  {group.slides.map((s, si) => {
                    const Comp = compMap[s.type] || null;
                    const refForSlide = slideRefsPerGroup[gi][si];

                    return (
                      <SwiperSlide key={`${group.id}-${si}`}>
                        {/* Watermark detrás */}
                        <div className="back-title" aria-hidden="true">
                          {(s.title || s.alt || "").toUpperCase()}
                        </div>

                        {/* Lienzo */}
                        <article className="card-plain">
                          <div className="card-inner">
                            {/* MEDIA por ENCIMA */}
                            {Comp ? (
                              <div className="card-media">
                                <div className="is-anim">
                                  <Comp ref={refForSlide} />
                                </div>
                              </div>
                            ) : (
                              <div className="card-media" />
                            )}

                            {/* TEXTO centrado */}
                            <div className="card-text">
                              <h2 className="sport-title">{s.title || s.alt}</h2>
                              <p className="sport-sub">
                                Colecciones, datos y análisis para tomar mejores decisiones.
                                Mercados, cuotas y tendencias en tiempo real.
                              </p>
                              <div className="actions">
                                <Link href={s.href || "#"} className="btn-gold">
                                  Predecir
                                </Link>
                              </div>
                            </div>
                          </div>
                        </article>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            );
          })}
        </div>
      </div>

      {/* ====== ESTILOS GLOBALES ====== */}
      <style jsx global>{`
        :root{
          /* --header-h se calcula en runtime; fallback por si acaso */
          --header-h: 140px;
          --sat: env(safe-area-inset-top, 0px);
          --title: #0b1020;
          --text: #222;
          --accent: #1f5dbd;
          --page-pad: clamp(16px, 3vw, 48px);
        }

        /* Evita que algún margin-top del body rompa el cálculo */
        html, body { margin: 0 !important; padding: 0 !important; }
        body { overflow-x: hidden; }

        /* El bloque bajo headers ocupa la pantalla exacta */
        .below-header{
          margin-top: var(--header-h);
          height: calc(100vh - var(--header-h));
        }

        /* Hero exactamente a pantalla */
        .slider-hero{
          width: 100vw;
          height: calc(100vh - var(--header-h)) !important;
          background: #fff;
          overflow: hidden;
        }

        .hero-swiper{
          width: 100%;
          height: calc(100vh - var(--header-h)) !important;
        }
        .hero-swiper .swiper-slide{
          position: relative;
          height: 100% !important;
          background: #fff;
          overflow: visible;
          isolation: isolate;
        }

        /* Lienzo interno centrado */
        .card-plain{ width: 100%; height: 100% !important; background: #fff; }
        .card-inner{
          position: relative;
          height: 100% !important;
          padding: var(--page-pad);
          display: grid;
          grid-template-rows: 1fr;
          place-items: center;
        }

        /* Texto */
        .card-text{
          position: relative;
          z-index: 20; /* debajo de la media (30) */
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          display: grid;
          place-items: center;
          gap: 16px;
          padding-inline: clamp(12px, 4vw, 48px);
        }
        .sport-title{
          margin: 0;
          font-size: clamp(40px, 7.5vw, 96px);
          line-height: .98;
          color: var(--title);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .5px;
        }
        .sport-sub{
          margin: 0;
          font-size: clamp(16px, 2vw, 22px);
          line-height: 1.5;
          color: #555;
          max-width: 90ch;
        }
        .actions{ display:flex; gap:12px; justify-content:center; }

        .btn-gold{
          display:inline-flex; align-items:center; justify-content:center;
          padding: 14px 26px; border-radius: 999px;
          background: linear-gradient(135deg, #CDAF4E, #E8D074 45%, #B68D2C 100%);
          color: #1a1a1a; font-weight: 800; text-decoration: none;
          border: 1px solid rgba(255,215,0,0.35);
          box-shadow: 0 6px 18px rgba(226, 200, 84, .25);
          transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
        }
        .btn-gold:hover{ transform: translateY(-1px); box-shadow: 0 12px 28px rgba(226,200,84,.35); }

        /* Media por ENCIMA y centrada */
        .card-media{
          position: absolute;
          z-index: 30; /* ENCIMA del texto */
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(92vw, 1100px);
          height: min(80vh, 780px);
          pointer-events: none;
          overflow: visible;
          will-change: transform;
        }
        .card-media > .is-anim{ position:absolute; inset:0; width:100%; height:100%; display:block; }
        .card-media svg,
        .card-media canvas,
        .card-media video,
        .card-media img{ width:100% !important; height:100% !important; object-fit:contain; display:block; }

        /* Watermark detrás */
        .back-title{
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 6vh;
          line-height: .9;
          font-weight: 900;
          font-size: clamp(72px, 22vw, 280px);
          letter-spacing: .05em;
          color: var(--accent);
          opacity: .12;
          z-index: 10; /* debajo del texto y media */
          pointer-events: none;
          text-transform: uppercase;
          white-space: nowrap;
          max-width: 92vw;
          overflow: hidden;
          text-align: center;
        }

        /* Oculta controles nativos del Swiper */
        .hero-swiper .swiper-pagination,
        .hero-swiper .swiper-button-prev,
        .hero-swiper .swiper-button-next { display: none !important; }

        /* Rail redes (opcional) */
        .social-rail{
          position: fixed;
          left: 14px; top: calc(var(--header-h) + 14px);
          display: flex; flex-direction: column; gap: 10px;
          z-index: 40;
        }
        .social-rail a{
          width: 38px; height: 38px; display: grid; place-items: center;
          border-radius: 999px; background: #0b1020; color: #fff; opacity: .9;
        }

        /* Móvil */
        @media (max-width: 980px){
          .card-media{ width: min(96vw, 620px); height: 48vh; }
          .back-title{ font-size: clamp(56px, 22vw, 140px); top: 4vh; opacity: .16; }
        }
      `}</style>
    </>
  );
}
