// oddsx-react/public/data/cryptoNavData.ts
export type TFunc = (key: string, fallback?: string) => string;


export type CryptoNavItem = {
  id: number;
  label: string;
  href: string;
  icon?: string;   // ruta al iconito SVG/PNG (reloj, calendario, btc, etc.)
  count?: number;  // el numerito de la derecha "162", "4", etc.
};

/* ============================
   1) TIMEFRAMES / TIPOS
   ============================ */

export const cryptoTimeframesCategories = (t: TFunc): CryptoNavItem[] => [
  {
    id: 1,
    label: t("Crypto.all", "All"),
    href: "/markets/crypto?range=all",
    icon: "/icons/grid.svg",
    count: 162,
  },
  {
    id: 2,
    label: t("Crypto.15min", "15 Min"),
    href: "/markets/crypto?range=15m",
    icon: "/icons/clock-15.svg",
    count: 4,
  },
  {
    id: 3,
    label: t("Crypto.hourly", "Hourly"),
    href: "/markets/crypto?range=1h",
    icon: "/icons/clock-hour.svg",
    count: 4,
  },
  {
    id: 4,
    label: t("Crypto.4hour", "4 Hour"),
    href: "/markets/crypto?range=4h",
    icon: "/icons/clock-4h.svg",
    count: 4,
  },
  {
    id: 5,
    label: t("Crypto.daily", "Daily"),
    href: "/markets/crypto?range=1d",
    icon: "/icons/calendar-day.svg",
    count: 4,
  },
  {
    id: 6,
    label: t("Crypto.weekly", "Weekly"),
    href: "/markets/crypto?range=1w",
    icon: "/icons/bar-week.svg",
    count: 20,
  },
  {
    id: 7,
    label: t("Crypto.monthly", "Monthly"),
    href: "/markets/crypto?range=1m",
    icon: "/icons/heartbeat-month.svg",
    count: 15,
  },
  {
    id: 8,
    label: t("Crypto.premarket", "Pre-Market"),
    href: "/markets/crypto?range=premarket",
    icon: "/icons/premarket.svg",
    count: 35,
  },
  {
    id: 9,
    label: t("Crypto.etf", "ETF"),
    href: "/markets/crypto?range=etf",
    icon: "/icons/etf.svg",
    count: 4,
  },
];


/* ============================
   2) ASSETS / TOKENS
   ============================ */

export const cryptoAssetsCategories = (t: TFunc): CryptoNavItem[] => [
  {
    id: 101,
    label: t("Crypto.bitcoin", "Bitcoin"),
    href: "/markets/crypto?asset=btc",
    icon: "/coins/bitcoin.png", // ícono BTC redondo naranja
    count: 20,
  },
  {
    id: 102,
    label: t("Crypto.ethereum", "Ethereum"),
    href: "/markets/crypto?asset=eth",
    icon: "/coins/ethereum.png",
    count: 14,
  },
  {
    id: 103,
    label: t("Crypto.solana", "Solana"),
    href: "/markets/crypto?asset=sol",
    icon: "/coins/solana.png",
    count: 12,
  },
  {
    id: 104,
    label: t("Crypto.xrp", "XRP"),
    href: "/markets/crypto?asset=xrp",
    icon: "/coins/xrp.png",
    count: 10,
  },
  {
    id: 105,
    label: t("Crypto.dogecoin", "Dogecoin"),
    href: "/markets/crypto?asset=doge",
    icon: "/coins/dogecoin.png",
    count: 3,
  },
  {
    id: 106,
    label: t("Crypto.microstrategy", "MicroStrategy"),
    href: "/markets/crypto?asset=mstr",
    icon: "/coins/microstrategy.png", // puedes usar el logo MSTR o un ícono de building/stock
    count: 9,
  },
];
