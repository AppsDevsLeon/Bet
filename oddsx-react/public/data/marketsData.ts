// /public/data/marketsData.ts

export type OutcomeOption = {
  label: string;   // ">$1.2B", "↑ 200k", "October 31"
  price: string;   // "100%", "<1%", "9%"
  tone?: "green" | "red" | "neutral"; // para colorear más tarde
};

export type MarketCard = {
  id: string;
  assetTag: string; // "btc" | "eth" | "xrp" | "macro" | "airdrop" etc
  rangeTag: string; // "1m" | "1w" | "15m" | "etf" | "premarket" etc
  icon: string;     // ruta del icono grande izquierda (btc, eth, etc)
  title: string;
  subtitle?: string;
  isLive?: boolean;
  volume?: string;  // "$54m Vol."
  probabilityLabel?: string; // "<1% chance" tipo gauge
  outcomes: OutcomeOption[];
};

/* =========================
   EJEMPLOS
   ========================= */

export const MARKETS: MarketCard[] = [
  {
    id: "megaeth-sale",
    assetTag: "eth",
    rangeTag: "1m",
    icon: "/coins/ethereum.png",
    title: "MegaETH public sale total commitments?",
    isLive: false,
    volume: "$54m Vol.",
    outcomes: [
      { label: ">$1.2B", price: "100%", tone: "green" },
      { label: ">$1.3B", price: "100%", tone: "green" },
    ],
  },

  {
    id: "btc-october-price",
    assetTag: "btc",
    rangeTag: "1m",
    icon: "/coins/bitcoin.png",
    title: "What price will Bitcoin hit in October?",
    isLive: true,
    outcomes: [
      { label: "↑ 200k", price: "<1%", tone: "neutral" },
      { label: "↑ 150k", price: "<1%", tone: "neutral" },
    ],
  },

  {
    id: "eth-october-price",
    assetTag: "eth",
    rangeTag: "1m",
    icon: "/coins/ethereum.png",
    title: "What price will Ethereum hit in October?",
    isLive: true,
    outcomes: [
      { label: "↑ 8000", price: "<1%", tone: "neutral" },
      { label: "↑ 6000", price: "<1%", tone: "neutral" },
    ],
  },

  {
    id: "btc-above-oct30",
    assetTag: "btc",
    rangeTag: "1m",
    icon: "/coins/bitcoin.png",
    title: "Bitcoin above __ on October 30?",
    isLive: true,
    outcomes: [
      { label: "100,000", price: "100%", tone: "green" },
      { label: "102,000", price: "100%", tone: "green" },
    ],
    volume: undefined,
  },

  {
    id: "eth-ath-oct31",
    assetTag: "eth",
    rangeTag: "1m",
    icon: "/coins/ethereum.png",
    title: "Ethereum all time high by October 31?",
    isLive: true,
    probabilityLabel: "<1% chance",
    outcomes: [
      { label: "Yes", price: "", tone: "green" },
      { label: "No", price: "", tone: "red" },
    ],
  },

  {
    id: "monad-airdrop",
    assetTag: "airdrop",
    rangeTag: "premarket",
    icon: "/icons/airdrop-token.png", // pon un icono tuyo
    title: "Monad airdrop by...?",
    isLive: false,
    volume: "$14m Vol.",
    outcomes: [
      { label: "October 31", price: "<1%", tone: "neutral" },
      { label: "November 15", price: "9%", tone: "green" },
    ],
  },

  {
    id: "xrp-october-price",
    assetTag: "xrp",
    rangeTag: "1m",
    icon: "/coins/xrp.png",
    title: "What price will XRP hit in October?",
    outcomes: [
      { label: "↑ 6.00", price: "<1%", tone: "neutral" },
      { label: "↑ 4.50", price: "<1%", tone: "neutral" },
    ],
  },

  {
    id: "btc-oct27-nov2",
    assetTag: "btc",
    rangeTag: "weekly",
    icon: "/coins/bitcoin.png",
    title: "What price will Bitcoin hit October 27–November 2?",
    outcomes: [
      { label: "↑ 128,000", price: "<1%", tone: "neutral" },
      { label: "↑ 126,000", price: "1%", tone: "green" },
    ],
  },

  {
    id: "eth-above-oct30",
    assetTag: "eth",
    rangeTag: "1m",
    icon: "/coins/ethereum.png",
    title: "Ethereum above __ on October 30?",
    outcomes: [
      { label: "3,400", price: "99%", tone: "green" },
      { label: "3,500", price: "100%", tone: "green" },
    ],
  },
];
