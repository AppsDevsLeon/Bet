// oddsx-react/public/data/navData.ts

export type TFunc = (key: string, fallback?: string) => string;

export type NavCard = {
  id: number;
  image: string;
  linkText: string;
  href: string;
};

export type NavItem = {
  id: number;
  linkText: string;
  href: string;
};

// POPULARES (13 items)
export const popularData = (t: TFunc): NavCard[] => [
  { id: 57940, image: "/images/icon/soccer-icon.png", linkText: t("Nav.soccer", "Soccer"), href: "/soccer" },
  { id: 13736, image: "/images/icon/tennis.png", linkText: t("Nav.tennis", "Tennis"), href: "/tennis" },
  { id: 20998, image: "/images/icon/basketball.png", linkText: t("Nav.basketball", "Basketball"), href: "/basketball" },
  { id: 9058, image: "/images/icon/cricket.png", linkText: t("Nav.cricket", "Cricket"), href: "/cricket" },
  { id: 41066, image: "/images/icon/ecricket.png", linkText: t("Nav.ecricket", "eCricket"), href: "/ecricket" },
  { id: 57911, image: "/images/icon/america-football.png", linkText: t("Nav.american_football", "American Football"), href: "/american-football" },
  { id: 33764, image: "/images/icon/ice-hockey.png", linkText: t("Nav.ice_hockey", "Ice Hockey"), href: "/ice-hockey" },
  { id: 20140, image: "/images/icon/nba2k.png", linkText: t("Nav.nba2k", "NBA 2K"), href: "/nba-2k" },
  { id: 26979, image: "/images/icon/volleyball.png", linkText: t("Nav.volleyball", "Volleyball"), href: "/volleyball" },
  { id: 26344, image: "/images/icon/fifa-volta.png", linkText: t("Nav.fifa_volta", "FIFA: Volta"), href: "/fifa-volta" },
  { id: 29537, image: "/images/icon/penalty-shootout.png", linkText: t("Nav.penalty_shootout", "Penalty Shootout"), href: "/penalty-shootout" },
  { id: 18039, image: "/images/icon/handball.png", linkText: t("Nav.handball", "Handball"), href: "/handball" },
  { id: 3550, image: "/images/icon/table-tennis.png", linkText: t("Nav.table_tennis", "Table Tennis"), href: "/table-tennis" }
];

// OTROS DEPORTES (17 items)
export const otherSportsData = (t: TFunc): NavCard[] => [
  { id: 12232, image: "/images/icon/kabaddi.png", linkText: t("Nav.kabaddi", "Kabaddi"), href: "/kabaddi" },
  { id: 20341, image: "/images/icon/efighting.png", linkText: t("Nav.efighting", "eFighting"), href: "/efighting" },
  { id: 51272, image: "/images/icon/erocket-league.png", linkText: t("Nav.erocket_league", "eRocket League"), href: "/erocket-league" },
  { id: 55534, image: "/images/icon/aussie-rules.png", linkText: t("Nav.aussie_rules", "Aussie Rules"), href: "/aussie-rules" },
  { id: 38128, image: "/images/icon/rugby.png", linkText: t("Nav.rugby", "Rugby"), href: "/rugby" },
  { id: 22880, image: "/images/icon/eshooter.png", linkText: t("Nav.eshooter", "eShooter"), href: "/eshooter" },
  { id: 16407, image: "/images/icon/boxing.png", linkText: t("Nav.boxing", "Boxing"), href: "/boxing" },
  { id: 35315, image: "/images/icon/mma.png", linkText: t("Nav.mma", "MMA"), href: "/mma" },
  { id: 36847, image: "/images/icon/futsal.png", linkText: t("Nav.futsal", "Futsal"), href: "/futsal" },
  { id: 21618, image: "/images/icon/bandy.png", linkText: t("Nav.bandy", "Bandy"), href: "/bandy" },
  { id: 46537, image: "/images/icon/waterpolo.png", linkText: t("Nav.waterpolo", "Waterpolo"), href: "/waterpolo" },
  { id: 52015, image: "/images/icon/floorball.png", linkText: t("Nav.floorball", "Floorball"), href: "/floorball" },
  { id: 11840, image: "/images/icon/cycling.png", linkText: t("Nav.cycling", "Cycling"), href: "/cycling" },
  { id: 42481, image: "/images/icon/specials.png", linkText: t("Nav.specials", "Specials"), href: "/specials" },
  { id: 36378, image: "/images/icon/darts.png", linkText: t("Nav.darts", "Darts"), href: "/darts" },
  { id: 26395, image: "/images/icon/squash.png", linkText: t("Nav.squash", "Squash"), href: "/squash" },
  { id: 29229, image: "/images/icon/wrestling.png", linkText: t("Nav.wrestling", "Wrestling"), href: "/wrestling" }
];

