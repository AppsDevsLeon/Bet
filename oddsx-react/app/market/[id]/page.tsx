import { notFound } from "next/navigation";
import { MARKETS, type MarketCard } from "@/public/data/marketsData";
import MarketDetailClient from "./MarketDetailClient";

// Necesario si usas output: "export"
export const dynamic = "error";
export const dynamicParams = false;

// SSG para rutas dinámicas
export function generateStaticParams() {
  // AQUI YA SE PUEDE LEER MARKETS porque ya no viene de /public
  return MARKETS.map((m) => ({ id: m.id }));
}

export default function Page({ params }: { params: { id: string } }) {
  const market = MARKETS.find((x) => x.id === params.id) as MarketCard | undefined;
  if (!market) return notFound();
  return <MarketDetailClient market={market} />;
}
