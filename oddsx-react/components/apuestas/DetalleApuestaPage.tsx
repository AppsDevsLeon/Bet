"use client";
import Link from "next/link";
import { useRouter } from "next/router";

export default function DetalleApuestaPage() {
  const { query } = useRouter();
  const id = String(query.id || "");

  return (
    <main className="container">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-xl font-bold">Apuesta #{id}</h1>
        <Link className="cmn-btn third-alt" href="/apuestas">Volver</Link>
      </header>

      <section className="card space-y-4">
        {/* Muestra información de la apuesta, mercados, estado, etc. */}
        <p className="opacity-80">Aquí va el detalle y el estado on-chain/off-chain.</p>

        <div className="flex gap-3">
          <Link className="cmn-btn" href={`/apuestas/${id}/participar`}>Participar</Link>
        </div>
      </section>
    </main>
  );
}
