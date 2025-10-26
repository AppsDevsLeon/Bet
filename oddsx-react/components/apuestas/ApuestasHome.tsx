"use client";
import Link from "next/link";

export default function ApuestasHome() {
  return (
    <main className="container">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-xl font-bold">Apuestas (cripto)</h1>
        <Link className="cmn-btn" href="/apuestas/nueva">Crear apuesta</Link>
      </header>

      {/* Aquí renderiza tu listado de apuestas, filtros, etc. */}
      <ul className="space-y-3">
        {/* Ejemplo de item */}
        <li className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Apuesta #123</div>
              <div className="text-sm opacity-70">2 opciones: A favor / En contra</div>
            </div>
            <Link className="cmn-btn third-alt" href="/apuestas/123">Ver detalle</Link>
          </div>
        </li>
      </ul>
    </main>
  );
}
