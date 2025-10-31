"use client";
import React, { useEffect, useState, useMemo } from "react";
import NavItem from "./NavItem";
import { useI18n } from "@/lib/i18n/I18nProvider";  
import { useWallet } from "@/hooks/useWallet";
import { useRouter } from "next/navigation";


const DASHBOARD_PATH = "/dashboard";

export default function Header() {
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isMiddleExpanded, setIsMiddleExpanded] = useState(false);

  const { t } = useI18n();               // ✅ seguimos usando traducciones
  const router = useRouter();

  // Web3 (MetaMask)
  const { account, connect, disconnect, ui, isConnecting, error } = useWallet();

  const toggleCard = () => setIsCardExpanded(v => !v);
  const toggleMiddle = () => setIsMiddleExpanded(v => !v);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (isCardExpanded && !event.target.closest(".navbar-toggler")) setIsCardExpanded(false);
    };
    document.body.addEventListener("click", handleClickOutside);
    return () => document.body.removeEventListener("click", handleClickOutside);
  }, [isCardExpanded]);

  useEffect(() => {
    const handleClickOutsideMiddle = (event: any) => {
      if (isMiddleExpanded && !event.target.closest(".left-nav-icon")) setIsMiddleExpanded(false);
    };
    document.body.addEventListener("click", handleClickOutsideMiddle);
    return () => document.body.removeEventListener("click", handleClickOutsideMiddle);
  }, [isMiddleExpanded]);

  useEffect(() => {
    if (account) router.push(DASHBOARD_PATH);
  }, [account, router]);

  const rightCta = useMemo(() => {
    if (account) {
      return (
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success/20 text-success px-3 py-2 rounded-3">
            {ui.label}
          </span>
          <button className="cmn-btn second-alt px-xxl-11 rounded-2" onClick={disconnect}>
            {t("Wallet.disconnect", "Desconectar")}
          </button>
        </div>
      );
    }
    return (
      <button
        className="cmn-btn px-xxl-11 rounded-2"
        onClick={connect}
        disabled={isConnecting}
        aria-busy={isConnecting}
      >
        {isConnecting ? t("Wallet.connecting", "Conectando...") : t("Wallet.connect", "Connect Wallet")}
      </button>
    );
  }, [account, disconnect, isConnecting, t, ui.label, connect]);

  return (
    <>
      <header className="header-section2 header-section fullwidth-header">
        <nav className="navbar navbar-expand-lg position-relative py-md-3 py-lg-6 workready w-100 px-0">
          {/* MENU A TODO EL ANCHO, PEGADO A LA IZQUIERDA */}
          <div
            className={`collapse navbar-collapse justify-content-start ${isCardExpanded ? "show" : "hide"}`}
            id="navbar-content"
          >
            <ul className="navbar-nav2fixed navbar-nav d-flex align-items-lg-center gap-4 gap-sm-5 py-2 py-lg-0 align-self-center p2-bg w-100">
              <NavItem />
            </ul>
          </div>
  
   

      
        </nav>
      </header>

      {!!error && (
        <div className="fixed bottom-4 start-50 translate-middle-x z-1050 rounded-3 bg-danger text-white px-4 py-2 shadow">
          {error}
        </div>
      )}


    </>
  );
}
