"use client";

import React, { useMemo, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import GenericSidebarMobile from "@/components/Shared/GenericSidebarMobile";
import GenericSidebarDesktop from "@/components/Shared/GenericSidebar";

import MarketCardPoly from "@/components/markets/MarketCard";
import BetSlipOverlayV2 from "@/components/betting/BetSlipOverlay";

import { MARKETS } from "@/public/data/marketsData";
import type {
  MarketCard as MarketCardType,
  OutcomeOption,
} from "@/public/data/marketsData";

import { buildSidebarSectionsDynamic } from "@/lib/buildSidebarSectionsDynamic";

/* =========================================
   TOP NAV -> categoría por ruta/query
========================================= */
type TopKey =
  | "home"
  | "worldcup"
  | "sports"
  | "politics"
  | "finance"
  | "crypto"
  | "nfts"
  | "defi"
  | "ai"
  |"health"
  | "geopolitics"
  | "culture"
  | "economy"
  | "elections"
  | "promotions"
  | "science"
  | "entertainment"
  | "commodities"
  | "other";

const stripLocale = (p: string) =>
  p.replace(/^\/(es|en|pt)(?=\/|$)/, "") || "/";

function pathToTopKey(pathname: string): TopKey {
  const p = stripLocale(pathname);
  if (p === "/") return "home";
  if (p.startsWith("/world-cup")) return "worldcup";
  if (p.startsWith("/sports")) return "sports";
  if (p.startsWith("/politics")) return "politics";
  if (p.startsWith("/finance")) return "finance";
  if (p.startsWith("/crypto")) return "crypto";
  if (p.startsWith("/nfts")) return "nfts";
if (p.startsWith("/defi")) return "defi";
if (p.startsWith("/ai")) return "ai";
if (p.startsWith("/health")) return "health";
if (p.startsWith("/science")) return "science";
if (p.startsWith("/entertainment")) return "entertainment";
if (p.startsWith("/commodities")) return "commodities";
if (p.startsWith("/other")) return "other";
  
  if (p.startsWith("/geopolitics")) return "geopolitics";
  if (p.startsWith("/culture")) return "culture";
  if (p.startsWith("/economy")) return "economy";
  if (p.startsWith("/elections")) return "elections";
  if (p.startsWith("/promotions")) return "promotions";
  return "home";
}

/* =========================================
   SIDEBAR -> asset / range
   (ajústalo a tus IDs reales)
========================================= */
type SidebarRule =
  | { type: "all" }
  | { type: "asset"; value: string } // "btc" | "eth" | ...
  | { type: "range"; value: string }; // "1d" | "1w" | "1m" ...

function getFilterForNavId(id: number): SidebarRule {
  if (id === 1) return { type: "all" };

  // Assets
  if (id === 101) return { type: "asset", value: "btc" };
  if (id === 102) return { type: "asset", value: "eth" };
  if (id === 103) return { type: "asset", value: "sol" };

  // Ranges
  if (id === 201) return { type: "range", value: "1d" };
  if (id === 202) return { type: "range", value: "1w" };
  if (id === 203) return { type: "range", value: "1m" };

  return { type: "all" };
}

/* =========================================
   Utils
========================================= */
function useIsMobile(bp: number = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${bp}px)`);
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [bp]);
  return isMobile;
}

/* =========================================
   Página con TOP + SIDEBAR
========================================= */
export default function MarketsCryptoPage() {
  const pathname = usePathname() || "/";
  const search = useSearchParams();

  // TOP: por ruta o ?top=
  const topFromPath = pathToTopKey(pathname);
  const topFromQuery = (search.get("top") as TopKey | null) ?? null;
  const activeTop: TopKey = topFromQuery ?? topFromPath;

  // SIDEBAR: estado de selección
  const [activeNavId, setActiveNavId] = useState<number>(1);

  // Slip
  const [showSlip, setShowSlip] = useState<boolean>(false);
  const [betMarket, setBetMarket] = useState<MarketCardType | null>(null);
  const [betOutcome, setBetOutcome] = useState<OutcomeOption | null>(null);
  const [betAmount, setBetAmount] = useState<string>("");

  // i18n temporal para secciones de sidebar
  const t = (key: string, fallback?: string) => fallback ?? key;
  const cryptoSections = buildSidebarSectionsDynamic(t);

  // === FILTRO COMBINADO ===
  // 1) TOP filtra por category
  // 2) SIDEBAR refina por assetTag/rangeTag
  const filteredMarkets = useMemo(() => {
    // Paso 1: categoría
    const byTop =
      activeTop === "home"
        ? MARKETS
        : MARKETS.filter((m) => m.category === activeTop);

    // Paso 2: sidebar
    const rule = getFilterForNavId(activeNavId);
    if (rule.type === "all") return byTop;
    if (rule.type === "asset") return byTop.filter((m) => m.assetTag === rule.value);
    if (rule.type === "range") return byTop.filter((m) => m.rangeTag === rule.value);
    return byTop;
  }, [activeTop, activeNavId]);

  // Abrir slip
  function handleSelectOutcome(market: MarketCardType, outcome: OutcomeOption) {
    setBetMarket(market);
    setBetOutcome(outcome);
    setBetAmount("");
    setShowSlip(true);
  }
  // Cerrar/confirmar
  const closeSlip = () => {
    setShowSlip(false);
    setBetMarket(null);
    setBetOutcome(null);
    setBetAmount("");
  };
  const confirmSlip = () => {
    // tx, toasts, refresh, etc.
    closeSlip();
  };

  // (Opcional) reflejar ?top en /markets
  useEffect(() => {
    const paths = ["/markets", "/es/markets", "/en/markets", "/pt/markets"];
    if (paths.includes(stripLocale(pathname))) {
      const url = new URL(window.location.href);
      if (activeTop === "home") url.searchParams.delete("top");
      else url.searchParams.set("top", activeTop);
      window.history.replaceState({}, "", url.toString());
    }
  }, [activeTop, pathname]);

  const isMobile = useIsMobile();

  return (
    <main
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        color: "#0f172a",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* ================================
          SIDEBAR (MOBILE / DESKTOP)
         ================================ */}
      {isMobile ? (
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            backgroundColor: "#fff",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <GenericSidebarMobile
            sections={cryptoSections.map((section) => ({
              ...section,
              items: section.items.map((it) => ({ ...it, href: "#" })),
            }))}
            activeId={activeNavId}
            onSelectItem={(id) => setActiveNavId(Number(id))}
          />
        </div>
      ) : (
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            width: "260px",
            minWidth: "260px",
            flexShrink: 0,
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <GenericSidebarDesktop
            sections={cryptoSections.map((section) => ({
              ...section,
              items: section.items.map((it) => ({ ...it, href: "#" })),
            }))}
            activeId={activeNavId}
            onSelectItem={(id) => setActiveNavId(Number(id))}
            showMainBlock={false}
          />
        </aside>
      )}

      {/* ================================
          CONTENIDO PRINCIPAL
         ================================ */}
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          position: "relative",
        }}
      >
        {/* Header de estado (muestra TOP + conteo) */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 16px",
            borderBottom: "1px solid #e2e8f0",
            background: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
            {activeTop === "home" ? "All markets" : `Category: ${activeTop}`}
          </h2>
          <span
            style={{
              fontSize: 12,
              background: "#e2e8f0",
              borderRadius: 12,
              padding: "4px 10px",
            }}
          >
            {filteredMarkets.length} items
          </span>
        </header>

        {/* Grid de Cards */}
        <div
          style={{
            flex: "1 1 auto",
            overflowY: "auto",
            padding: isMobile ? "12px" : "16px",
            display: "flex",
            flexDirection: "column",
            rowGap: "24px",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "grid",
              width: "100%",
              gap: "16px",
              minWidth: 0,
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {filteredMarkets.map((mkt) => (
              <MarketCardPoly
                key={mkt.id}
                market={mkt}
                onSelectOutcome={handleSelectOutcome}
              />
            ))}
          </div>

          {filteredMarkets.length === 0 && (
            <div
              style={{
                padding: 24,
                border: "1px dashed #94a3b8",
                borderRadius: 12,
                background: "#fff",
              }}
            >
              No markets for this filter.
            </div>
          )}
        </div>

        {/* Slip */}
        {showSlip && betMarket && betOutcome && (
          <BetSlipOverlayV2
            market={betMarket}
            outcome={betOutcome}
            stake={betAmount}
            onChangeStake={setBetAmount}
            onClose={closeSlip}
            onConfirm={confirmSlip}
          />
        )}
      </section>
    </main>
  );
}
