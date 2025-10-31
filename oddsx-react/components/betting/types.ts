export type MarketPickSide =
  | "home"
  | "away"
  | "draw"; // draw sólo aplica a soccer

export type MarketOption = {
  label: string;      // "OSA", "BAR +0.5", "O 3.5"
  price: string;      // "40¢"
  tone?: "green" | "red" | "neutral" | "yellow" | "blue";
};

export type TeamSide = {
  abbr: string;       // "OSA"
  name: string;       // "Osasuna"
  record?: string;    // "3-1-5"
  rankOrSeed?: string;// "2", "1" en vivo
  divisionOrNote?: string; // si quieres algo como "#1 AFC West"
  color?: string;     // badge color
  logo?: string;      // optional URL/logo
  scoreLive?: string;  // <-- "21", "17", etc. SOLO cuando isLive === true
};

export type GameCardData = {
  id: string;
  isLive: boolean;

  // --- Info de EN VIVO ---
  liveClock?: string;    // "2H - 69:21", "Q3 - 07:12"
  liveLabel?: string;    // "LIVE", "Q3", etc.

  vol: string;           // "$2.35m Vol.", "$823k Vol."

  // --- Info de FUTURO / PROGRAMADO ---
  kickoff?: string;      // "8:25 PM", "11:30 AM"

  home: TeamSide;
  away: TeamSide;

  // --- Mercados principales mostrados en la card ---
  moneyline: MarketOption[]; // NFL normalmente 2; soccer 3 con DRAW
  spread: MarketOption[];    // 2 opciones
  total: MarketOption[];     // 2 opciones

  // --- Para el botón Game View ---
  marketsCount?: string;     // "6", "12", etc.

  // --- NUEVO / OPCIONAL extra meta para UI ---
  stadium?: string;          // "AT&T Stadium", "Levi's Stadium"
  week?: string;             // "Week 10", "Week 3", etc.
  broadcast?: string;        // "SNF", "CBS", "FOX"
  dateLabel?: string;        // "Sun, Nov 10", "Sat, November 8"

  // puedes seguir agregando más cosas aquí cuando quieras
};

  
export type Seleccion = {
  partidoId: string;
  mercado: string;     // "Moneyline" | "Spread" | "Total"
  opcion: string;      // "OSA", "BAR +0.5"
  cuota: string;       // "40¢"
  etiqueta: string;    // texto lindo para el ticket
  timestamp: number;
};


// ====== Prop markets (special bets, like MVP, Champions, etc.) ======

export type PropRow = {
  teamOrName: string; // "Detroit", "Bad Bunny"
  pct: string;        // "24%", "92%"
  yesPrice: string;   // "Yes 24¢"
  noPrice: string;    // "No 76¢"
};

export type PropCard = {
  id: string;         // identificador único
  icon: string;       // emoji o icono visual
  title: string;      // "NFC Champion", "Halftime Performer"
  volume: string;     // "$1m Vol."
  rows: PropRow[];    // lista de filas
};
