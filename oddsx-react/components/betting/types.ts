export type MarketPickSide =
  | "home"
  | "away"
  | "draw"; // draw sólo aplica a soccer

export type MarketOption = {
  label: string;      // "OSA", "BAR +0.5", "O 3.5"
  price: string;      // "40¢"
  tone?: "green" | "red" | "neutral"; // para colores especiales
};

export type TeamSide = {
  abbr: string;       // "OSA"
  name: string;       // "Osasuna"
  record?: string;    // "3-1-5"
  rankOrSeed?: string;// "2", "1" en vivo
  color?: string;     // badge color
  logo?: string;      // optional URL/logo
};

export type GameCardData = {
  id: string;
  isLive: boolean;

  // LIVE info
  liveClock?: string; // "2H - 69:21"
  liveLabel?: string; // "LIVE •"
  vol: string;        // "$2.35m Vol." o "$37.83k Vol."

  // FUTURE/SCHEDULED info
  kickoff?: string;   // "11:30 AM", "2:00 PM"

  home: TeamSide;
  away: TeamSide;

  // mercados
  moneyline: MarketOption[]; // [away, draw?, home]
  spread: MarketOption[];    // [away, home]
  total: MarketOption[];     // [over, under]

  // para “Game View”
  marketsCount?: string;     // "6"
};
  
export type Seleccion = {
  partidoId: string;
  mercado: string;     // "Moneyline" | "Spread" | "Total"
  opcion: string;      // "OSA", "BAR +0.5"
  cuota: string;       // "40¢"
  etiqueta: string;    // texto lindo para el ticket
  timestamp: number;
};
