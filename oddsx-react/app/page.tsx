import HeaderMain from "@/components/Shared/HeaderMain";
import HeadBlue from "@/components/Shared/HeaderBlue";
import Head from "@/components/Shared/Head";
import HeroSlider from "@/components/Pages/Home/HeroSlider";
import HeroMatches from "@/components/Pages/Home/HeroMatches";
import LiveMatches from "@/components/Pages/Home/LiveMatches";
import MiddleSlider from "@/components/Pages/Home/MiddleSlider";
import UpComingEvents from "@/components/Pages/Home/UpComingEvents";
import Dashboard from "@/components/Pages/Dashboard/Dashboard";
import Inicio from '@/app/(common)/home/Home'
import MainFooter from "@/components/Shared/MainFooter";
import FooterCard from "@/components/Shared/FooterCard";
import  Banner from '@/components/banner/FifaPromoBanner'
import LiveEventsTicker from "@/components/reusable/LiveEventsTicker";
import LiveInPlay from "@/components/Pages/LiveInPlay/LiveInPlay";
import UpcomingByDate from "@/components/Pages/UpcomingByDate/UpcomingByDate";
import NFLSection from "@/components/Pages/AmericanFootball/UpCmingAmericanFootball";


export default function Home() {
  return (
    <>

      {/* Franja de partidos debajo del header 
       <LiveEventsTicker fixedTop={false} belowHeader headerOffset={100} />*/}
      <Inicio />

       {/* FOOTERS GLOBALES (abajo en todas las páginas) */}
                 <FooterCard />
                 <MainFooter />
      <main className="p-6 space-y-10">
      </main>

      {/*
       
  <Inicio/>

  <HeroMatches />
  <LiveMatches />
  <MiddleSlider />
  <UpComingEvents />
  <Dashboard/>
*/}
    </>
  );
}
