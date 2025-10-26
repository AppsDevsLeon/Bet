"use client";
import Link from "next/link";
import { useRouter } from "next/router";
// Importa tu FooterCard (si lo usas aquí)
import FooterCard from "../Shared/FooterCard";
// Importa tu wizard/modal para elegir cripto/red
// import CryptoSelectorWizard from "./CryptoSelectorWizard";

export default function ParticiparPage() {
  const { query } = useRouter();
  const id = String(query.id || "");

  return (
    <main className="container">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-xl font-bold">Participar en la apuesta #{id}</h1>
        <Link className="cmn-btn third-alt" href={`/apuestas/${id}`}>Volver</Link>
      </header>

      <section className="card space-y-4">
        {/* Aquí abre tu modal o inline: seleccionar cripto (6x6 grid), luego red, luego monto */}
        {/* <CryptoSelectorWizard open={open} onDone={...} chains={...} iconCatalogUrl={...} /> */}

        {/* Si usas tu FooterCard para el flujo de “verificar saldo y Place Bet”, lo montas aquí */}
        <FooterCard />
      </section>
    </main>
  );
}
