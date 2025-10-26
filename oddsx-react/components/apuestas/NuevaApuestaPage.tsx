"use client";
import Link from "next/link";
// Importa tu wizard si quieres usarlo aquí también
// import CryptoSelectorWizard from "./CryptoSelectorWizard";

export default function NuevaApuestaPage() {
  return (
    <main className="container">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-xl font-bold">Crear apuesta</h1>
        <Link className="cmn-btn third-alt" href="/apuestas">Volver</Link>
      </header>

      {/* Formulario mínimo (tú lo reemplazas por el tuyo) */}
      <section className="card space-y-4">
        <label className="block">
          <span>Título</span>
          <input className="input w-full" placeholder="Ej. Equipo A vs Equipo B" />
        </label>
        <label className="block">
          <span>Descripción</span>
          <textarea className="input w-full" rows={4} />
        </label>

        {/* Lugar para abrir tu modal de cripto/red si lo quieres ya desde la creación */}
        {/* <CryptoSelectorWizard open={open} ... /> */}

        <div className="flex gap-3 justify-end">
          <Link className="cmn-btn third-alt" href="/apuestas">Cancelar</Link>
          <button className="cmn-btn">Publicar</button>
        </div>
      </section>
    </main>
  );
}
