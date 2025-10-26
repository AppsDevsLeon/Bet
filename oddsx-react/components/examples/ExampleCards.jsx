"use client";
import dynamic from "next/dynamic";
import soccer1 from "@/components/sports/animations/soccer1.json";
import soccer2 from "@/components/sports/animations/soccer2.json";
import basketball from "@/components/sports/animations/basketball.json";
import SportsCard from "@components/sports/componentes/SportsCard";

const Soccer1SVG = dynamic(() => import("@/components/svgs/Soccer1SVG"), { ssr: false });
const Soccer2SVG = dynamic(() => import("@/components/svgs/Soccer2SVG"), { ssr: false });
const BasketSVG  = dynamic(() => import("@/components/svgs/BasketSVG"),  { ssr: false });

export default function ExampleCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <SportsCard config={soccer1}>
        <Soccer1SVG />
      </SportsCard>
      <SportsCard config={soccer2}>
        <Soccer2SVG />
      </SportsCard>
      <SportsCard config={basketball}>
        <BasketSVG />
      </SportsCard>
    </div>
  );
}
