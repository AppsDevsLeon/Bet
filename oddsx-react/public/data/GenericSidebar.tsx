"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconStarFilled } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

/* =========================================
   TIPOS GENÉRICOS
========================================= */

export type GenericNavItem = {
  id: number | string;
  label: string;          // lo que se muestra ("Soccer", "15 Min", "Bitcoin")
  href: string;           // a dónde navega
  icon?: string;          // ruta a png/svg/etc ("/images/icon/soccer-icon.png")
  count?: number;         // numerito a la derecha (opcional)
};

export type SidebarSection = {
  id: string;
  title?: string;         // "Popular", "Timeframes", "Markets", etc. (opcional)
  searchable?: boolean;   // si true, mostramos input buscar SOLO para ese bloque
  items: GenericNavItem[];
};

/* =========================================
   COMPONENTE
========================================= */

export type GenericSidebarProps = {
  sections: SidebarSection[];
  // ejemplo: [{id:"popular",title:"Popular", items:[...]} , {id:"crypto_time",title:"Timeframes",searchable:true, items:[...]}]
};

export default function GenericSidebar({ sections }: GenericSidebarProps) {
  const pathname = usePathname();

  // estado global de búsqueda por sección (clave = section.id)
  const [searchMap, setSearchMap] = useState<Record<string, string>>({});

  // handler para actualizar el término de búsqueda sólo de esa sección
  function handleSearchChange(sectionId: string, value: string) {
    setSearchMap((prev) => ({
      ...prev,
      [sectionId]: value,
    }));
  }

  // función que filtra items de UNA sección usando su propio searchTerm
  const getFilteredItems = (section: SidebarSection) => {
    const term = (searchMap[section.id] || "").trim().toLowerCase();
    if (!term) return section.items;
    return section.items.filter((it) =>
      it.label.toLowerCase().includes(term)
    );
  };

  return (
    <>
      {/* BLOQUE SUPERIOR tipo "Home / Marketplace / In-Play" como en tu SideNav actual */}
      <ul className="secend-actives bg1-color rounded-5 d-flex flex-column gap-5 mb-5">
        <li className={pathname === "/" ? "active" : ""}>
          <Link href="/" className="d-flex align-items-center gap-2">
            <i className="ti ti-brand-google-home n5-color fs-five"></i>
            Home
          </Link>
        </li>

        <li className={pathname === "/marketplace" ? "active" : ""}>
          <Link href="/marketplace" className="d-flex align-items-center gap-2">
            <i className="ti ti-garden-cart n5-color fs-five"></i>
            Marketplace
          </Link>
        </li>

        <li className={pathname === "/efighting" ? "active" : ""}>
          <Link href="/efighting" className="d-flex align-items-center gap-2">
            {/* tu SVG original tal cual */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="22"
              viewBox="0 0 24 22"
              fill="none"
            >
              <path
                d="M12 7.35176C12.6243 7.35116 13.228 7.55648 ..."
                fill="#BDC2D1"
              />
            </svg>
            In-Play
          </Link>
        </li>
      </ul>

      <hr className="py-0 my-0" />

      {/* SECCIONES DINÁMICAS */}
      {sections.map((section, sectionIndex) => {
        const filteredItems = getFilteredItems(section);

        return (
          <div key={section.id} className="mb-15">
            {/* TITLE de la sección */}
            {section.title && (
              <h5 className={`mb-4 mb-md-6 ${sectionIndex === 0 ? "mt-4 mt-md-6" : ""}`}>
                {section.title}
              </h5>
            )}

            {/* SEARCH de esta sección (opcional) */}
            {section.searchable && (
              <div className="px-3 mb-3">
                <div className="position-relative w-100">
                  {/* icono lupa */}
                  <span
                    className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"
                    style={{ fontSize: "12px" }}
                  >
                    🔍
                  </span>

                  <input
                    className="form-control form-control-sm rounded-3 ps-5 pe-3 py-2 bg-transparent border n11-border n11-bg text-white"
                    style={{ fontSize: "12px", lineHeight: 1.2 }}
                    placeholder="Search"
                    value={searchMap[section.id] || ""}
                    onChange={(e) => handleSearchChange(section.id, e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* LISTA DE ITEMS */}
            <ul className="aside_namelist d-flex flex-column gap-2">
              {filteredItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li
                    key={item.id}
                    className={[
                      "d-flex align-items-center justify-content-between px-3 py-2 rounded-3 gap-5",
                      isActive ? "n11-bg" : "",
                    ].join(" ")}
                  >
                    <Link
                      href={item.href}
                      className="d-flex align-items-center gap-2 flex-grow-1 text-decoration-none"
                    >
                      {/* icono izquierda si existe */}
                      {item.icon && (
                        <Image
                          width={16}
                          height={16}
                          src={item.icon}
                          alt={item.label}
                        />
                      )}

                      <span className="text-truncate">{item.label}</span>
                    </Link>

                    {/* badge numerito tipo count */}
                    {typeof item.count === "number" && (
                      <span className="badge bg-transparent text-muted border-0 p-0 fs-10">
                        {item.count}
                      </span>
                    )}

                    {/* estrellita cuando está activo (igual que tu SideNav actual) */}
                    {isActive && (
                      <button
                        type="button"
                        className="g1-color bg-transparent border-0 p-0 d-flex align-items-center"
                      >
                        <IconStarFilled
                          width={16}
                          height={16}
                          className="ti ti-star navinStyleClass navinstyle"
                        />
                      </button>
                    )}
                  </li>
                );
              })}

              {/* estado vacío si el filtro no encontró nada */}
              {filteredItems.length === 0 && (
                <li className="px-3 py-4 rounded-3 text-center text-muted border border-dashed">
                  <span style={{ fontSize: "12px" }}>No matches</span>
                </li>
              )}
            </ul>

            {/* separador visual entre secciones */}
            {sectionIndex < sections.length - 1 && (
              <hr className="py-0 my-5" />
            )}
          </div>
        );
      })}
    </>
  );
}
