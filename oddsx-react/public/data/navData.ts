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
  { id: 57940, image: "/images/icon/soccer-icon.png",      linkText: t("Nav.soccer", "Soccer"),                 href: "/soccer" },
  { id: 13736, image: "/images/icon/tennis.png",           linkText: t("Nav.tennis", "Tennis"),                 href: "/tennis" },
  { id: 20998, image: "/images/icon/basketball.png",       linkText: t("Nav.basketball", "Basketball"),         href: "/basketball" },
  { id: 9058,  image: "/images/icon/cricket.png",          linkText: t("Nav.cricket", "Cricket"),               href: "/cricket" },
  { id: 41066, image: "/images/icon/ecricket.png",         linkText: t("Nav.ecricket", "eCricket"),             href: "/ecricket" },
  { id: 57911, image: "/images/icon/america-football.png", linkText: t("Nav.american_football", "American Football"), href: "/american-football" },
  { id: 33764, image: "/images/icon/ice-hockey.png",       linkText: t("Nav.ice_hockey", "Ice Hockey"),         href: "/ice-hockey" },
  { id: 20140, image: "/images/icon/nba2k.png",            linkText: t("Nav.nba2k", "NBA 2K"),                  href: "/nba-2k" },
  { id: 26979, image: "/images/icon/volleyball.png",       linkText: t("Nav.volleyball", "Volleyball"),         href: "/volleyball" },
  { id: 26344, image: "/images/icon/fifa-volta.png",       linkText: t("Nav.fifa_volta", "FIFA: Volta"),        href: "/fifa-volta" },
  { id: 29537, image: "/images/icon/penalty-shootout.png", linkText: t("Nav.penalty_shootout", "Penalty Shootout"), href: "/penalty-shootout" },
  { id: 18039, image: "/images/icon/handball.png",         linkText: t("Nav.handball", "Handball"),             href: "/handball" },
  { id: 3550,  image: "/images/icon/table-tennis.png",     linkText: t("Nav.table_tennis", "Table Tennis"),     href: "/table-tennis" }
];

// OTROS DEPORTES (17 items)
export const otherSportsData = (t: TFunc): NavCard[] => [
  { id: 12232, image: "/images/icon/kabaddi.png",          linkText: t("Nav.kabaddi", "Kabaddi"),               href: "/kabaddi" },
  { id: 20341, image: "/images/icon/efighting.png",        linkText: t("Nav.efighting", "eFighting"),           href: "/efighting" },
  { id: 51272, image: "/images/icon/erocket-league.png",   linkText: t("Nav.erocket_league", "eRocket League"), href: "/erocket-league" },
  { id: 55534, image: "/images/icon/aussie-rules.png",     linkText: t("Nav.aussie_rules", "Aussie Rules"),     href: "/aussie-rules" },
  { id: 38128, image: "/images/icon/rugby.png",            linkText: t("Nav.rugby", "Rugby"),                   href: "/rugby" },
  { id: 22880, image: "/images/icon/eshooter.png",         linkText: t("Nav.eshooter", "eShooter"),             href: "/eshooter" },
  { id: 16407, image: "/images/icon/boxing.png",           linkText: t("Nav.boxing", "Boxing"),                 href: "/boxing" },
  { id: 35315, image: "/images/icon/mma.png",              linkText: t("Nav.mma", "MMA"),                       href: "/mma" },
  { id: 36847, image: "/images/icon/futsal.png",           linkText: t("Nav.futsal", "Futsal"),                 href: "/futsal" },
  { id: 21618, image: "/images/icon/bandy.png",            linkText: t("Nav.bandy", "Bandy"),                   href: "/bandy" },
  { id: 46537, image: "/images/icon/waterpolo.png",        linkText: t("Nav.waterpolo", "Waterpolo"),           href: "/waterpolo" },
  { id: 52015, image: "/images/icon/floorball.png",        linkText: t("Nav.floorball", "Floorball"),           href: "/floorball" },
  { id: 11840, image: "/images/icon/cycling.png",          linkText: t("Nav.cycling", "Cycling"),               href: "/cycling" },
  { id: 42481, image: "/images/icon/specials.png",         linkText: t("Nav.specials", "Specials"),             href: "/specials" },
  { id: 36378, image: "/images/icon/darts.png",            linkText: t("Nav.darts", "Darts"),                   href: "/darts" },
  { id: 26395, image: "/images/icon/squash.png",           linkText: t("Nav.squash", "Squash"),                 href: "/squash" },
  { id: 29229, image: "/images/icon/wrestling.png",        linkText: t("Nav.wrestling", "Wrestling"),           href: "/wrestling" }
];

// MENÚ PRINCIPAL (6 items)
export const naviTemData = (t: TFunc) => [
  { id: 112232, linkText: t("Nav.home", "Home"),               href: "/" },
  { id: 120341, linkText: t("Nav.live_betting", "Live Betting"), href: "/floorball" },
  { id: 151272, linkText: t("Nav.sports", "Sports"),           href: "/soccer" },
  { id: 155534, linkText: t("Nav.esports", "eSports"),         href: "/ecricket" },
  { id: 138128, linkText: t("Nav.racing", "Racing"),           href: "/cycling" },
  { id: 122880, linkText: t("Nav.promotions", "Promotions"),   href: "/promotions" },

  
  // 👇 NUEVO
  { id: 99001,  linkText: t("Nav.dashboard", "Dashboard"),     href: "/dashboard" },
];


// Categorías principales tipo Polymarket
export const marketsCategories = (t: TFunc): NavItem[] => [
  { id: 1,  linkText: t("Markets.trending", "Trending"),       href: "/markets?cat=Trending" },
  { id: 2,  linkText: t("Markets.breaking", "Breaking"),       href: "/markets?cat=Breaking" },
  { id: 3,  linkText: t("Markets.new", "New"),                 href: "/markets?cat=New" },
  { id: 4,  linkText: t("Markets.politics", "Politics"),       href: "/markets?cat=Politics" },
  { id: 5,  linkText: t("Markets.sports", "Sports"),           href: "/markets?cat=Sports" },
  { id: 6,  linkText: t("Markets.finance", "Finance"),         href: "/markets?cat=Finance" },
  { id: 7,  linkText: t("Markets.crypto", "Crypto"),           href: "/markets?cat=Crypto" },
  { id: 8,  linkText: t("Markets.geopolitics", "Geopolitics"), href: "/markets?cat=Geopolitics" },
  { id: 9,  linkText: t("Markets.earnings", "Earnings"),       href: "/markets?cat=Earnings" },
  { id: 10, linkText: t("Markets.tech", "Tech"),               href: "/markets?cat=Tech" },
  { id: 11, linkText: t("Markets.culture", "Culture"),         href: "/markets?cat=Culture" },
  { id: 12, linkText: t("Markets.world", "World"),             href: "/markets?cat=World" },
  { id: 13, linkText: t("Markets.economy", "Economy"),         href: "/markets?cat=Economy" },
  { id: 14, linkText: t("Markets.elections", "Elections"),     href: "/markets?cat=Elections" },
  { id: 15, linkText: t("Markets.mentions", "Mentions"),       href: "/markets?cat=Mentions" },
];