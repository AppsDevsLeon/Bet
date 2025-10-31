import {
  popularData,
  otherSportsData,
  marketsCategories,
} from "@/public/data/navData";
import {
  cryptoTimeframesCategories,
  cryptoAssetsCategories,
} from "@/public/data/cryptoNavData";

import type { TFunc } from "@/public/data/navData"; // mismo tipo TFunc
import type { SidebarSection, GenericNavItem } from "@/components/Shared/GenericSidebar";

/* map popularData() -> GenericNavItem[] */
function mapPopular(t: TFunc): GenericNavItem[] {
  return popularData(t).map((item) => ({
    id: item.id,
    label: item.linkText,
    href: item.href,
    icon: item.image,   // ya viene la imagen del deporte
  }));
}

/* map otherSportsData() -> GenericNavItem[] */
function mapOtherSports(t: TFunc): GenericNavItem[] {
  return otherSportsData(t).map((item) => ({
    id: item.id,
    label: item.linkText,
    href: item.href,
    icon: item.image,
  }));
}

/* map marketsCategories() -> GenericNavItem[]  (estos NO traen icono ni count) */
function mapMarkets(t: TFunc): GenericNavItem[] {
  return marketsCategories(t).map((item) => ({
    id: item.id,
    label: item.linkText,
    href: item.href,
  }));
}

/* map cryptoTimeframesCategories() -> GenericNavItem[] */
function mapCryptoTimeframes(t: TFunc): GenericNavItem[] {
  return cryptoTimeframesCategories(t).map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    icon: item.icon,
    count: item.count,
  }));
}

/* map cryptoAssetsCategories() -> GenericNavItem[] */
function mapCryptoAssets(t: TFunc): GenericNavItem[] {
  return cryptoAssetsCategories(t).map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    icon: item.icon,
    count: item.count,
  }));
}

/* fábrica principal:
   arma un arreglo de SidebarSection que luego le pasas a <GenericSidebar sections={...} />
*/
export function buildSidebarSections(t: TFunc): SidebarSection[] {
  return [
    {
      id: "popular",
      title: t("NavSection.popular", "Popular"),
      searchable: false,
      items: mapPopular(t),
    },
    {
      id: "other",
      title: t("NavSection.other_sports", "Other sports"),
      searchable: false,
      items: mapOtherSports(t),
    },
    {
      id: "markets",
      title: t("Markets.title", "Markets"),
      searchable: false,
      items: mapMarkets(t),
    },
    {
      id: "crypto_time",
      title: t("Crypto.timeframes", "Timeframes"),
      searchable: true, // 👈 aquí sí activamos el buscador
      items: mapCryptoTimeframes(t),
    },
    {
      id: "crypto_assets",
      title: t("Crypto.assets", "Assets"),
      searchable: true, // buscador también sirve para filtrar tokens
      items: mapCryptoAssets(t),
    },
  ];
}