// MENÚ PRINCIPAL (6 items)
export const naviTemData = (t: TFunc) => [
  { id: 112232, linkText: t("Nav.home", "Home"), href: "/" },
  // 👇 Nuevo: Mundial / World Cup
  { id: 151273, linkText: t("Nav.world_cup", "World Cup"), href: "/world-cup" },
  { id: 151272, linkText: t("Nav.sports", "Sports"), href: "/soccer" },

  // sección tipo noticias / intención de trading narrativo
  { id: 210001, linkText: t("Nav.politics", "Politics"), href: "/politics" },
  { id: 210002, linkText: t("Nav.finance", "Finance"), href: "/finance" },
  { id: 210003, linkText: t("Nav.crypto", "Crypto"), href: "/crypto" },
  { id: 210016, linkText: t("Nav.nfts", "NFTs"), href: "/nfts" },
  { id: 210017, linkText: t("Nav.defi", "DeFi"), href: "/defi" },
  { id: 210018, linkText: t("Nav.ai", "AI"), href: "/ai" },
  { id: 210004, linkText: t("Nav.geopolitics", "Geopolitics"), href: "/geopolitics" },
  { id: 210007, linkText: t("Nav.culture", "Culture"), href: "/culture" },
  { id: 210009, linkText: t("Nav.economy", "Economy"), href: "/economy" },
  { id: 210010, linkText: t("Nav.elections", "Elections"), href: "/elections" },
  { id: 122880, linkText: t("Nav.promotions", "Promotions"), href: "/promotions" },
  { id: 210012, linkText: t("Nav.health", "Health"), href: "/health" },
  { id: 210013, linkText: t("Nav.science", "Science"), href: "/science" },
  { id: 210014, linkText: t("Nav.entertainment", "Entertainment"), href: "/entertainment" },
  { id: 210015, linkText: t("Nav.commodities", "Commodities"), href: "/commodities" },
  { id: 210011, linkText: t("Nav.other", "Other"), href: "/other" },



];


// Categorías principales tipo Polymarket
export const marketsCategories = (t: TFunc): NavItem[] => [
  { id: 1, linkText: t("Markets.trending", "Trending"), href: "/markets?cat=Trending" },
  { id: 2, linkText: t("Markets.breaking", "Breaking"), href: "/markets?cat=Breaking" },
  { id: 3, linkText: t("Markets.new", "New"), href: "/markets?cat=New" },
  { id: 4, linkText: t("Markets.politics", "Politics"), href: "/markets?cat=Politics" },
  { id: 5, linkText: t("Markets.sports", "Sports"), href: "/markets?cat=Sports" },
  { id: 6, linkText: t("Markets.finance", "Finance"), href: "/markets?cat=Finance" },
  { id: 7, linkText: t("Markets.crypto", "Crypto"), href: "/markets?cat=Crypto" },
  { id: 8, linkText: t("Markets.geopolitics", "Geopolitics"), href: "/markets?cat=Geopolitics" },
  { id: 9, linkText: t("Markets.earnings", "Earnings"), href: "/markets?cat=Earnings" },
  { id: 10, linkText: t("Markets.tech", "Tech"), href: "/markets?cat=Tech" },
  { id: 11, linkText: t("Markets.culture", "Culture"), href: "/markets?cat=Culture" },
  { id: 12, linkText: t("Markets.world", "World"), href: "/markets?cat=World" },
  { id: 13, linkText: t("Markets.economy", "Economy"), href: "/markets?cat=Economy" },
  { id: 14, linkText: t("Markets.elections", "Elections"), href: "/markets?cat=Elections" },
  { id: 15, linkText: t("Markets.mentions", "Mentions"), href: "/markets?cat=Mentions" },
];


// categorías específicas de política / gobierno / geopolítica
export const politicsCategories = (t: TFunc): NavItem[] => [
  { id: 1, linkText: t("Politics.all", "All"), href: "/markets/politics?cat=all" },
  { id: 2, linkText: t("Politics.trump", "Trump"), href: "/markets/politics?cat=trump" },
  { id: 3, linkText: t("Politics.us_election", "US Election"), href: "/markets/politics?cat=us-election" },
  { id: 4, linkText: t("Politics.congress", "Congress"), href: "/markets/politics?cat=congress" },
  { id: 5, linkText: t("Politics.senate", "Senate"), href: "/markets/politics?cat=senate" },
  { id: 6, linkText: t("Politics.white_house", "Cabinet / White House"), href: "/markets/politics?cat=cabinet" },
  { id: 7, linkText: t("Politics.courts", "Courts"), href: "/markets/politics?cat=courts" },
  { id: 8, linkText: t("Politics.h1b", "H-1B / Immigration"), href: "/markets/politics?cat=h1b" },
  { id: 9, linkText: t("Politics.trade", "Trade / Tariffs"), href: "/markets/politics?cat=trade" },
  { id: 10, linkText: t("Politics.gov_shutdown", "Gov Shutdown"), href: "/markets/politics?cat=shutdown" },
  { id: 11, linkText: t("Politics.global_elections", "Global Elections"), href: "/markets/politics?cat=global-elections" },
  { id: 12, linkText: t("Politics.geopolitics", "Geopolitics"), href: "/markets/politics?cat=geopolitics" },
  { id: 13, linkText: t("Politics.ukraine", "Ukraine"), href: "/markets/politics?cat=ukraine" },
  { id: 14, linkText: t("Politics.gaza", "Gaza / Israel"), href: "/markets/politics?cat=gaza" },
  { id: 15, linkText: t("Politics.ven", "Venezuela"), href: "/markets/politics?cat=venezuela" },
  { id: 16, linkText: t("Politics.asia", "South Korea"), href: "/markets/politics?cat=south-korea" },
  { id: 17, linkText: t("Politics.eu", "Romania / EU"), href: "/markets/politics?cat=romania" },
  { id: 18, linkText: t("Politics.tech_conflict", "Trump vs Elon"), href: "/markets/politics?cat=trump-vs-elon" },
  { id: 19, linkText: t("Politics.scandal", "Epstein / Scandals"), href: "/markets/politics?cat=scandals" },
  { id: 20, linkText: t("Politics.local", "NYC Mayor"), href: "/markets/politics?cat=nyc-mayor" },
];


