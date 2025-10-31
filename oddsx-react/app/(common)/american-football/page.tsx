
import NFLSection from '@/components/Pages/AmericanFootball/UpCmingAmericanFootball';

export default function Page() {
  return (
    <>
      {/* Empuja el contenido hacia abajo para no quedar tapado por el header fijo */}
      <div
        style={{
          paddingTop: '15vh', // header ≈ 20% de alto pantalla
        }}
        className="min-h-screen bg-[#0F172A]" // opcional: fondo oscuro tipo sportsbook
      >
        <NFLSection sportSlug="nfl" />
      </div>
    </>
  );
}

