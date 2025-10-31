"use client";

import React from "react";

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

// helper para permitir prop size y className
function wrap(
  Comp: React.FC<React.SVGProps<SVGSVGElement>>,
  { defaultSize = 16 }: { defaultSize?: number } = {}
) {
  return ({ size = defaultSize, ...props }: IconProps) => (
    <Comp width={size} height={size} {...props} />
  );
}

/* =======================
   ICONOS GENERALES
======================= */

const HomeRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 11L12 3l9 8" />
    <path d="M5 10v10a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1V10" />
  </svg>
);
export const IconHome = wrap(HomeRaw, { defaultSize: 18 });

const CartRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.4 12.3a2 2 0 0 0 2 1.7h9.8a2 2 0 0 0 2-1.7L23 6H6" />
  </svg>
);
export const IconMarketplace = wrap(CartRaw, { defaultSize: 18 });

const LiveRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13 2L3 14h7v8l10-12h-7V2z" />
  </svg>
);
export const IconInPlay = wrap(LiveRaw, { defaultSize: 18 });

const WalletRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
    <path d="M16 12h4v4h-4z" />
    <path d="M2 9h20" />
  </svg>
);
export const IconWallet = wrap(WalletRaw, { defaultSize: 18 });

const SearchRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
export const IconSearch = wrap(SearchRaw, { defaultSize: 16 });

/* =======================
   ICONOS TOP NAV
======================= */

const TrophyRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M8 21h8M9 17h6M12 17v4" />
    <path d="M7 4h10v3a5 5 0 0 1-10 0V4z" />
    <path d="M5 5v2a3 3 0 0 0 3 3h.5" />
    <path d="M19 5v2a3 3 0 0 1-3 3H15.5" />
  </svg>
);
export const IconWorldCup = wrap(TrophyRaw, { defaultSize: 18 });

const PoliticsRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M2 10h20L12 2 2 10z" />
    <path d="M6 10v6" />
    <path d="M10 10v6" />
    <path d="M14 10v6" />
    <path d="M18 10v6" />
    <path d="M4 22h16v-2H4z" />
  </svg>
);
export const IconPolitics = wrap(PoliticsRaw, { defaultSize: 18 });

const FinanceRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M3 3v18h18" />
    <path d="M7 15l4-4 3 3 5-7" />
  </svg>
);
export const IconFinance = wrap(FinanceRaw, { defaultSize: 18 });

const CryptoRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8h3.5a2 2 0 0 1 0 4H10h4a2 2 0 0 1 0 4H10" />
    <path d="M10 6v12" />
  </svg>
);
export const IconCrypto = wrap(CryptoRaw, { defaultSize: 18 });

const GlobeRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z" />
  </svg>
);
export const IconGeopolitics = wrap(GlobeRaw, { defaultSize: 18 });

const ElectionsRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect x="3" y="10" width="18" height="11" rx="2" />
    <path d="M10 10l2.5-5 2.5 5" />
    <path d="M8 14h8" />
  </svg>
);
export const IconElections = wrap(ElectionsRaw, { defaultSize: 18 });

/* =======================
   CRYPTO / TIMEFRAMES
======================= */

const ClockRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const IconClock = wrap(ClockRaw, { defaultSize: 16 });

const CalendarRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);
export const IconCalendar = wrap(CalendarRaw, { defaultSize: 16 });

const EtfRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <line x1="6" y1="4" x2="6" y2="20" />
    <rect x="4" y="8" width="4" height="6" rx="1" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <rect x="10" y="10" width="4" height="4" rx="1" />
    <line x1="18" y1="4" x2="18" y2="20" />
    <rect x="16" y="7" width="4" height="8" rx="1" />
  </svg>
);
export const IconEtf = wrap(EtfRaw, { defaultSize: 16 });

const PremarketRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M3 17l5-5 4 4 5-6 4 4" />
    <path d="M13 3l-2 4h3l-2 4" />
  </svg>
);
export const IconPremarket = wrap(PremarketRaw, { defaultSize: 16 });

/* =======================
   CRYPTO / TOKENS
======================= */

const BtcRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
    <path
      d="M10 7h3a2 2 0 0 1 0 4h-3h4a2 2 0 0 1 0 4h-4"
      stroke="#000"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M10 5v14"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
export const IconBTC = wrap(BtcRaw, { defaultSize: 16 });

const EthRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L6 12l6 4 6-4-6-10z" />
    <path d="M6 14l6 8 6-8-6 4-6-4z" />
  </svg>
);
export const IconETH = wrap(EthRaw, { defaultSize: 16 });

const SolRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M7 7h12l-3-3H4l3 3z" />
    <path d="M7 13h12l-3-3H4l3 3z" />
    <path d="M7 19h12l-3-3H4l3 3z" />
  </svg>
);
export const IconSOL = wrap(SolRaw, { defaultSize: 16 });

const XrpRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M4 4l6 6m4 4l6 6" />
    <path d="M20 4l-5.5 5.5a4 4 0 01-5 0L4 4" />
    <path d="M4 20l5.5-5.5a4 4 0 015 0L20 20" />
  </svg>
);
export const IconXRP = wrap(XrpRaw, { defaultSize: 16 });

const DogeRaw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="8" />
    <path d="M9 10l-1-2 2 1" />
    <path d="M15 10l1-2-2 1" />
    <path d="M9 14h6" />
    <path d="M10 14c0 2 1 3 2 3s2-1 2-3" />
  </svg>
);
export const IconDOGE = wrap(DogeRaw, { defaultSize: 16 });
