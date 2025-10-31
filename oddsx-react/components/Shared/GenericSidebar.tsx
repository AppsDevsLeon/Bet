"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconStarFilled } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

export type GenericNavItem = {
  id: number | string;
  label: string;
  href: string;

  // 👇 ahora soporta dos maneras:
  iconNode?: React.ReactNode; // <IconCrypto className="..." size={16}/>
  iconSrc?: string;           // "/images/icon/soccer-icon.png"

  count?: number;             // numerito derecha opcional
};

export type SidebarSection = {
  id: string;
  title?: string;
  searchable?: boolean;
  items: GenericNavItem[];
};

export type GenericSidebarProps = {
  sections: SidebarSection[];

  // para resaltar cuál está seleccionado y hacer filtros locales
  activeId?: number | string;
  onSelectItem?: (id: number | string) => void;
};

export default function GenericSidebar({
  sections,
  activeId,
  onSelectItem,
}: GenericSidebarProps) {
  const pathname = usePathname();
  const [searchMap, setSearchMap] = useState<Record<string, string>>({});

  function handleSearchChange(sectionId: string, value: string) {
    setSearchMap((prev) => ({ ...prev, [sectionId]: value }));
  }

  function getFilteredItems(section: SidebarSection) {
    const term = (searchMap[section.id] || "").trim().toLowerCase();
    if (!term) return section.items;
    return section.items.filter((it) =>
      it.label.toLowerCase().includes(term)
    );
  }

  return (
    <>
      {/* BLOQUE SUPERIOR, igual estilo que tu SideNav actual */}
      <ul className="secend-actives bg1-color rounded-5 d-flex flex-column gap-5 mb-5">
        <li className={pathname === "/" ? "active" : ""}>
          <Link href="/" className="d-flex align-items-center gap-2">
            <i className="ti ti-brand-google-home n5-color fs-five" />
            Home
          </Link>
        </li>

        <li className={pathname === "/marketplace" ? "active" : ""}>
          <Link
            href="/marketplace"
            className="d-flex align-items-center gap-2"
          >
            <i className="ti ti-garden-cart n5-color fs-five" />
            Marketplace
          </Link>
        </li>

        <li className={pathname === "/efighting" ? "active" : ""}>
          <Link href="/efighting" className="d-flex align-items-center gap-2">
            {/* placeholder tu ícono de in-play / pelea */}
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
            {/* Título (Popular, Timeframes, Assets...) */}
            {section.title && (
              <h5
                className={`mb-4 mb-md-6 ${
                  sectionIndex === 0 ? "mt-4 mt-md-6" : ""
                }`}
              >
                {section.title}
              </h5>
            )}

            {/* Buscador por sección si searchable === true */}
            {section.searchable && (
              <div className="px-3 mb-3">
                <div className="position-relative w-100">
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
                    onChange={(e) =>
                      handleSearchChange(section.id, e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            <ul className="aside_namelist d-flex flex-column gap-2">
              {filteredItems.map((item) => {
                const isRouteActive = pathname === item.href;
                const isPicked = String(activeId) === String(item.id);

                // mismo highlight que tu SideNav: n11-bg
                const liActiveClass =
                  isRouteActive || isPicked ? "n11-bg" : "";

                return (
                  <li
                    key={item.id}
                    className={[
                      "d-flex align-items-center justify-content-between px-3 py-2 rounded-3 gap-5",
                      liActiveClass,
                    ].join(" ")}
                    onClick={() => {
                      if (onSelectItem) onSelectItem(item.id);
                    }}
                    style={{ cursor: onSelectItem ? "pointer" : "default" }}
                  >
                    <Link
                      href={item.href || "#"}
                      onClick={(e) => {
                        // si estás usando selección local (ej. filtrar crypto)
                        // NO navegues
                        if (onSelectItem && item.href === "#") {
                          e.preventDefault();
                        }
                      }}
                      className="d-flex align-items-center gap-2 flex-grow-1 text-decoration-none"
                    >
                      {/* primero intenta iconNode (React SVG),
                         si no hay, cae a iconSrc (png) */}
                      {item.iconNode ? (
                        <span
                          className="d-inline-flex align-items-center justify-content-center"
                          style={{ width: 16, height: 16 }}
                        >
                          {item.iconNode}
                        </span>
                      ) : item.iconSrc ? (
                        <Image
                          width={16}
                          height={16}
                          src={item.iconSrc}
                          alt={item.label}
                        />
                      ) : null}

                      <span className="text-truncate">{item.label}</span>
                    </Link>

                    {/* numerito derecha si lo hay */}
                    {typeof item.count === "number" && (
                      <span className="badge bg-transparent text-muted border-0 p-0 fs-10">
                        {item.count}
                      </span>
                    )}

                    {/* estrellita cuando activo */}
                    {(isRouteActive || isPicked) && (
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

              {filteredItems.length === 0 && (
                <li className="px-3 py-4 rounded-3 text-center text-muted border border-dashed">
                  <span style={{ fontSize: "12px" }}>No matches</span>
                </li>
              )}
            </ul>

            {sectionIndex < sections.length - 1 && (
              <hr className="py-0 my-5" />
            )}
          </div>
        );
      })}
    </>
  );
}
