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
import LiveEventsTicker from "@/components/reusable/LiveEventsTicker";
import LiveInPlay from "@/components/Pages/LiveInPlay/LiveInPlay";
import UpcomingByDate from "@/components/Pages/UpcomingByDate/UpcomingByDate";
import NFL from "@/components/Pages/AmericanFootball/UpCmingAmericanFootball";


export default function Home() {
  return (
    <>
      <HeadBlue />
      <Head />
      {/* Franja de partidos debajo del header 
       <LiveEventsTicker fixedTop={false} belowHeader headerOffset={100} />*/}
      <Inicio />
      <HeroSlider />
      <LiveMatches />
      <LiveMatches />
      <MiddleSlider />
      <UpComingEvents />
      <NFL/>
      <main className="p-6 space-y-10">
        {/*<LiveInPlay />
      <UpcomingByDate />*/}
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

