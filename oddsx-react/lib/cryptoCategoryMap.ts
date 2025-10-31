// /lib/cryptoCategoryMap.ts
//
// Este archivo traduce el item.id del sidebar
// a un criterio de filtro para los markets.

export type FilterRule =
  | { type: "asset"; value: string }
  | { type: "range"; value: string }
  | { type: "all" };

export function getFilterForNavId(navId: number): FilterRule {
  switch (navId) {
    // ----- timeframes / tipos -----
    case 1: // All
      return { type: "all" };
    case 2: // 15 Min
      return { type: "range", value: "15m" };
    case 3: // Hourly
      return { type: "range", value: "1h" };
    case 4: // 4 Hour
      return { type: "range", value: "4h" };
    case 5: // Daily
      return { type: "range", value: "1d" };
    case 6: // Weekly
      return { type: "range", value: "weekly" };
    case 7: // Monthly
      return { type: "range", value: "1m" };
    case 8: // Pre-Market
      return { type: "range", value: "premarket" };
    case 9: // ETF
      return { type: "range", value: "etf" };

    // ----- assets / tokens -----
    case 101: // Bitcoin
      return { type: "asset", value: "btc" };
    case 102: // Ethereum
      return { type: "asset", value: "eth" };
    case 103: // Solana
      return { type: "asset", value: "sol" };
    case 104: // XRP
      return { type: "asset", value: "xrp" };
    case 105: // Dogecoin
      return { type: "asset", value: "doge" };
    case 106: // MicroStrategy
      return { type: "asset", value: "mstr" };

    default:
      return { type: "all" };
  }
}
