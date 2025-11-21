"use client";

import {
  popularData,
  otherSportsData,
  marketsCategories,
  type TFunc,
} from "@/public/data/navData";

import {
  cryptoTimeframesCategories,
  cryptoAssetsCategories,
} from "@/public/data/cryptoNavData";

import { MARKETS } from "@/public/data/marketsData";
import { getFilterForNavId } from "@/lib/cryptoCategoryMap";

import type {
  SidebarSection,
  GenericNavItem,
} from "@/components/Shared/GenericSidebar";

import { iconFromKey } from "@/util/iconFromKey";

/* ========== helpers para contar mercados según la regla ========== */

function countMarketsForNavId(navId: number): number {
  const rule = getFilterForNavId(navId);

  if (rule.type === "all") {
    return MARKETS.length;
  }
  if (rule.type === "asset") {
    return MARKETS.filter((m) => m.assetTag === rule.value).length;
  }
  if (rule.type === "range") {
    return MARKETS.filter((m) => m.rangeTag === rule.value).length;
  }

  return 0;
}

/* ================== mapeos existentes ================== */
/* estas 3 (popular/otherSports/markets) siguen ahí por si luego las quieres usar
   pero ojo: las estoy normalizando a iconNode también
*/
function mapPopular(t: TFunc): GenericNavItem[] {
  return popularData(t).map((item) => ({
    id: item.id,
    label: item.linkText,
    href: item.href,
    iconNode: undefined, // si luego haces un icono NFL/NBA aquí lo pones
    count: undefined,
  }));
}

function mapOtherSports(t: TFunc): GenericNavItem[] {
  return otherSportsData(t).map((item) => ({
    id: item.id,
    label: item.linkText,
    href: item.href,
    iconNode: undefined,
    count: undefined,
  }));
}

function mapMarkets(t: TFunc): GenericNavItem[] {
  return marketsCategories(t).map((item) => ({
    id: item.id,
    label: item.linkText,
    href: item.href,
    iconNode: undefined,
    count: undefined,
  }));
}

/* ========= crypto timeframes & assets dinámicos ========== */

function mapCryptoTimeframesDynamic(t: TFunc): GenericNavItem[] {
  return cryptoTimeframesCategories(t).map((item) => ({
    id: item.id,
    label: item.label,
    href: "#", // navegación interna controlada por onSelectItem
    iconNode: iconFromKey(item.icon), // <- usamos tu componente React si aplica
    count: countMarketsForNavId(item.id),
  }));
}

function mapCryptoAssetsDynamic(t: TFunc): GenericNavItem[] {
  return cryptoAssetsCategories(t).map((item) => ({
    id: item.id,
    label: item.label,
    href: "#",
    iconNode: iconFromKey(item.icon),
    count: countMarketsForNavId(item.id),
  }));
}

/* ================== build final ==================
   Esta versión está pensada para usar <GenericSidebar />
   todavía renderiza:
   - Timeframes (searchable + search box)
   - Assets (searchable + search box)

   y tú después en la página haces:
     const sections = buildSidebarSectionsDynamic(t)
     <GenericSidebar
        sections={sections}
        activeId={activeId}
        onSelectItem={setActiveId}
     />
*/
export function buildSidebarSectionsDynamic(t: TFunc): SidebarSection[] {
  return [
    {
      id: "crypto_time",
      title: t("Crypto.timeframes", "Timeframes"),
      searchable: true,
      items: mapCryptoTimeframesDynamic(t),
    },
    {
      id: "crypto_assets",
      title: t("Crypto.assets", "Assets"),
      searchable: true,
      items: mapCryptoAssetsDynamic(t),
    },

    // si luego quieres pegar "popular" deportes o política:
    // {
    //   id: "popular",
    //   title: t("NavSection.popular", "Popular"),
    //   searchable: false,
    //   items: mapPopular(t),
    // },
    // {
    //   id: "other",
    //   title: t("NavSection.other_sports", "Other sports"),
    //   searchable: false,
    //   items: mapOtherSports(t),
    // },
    // {
    //   id: "markets",
    //   title: t("Markets.title", "Markets"),
    //   searchable: false,
    //   items: mapMarkets(t),
    // },
  ];
}
