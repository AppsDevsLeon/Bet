"use client";

import React from "react";

import {
  cryptoTimeframesCategories,
  cryptoAssetsCategories,
  type TFunc,
} from "@/public/data/cryptoNavData";

import type {
  SidebarSection,
  GenericNavItem,
} from "@/components/Shared/GenericSidebar";

import {
  IconClock,
  IconCalendar,
  IconEtf,
  IconPremarket,
  IconBTC,
  IconETH,
  IconSOL,
  IconXRP,
  IconDOGE,
} from "@/components/Icons/OddsXIcons";

// Timeframes / ranges (15 Min, Hourly, Daily...)
function mapCryptoTimeframes(t: TFunc): GenericNavItem[] {
  return cryptoTimeframesCategories(t).map((item) => {
    const labelLower = item.label.toLowerCase();
    let iconNode: React.ReactNode;

    if (
      labelLower.includes("min") ||
      labelLower.includes("hour") ||
      labelLower.includes("4 hour") ||
      labelLower.includes("hourly")
    ) {
      iconNode = <IconClock className="text-current" size={16} />;
    } else if (
      labelLower.includes("daily") ||
      labelLower.includes("weekly") ||
      labelLower.includes("monthly")
    ) {
      iconNode = <IconCalendar className="text-current" size={16} />;
    } else if (labelLower.includes("etf")) {
      iconNode = <IconEtf className="text-current" size={16} />;
    } else if (
      labelLower.includes("pre-market") ||
      labelLower.includes("pre")
    ) {
      iconNode = <IconPremarket className="text-current" size={16} />;
    } else {
      iconNode = <IconClock className="text-current" size={16} />;
    }

    return {
      id: item.id,
      label: item.label,
      href: "#", // no navegamos, esto sólo controla filtro local en la página
      iconNode,
      count: item.count,
    };
  });
}

// Assets / tokens (BTC / ETH / SOL / etc.)
function mapCryptoAssets(t: TFunc): GenericNavItem[] {
  return cryptoAssetsCategories(t).map((item) => {
    const labelLower = item.label.toLowerCase();

    if (labelLower.includes("bitcoin")) {
      return {
        id: item.id,
        label: item.label,
        href: "#",
        iconNode: <IconBTC className="text-[#f7931a]" size={16} />,
        count: item.count,
      };
    }

    if (labelLower.includes("ethereum")) {
      return {
        id: item.id,
        label: item.label,
        href: "#",
        iconNode: <IconETH className="text-[#627eea]" size={16} />,
        count: item.count,
      };
    }

    if (labelLower.includes("solana")) {
      return {
        id: item.id,
        label: item.label,
        href: "#",
        iconNode: <IconSOL className="text-current" size={16} />,
        count: item.count,
      };
    }

    if (labelLower.includes("xrp")) {
      return {
        id: item.id,
        label: item.label,
        href: "#",
        iconNode: <IconXRP className="text-current" size={16} />,
        count: item.count,
      };
    }

    if (labelLower.includes("doge")) {
      return {
        id: item.id,
        label: item.label,
        href: "#",
        iconNode: <IconDOGE className="text-current" size={16} />,
        count: item.count,
      };
    }

    // fallback (ej. MicroStrategy) usa tu PNG original
    return {
      id: item.id,
      label: item.label,
      href: "#",
      iconSrc: item.icon, // "/coins/microstrategy.png"
      count: item.count,
    };
  });
}

// esto es lo que importas en tu página de crypto
export function buildCryptoSections(t: TFunc): SidebarSection[] {
  return [
    {
      id: "crypto_time",
      title: t("Crypto.timeframes", "Timeframes"),
      searchable: true,
      items: mapCryptoTimeframes(t),
    },
    {
      id: "crypto_assets",
      title: t("Crypto.assets", "Assets"),
      searchable: true,
      items: mapCryptoAssets(t),
    },
  ];
}
