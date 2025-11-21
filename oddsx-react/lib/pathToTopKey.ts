// lib/routerCategory.ts
export type CategorySlug =
  | "worldcup"
  | "sports"
  | "politics"
  | "finance"
  | "crypto"
  | "nfts"
  | "defi"
  | "ai"
  | "geopolitics"
  | "culture"
  | "economy"
  | "elections"
  | "promotions"
  | "health"
  | "science"
  | "entertainment"
  | "commodities"
  | "other"
  | "markets"
  | "general";

function normalizePath(p: string) {
  p = p.split("?")[0].split("#")[0] || "/";
  p = p.replace(/\/+/g, "/");
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  // locales comunes
  p = p.replace(/^\/(es|en|pt|fr|de|it)(\/|$)/i, "/");
  return p.toLowerCase();
}

/** Mapea pathname → categoría */
export function categoryFromPath(pathname: string): CategorySlug {
  const p = normalizePath(pathname);

  const TABLE: Array<[prefix: string, cat: CategorySlug]> = [
    ["/world-cup", "worldcup"],


    // Narrativo / noticias / mercados temáticos
    ["/politics", "politics"],
    ["/finance", "finance"],
    ["/crypto", "crypto"],
    ["/nfts", "nfts"],
    ["/defi", "defi"],
    ["/ai", "ai"],
    ["/geopolitics", "geopolitics"],
    ["/culture", "culture"],
    ["/economy", "economy"],
    ["/elections", "elections"],
    ["/promotions", "promotions"],
    ["/health", "health"],
    ["/science", "science"],
    ["/entertainment", "entertainment"],
    ["/commodities", "commodities"],
    ["/other", "other"],

    // Detalles / listados de mercados
    ["/market", "markets"],
    ["/markets", "markets"],
  ];

  for (const [prefix, cat] of TABLE) {
    if (p === prefix || p.startsWith(prefix + "/")) return cat;
  }
  return "general";
}
