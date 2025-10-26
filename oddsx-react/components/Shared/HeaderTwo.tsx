"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  IconGift,
  IconAdjustmentsHorizontal,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";

// Carga diferida para reducir el bundle inicial
const HeaderTwoChat = dynamic(() => import("./HeaderTwoChat"), { ssr: false });
const SideNav = dynamic(() => import("./SideNav"), { ssr: false });
const NavItem = dynamic(() => import("./NavItem"), { ssr: false });

export default function HeaderTwo() {
  const [isCardExpanded, setIsCardExpanded] = useState(false);   // menú superior
  const [isMiddleExpanded, setIsMiddleExpanded] = useState(false); // side nav

  const navCollapseRef = useRef<HTMLDivElement | null>(null);
  const sideNavRef = useRef<HTMLDivElement | null>(null);
  const sideToggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const navToggleBtnRef = useRef<HTMLButtonElement | null>(null);

  const closeAll = useCallback(() => {
    setIsCardExpanded(false);
    setIsMiddleExpanded(false);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeAll]);

  // Cierre seguro por click/gesto fuera (captura)
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;

      if (isCardExpanded && navCollapseRef.current) {
        const insideNav =
          navCollapseRef.current.contains(target) ||
          navToggleBtnRef.current?.contains(target);
        if (!insideNav) setIsCardExpanded(false);
      }

      if (isMiddleExpanded && sideNavRef.current) {
        const insideSide =
          sideNavRef.current.contains(target) ||
          sideToggleBtnRef.current?.contains(target);
        if (!insideSide) setIsMiddleExpanded(false);
      }
    };

    // captura=true evita que otros handlers paren la propagación antes
    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () =>
      window.removeEventListener("pointerdown", onPointerDown, { capture: true } as any);
  }, [isCardExpanded, isMiddleExpanded]);

  const toggleCard = () => setIsCardExpanded((v) => !v);
  const toggleMiddle = () => setIsMiddleExpanded((v) => !v);

  return (
    <>
      <header className="header-section2 header-section">
        <nav className="navbar navbar-expand-lg position-relative py-md-3 py-lg-6 workready">
          <div
            ref={navCollapseRef}
            id="navbar-content"
            className={`collapse navbar-collapse justify-content-between ${
              isCardExpanded ? "show" : ""
            }`}
            aria-hidden={!isCardExpanded}
          >
            <ul className="navbar-nav2fixed navbar-nav d-flex align-items-lg-center gap-4 gap-sm-5 py-2 py-lg-0 align-self-center p2-bg">
              <NavItem />
              <li className="dropdown show-dropdown d-block d-sm-none">
                <div className="d-flex align-items-center flex-wrap gap-3">
                  <Link href="/login" className="cmn-btn second-alt px-xxl-11 rounded-2">
                    Log In
                  </Link>
                  <Link href="/create-account" className="cmn-btn px-xxl-11">
                    Sign Up
                  </Link>
                </div>
              </li>
            </ul>
          </div>

          <div className="right-area custom-pos custom-postwo position-relative d-flex gap-3 gap-xl-7 align-items-center me-5 me-xl-10">
            <div className="text-end d-none d-sm-block">
              <span className="fs-seven mb-1 d-block">Your balance</span>
              {/* TODO: Renderizar saldo real solo si el usuario está autenticado */}
              <span className="fw-bold d-block">$0.22</span>
            </div>

            <button className="cmn-btn px-xxl-6 d-none d-sm-block d-lg-none d-xxl-block">
              Deposit
            </button>

            <div className="d-flex align-items-center gap-2 mt-1">
              <button
                type="button"
                className="py-1 px-2 n11-bg rounded-5 position-relative"
                aria-label="Gifts"
              >
                <IconGift height={24} width={24} className="ti ti-gift fs-four" />
                <span className="fs-eight g1-bg px-1 rounded-5 position-absolute end-0 top-0">
                  2
                </span>
              </button>

              <div className="cart-area search-area d-flex">
                <HeaderTwoChat />
                <button type="button" className="py-1 px-2 n11-bg rounded-5" aria-label="Profile">
                  <IconUserCircle height={24} width={24} className="ti ti-user-circle fs-four" />
                </button>
              </div>
            </div>

            <button
              ref={navToggleBtnRef}
              onClick={toggleCard}
              className="navbar-toggler navbar-toggler-two mt-1 mt-sm-2 mt-lg-0"
              aria-label="Toggle navigation"
              aria-controls="navbar-content"
              aria-expanded={isCardExpanded}
            >
              <span></span><span></span><span></span><span></span>
            </button>
          </div>
        </nav>

        {/* Navegación lateral (IDs únicos) */}
        <div id="left-nav-root" className="navigation left-nav-area box3 position-fixed">
          <div className="logo-area slide-toggle3 trader-list position-fixed top-0 d-flex align-items-center justify-content-center pt-6 pt-md-8 gap-sm-4 gap-md-5 gap-lg-7 px-4 px-lg-8">
            <i className="ti ti-menu-deep left-nav-icon n8-color order-2 order-lg-0 d-none" />
            <Link className="navbar-brand d-center text-center gap-1 gap-lg-2 ms-lg-4" href="/">
              <Image
                className="logo"
                width={32}
                height={34}
                src="/images/logo.png"
                alt="Logo"
                sizes="32px"
                priority
              />
              <Image
                className="logo d-none d-xl-block"
                width={64}
                height={24}
                src="/images/logo-text.png"
                alt="Brand"
                sizes="64px"
                priority
              />
            </Link>
          </div>

          <aside
            ref={sideNavRef}
            className={`nav_aside px-5 p2-bg ${isMiddleExpanded ? "show" : ""}`}
            aria-hidden={!isMiddleExpanded}
            aria-label="Side navigation"
            tabIndex={-1}
          >
            <div className="nav-clsoeicon d-flex justify-content-end">
              <button
                onClick={toggleMiddle}
                className="left-nav-icon"
                aria-label="Close side navigation"
                type="button"
              >
                <IconX width={32} height={32} className="ti ti-x n8-color d-block d-lg-none fs-three" />
              </button>
            </div>
            <SideNav />
          </aside>
        </div>
      </header>

      <button
        ref={sideToggleBtnRef}
        onClick={toggleMiddle}
        type="button"
        className="middle-iconfixed position-fixed top-50 start-0 left-nav-icon"
        aria-controls="left-nav-root"
        aria-expanded={isMiddleExpanded}
        aria-label="Toggle side navigation"
      >
        <IconAdjustmentsHorizontal width={38} height={38} className="ti ti-adjustments-horizontal n8-color d-block d-lg-none fs-two" />
      </button>
    </>
  );
}
