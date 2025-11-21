// components/Shared/MainHeader.tsx
"use client";

import HeadBlue from "@/components/Shared/HeaderBlue";
import Head from "@/components/Shared/Head";


export default function MainHeader() {
  return (
    <>
      {/* Header fijo arriba */}
      <div className="mainHeader-wrapper">
        <HeadBlue />

      </div>

      {/* Spacer para empujar el contenido global hacia abajo
         (la altura debe coincidir con la altura real del header) */}
      <div className="mainHeader-spacer" />
    </>
  );
}
