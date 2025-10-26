"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconAdjustmentsHorizontal, IconX } from "@tabler/icons-react";

import NavItem from "./NavItem";
import SideNav from "./SideNav";
// import Language from "./Language"; // si luego quieres volver a mostrarlo, descomenta
// import { useI18n } from "@/lib/i18n/I18nProvider"; // ya no es necesario para wallet

export default function Header() {
  const [isCardExpanded, setIsCardExpanded] = useState(false);     // navbar (menu horizontal)
  const [isMiddleExpanded, setIsMiddleExpanded] = useState(false); // sidenav (menu lateral)

  const toggleCard = () => setIsCardExpanded(v => !v);
  const toggleMiddle = () => setIsMiddleExpanded(v => !v);

  // Cerrar NAVBAR al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        isCardExpanded &&
        target &&
        !target.closest(".navbar-toggler") &&
        !target.closest("#navbar-content")
      ) {
        setIsCardExpanded(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isCardExpanded]);

  // Cerrar SIDENAV al hacer click fuera (en móviles)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        isMiddleExpanded &&
        target &&
        !target.closest(".left-nav-icon") && // botón flotante / icono (si lo usas)
        !target.closest(".nav_aside")        // propio panel
      ) {
        setIsMiddleExpanded(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isMiddleExpanded]);

  return (
    <>
      <header className="header-section2 header-section fullwidth-header">
        <nav className="navbar navbar-expand-lg position-relative py-md-3 py-lg-6 workready w-100 px-0">
         

          {/* MENÚ HORIZONTAL A TODO EL ANCHO */}
          <div
            id="navbar-content"
            className={`collapse navbar-collapse justify-content-start ${isCardExpanded ? "show" : "hide"}`}
          >
            <ul className="navbar-nav2fixed navbar-nav d-flex align-items-lg-center gap-4 gap-sm-5 py-2 py-lg-0 align-self-center p2-bg w-100">
              <NavItem />
              {/* CTA login/signup visibles solo en xs/sm (como tenías) */}
              <li className="dropdown show-dropdown d-block d-sm-none ms-auto">
                <div className="d-flex align-items-center flex-wrap gap-3 me-3">
                  <Link href="/login" className="cmn-btn second-alt px-xxl-11 rounded-2">Log In</Link>
                  <Link href="/create-acount" className="cmn-btn px-xxl-11">Sign Up</Link>
                </div>
              </li>
            </ul>
          </div>

          {/* DERECHA: (aquí podrías poner <Language /> u otros botones si quieres) */}
          <div className="right-area custom-pos position-relative d-flex gap-0 gap-lg-7 align-items-center me-4 me-xl-5">
            {/* <Language /> */}
          </div>

          {/* BOTÓN HAMBURGUESA NAVBAR */}
          <button
            onClick={toggleCard}
            className="navbar-toggler mt-1 mt-sm-2 mt-lg-0"
            type="button"
            aria-label="Abrir menú"
            aria-controls="navbar-content"
            aria-expanded={isCardExpanded}
            id="nav-icon3"
          >
            <span></span><span></span><span></span><span></span>
          </button>
        </nav>

        {/* ==== SIDENAV (izquierda) ==== */}
        <div id="div10" className="navigation left-nav-area box3 position-fixed">
          {/* Panel deslizante */}
          <div
            className={`nav_aside px-5 p2-bg ${isMiddleExpanded ? "show" : "hide"}`}
            role="dialog"
            aria-modal="true"
          >
            <div className="nav-clsoeicon d-flex justify-content-end mt-4">
              <IconX
                onClick={toggleMiddle}
                width={32}
                height={32}
                className="ti ti-x left-nav-icon n8-color d-block d-lg-none fs-three"
                aria-label="Cerrar menú lateral"
              />
            </div>
            <SideNav />
          </div>
        </div>
      </header>

      {/* Si quieres el botón flotante para abrir el SideNav en móvil, descomenta: */}
      {/* 
      <button
        onClick={toggleMiddle}
        type="button"
        className="middle-iconfixed position-fixed top-50 start-0 left-nav-icon"
        aria-label="Abrir menú lateral"
        aria-expanded={isMiddleExpanded}
      >
        <IconAdjustmentsHorizontal width={38} height={38} className="ti ti-adjustments-horizontal n8-color d-block d-lg-none fs-two" />
      </button>
      */}
    </>
  );
}
