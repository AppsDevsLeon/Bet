"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

/* ======================
   Tipos
====================== */

export type GenericNavItem = {
  id: number | string;
  label: string;
  href?: string;
  iconNode?: React.ReactNode;
  count?: number;
};

export type SidebarSection = {
  id: string;
  title?: string;
  searchable?: boolean;
  items: GenericNavItem[];
};

export type Dock = "left" | "right" | "bottom";

export type GenericSidebarDockProps = {
  /** Datos (secciones + items) */
  sections: SidebarSection[];
  /** Item activo */
  activeId: number | string;
  /** Callback al seleccionar */
  onSelectItem: (id: number | string) => void;

  /** sticky (por defecto) o fixed */
  variant?: "sticky" | "fixed";
  /** dónde se acopla: izquierda, derecha o fondo */
  dock?: Dock;

  /** offsets */
  topOffset?: number; // para left/right sticky/fixed
  bottomOffset?: number; // para bottom fijo (ej. si ya hay otro footer)
  /** dimensiones */
  width?: number; // ancho para left/right
  heightBottom?: number; // alto para barra inferior

  /** estética */
  showRightDivider?: boolean;
  showMainBlock?: boolean;

  /** Accesibilidad */
  ariaLabel?: string;
};

/* ======================
   Constantes de estilo
====================== */

const BLUE = "#1E3C8E";
const BORDER_LIGHT = "#e5e7eb";
const FONT_FAMILY =
  'system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif';

/* ======================
   Componente principal
====================== */

export default function GenericSidebarDock({
  sections,
  activeId,
  onSelectItem,
  variant = "sticky",
  dock = "left",
  topOffset = 0,
  bottomOffset = 0,
  width = 260,
  heightBottom = 72,
  showRightDivider = true,
  showMainBlock = false,
  ariaLabel,
}: GenericSidebarDockProps) {
  const [searchTerm, setSearchTerm] = useState("");

  /** ====== Wrapper styles según dock ====== */
  const baseWrapper: React.CSSProperties = {
    fontFamily: FONT_FAMILY,
    background: "#fff",
    zIndex: 50,
  };

  let wrapperStyle: React.CSSProperties = baseWrapper;

  if (dock === "bottom") {
    // Barra fija inferior con scroller horizontal propio
    wrapperStyle =
      variant === "fixed"
        ? {
            ...baseWrapper,
            position: "fixed",
            left: 0,
            right: 0,
            bottom: bottomOffset,
            height: heightBottom,
            borderTop: `1px solid ${BORDER_LIGHT}`,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            padding: "8px 8px",
          }
        : {
            ...baseWrapper,
            position: "sticky",
            bottom: 0,
            height: heightBottom,
            borderTop: `1px solid ${BORDER_LIGHT}`,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            padding: "8px 8px",
          };
  } else {
    // left / right como sidebar vertical
    const sideProps =
      dock === "left"
        ? {
            left: 0,
            borderRight: showRightDivider ? `1px solid ${BORDER_LIGHT}` : "none",
          }
        : { right: 0, borderLeft: `1px solid ${BORDER_LIGHT}` };

    wrapperStyle =
      variant === "fixed"
        ? {
            ...baseWrapper,
            position: "fixed",
            top: topOffset,
            ...(sideProps as any),
            width,
            height: `calc(100vh - ${topOffset}px)`,
            overflowY: "auto",
            padding: "12px 12px 24px 12px",
          }
        : {
            ...baseWrapper,
            position: "sticky",
            top: topOffset,
            ...(dock === "left"
              ? { borderRight: `1px solid ${BORDER_LIGHT}` }
              : { borderLeft: `1px solid ${BORDER_LIGHT}` }),
            width,
            padding: "12px 12px 24px 12px",
          };
  }

  /** ====== Render para barra inferior (horizontal scroller) ====== */
  if (dock === "bottom") {
    const flatItems = sections.flatMap((s) => s.items);

    return (
      <aside style={wrapperStyle} aria-label={ariaLabel ?? "Bottom dock navigation"}>
        <div
          style={{
            width: "100%",
            height: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            scrollbarWidth: "thin",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
              padding: "0 4px",
              minWidth: "100%",
            }}
          >
            {flatItems.map((it) => {
              const isActive = String(activeId) === String(it.id);
              const bgColor = isActive ? BLUE : "#f3f4f6";
              const textColor = isActive ? "#fff" : "#0f172a";
              const borderColor = isActive ? BLUE : BORDER_LIGHT;

              return (
                <button
                  key={it.id}
                  onClick={() => onSelectItem(it.id)}
                  style={{
                    cursor: "pointer",
                    userSelect: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 999,
                    border: `1px solid ${borderColor}`,
                    background: bgColor,
                    color: textColor,
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                  title={it.label}
                >
                  {it.iconNode ? (
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: textColor,
                      }}
                    >
                      {it.iconNode}
                    </span>
                  ) : null}
                  <span>{it.label}</span>
                  {typeof it.count === "number" ? (
                    <span
                      style={{
                        marginLeft: 4,
                        fontWeight: 700,
                        opacity: 0.9,
                      }}
                    >
                      {it.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    );
  }

  /** ====== Render para barras laterales (vertical con scroll propio) ====== */
  return (
    <aside style={wrapperStyle} aria-label={ariaLabel ?? "Sidebar navigation"}>
      {sections.map((section, sectionIdx) => {
        const visibleItems = section.searchable
          ? section.items.filter((it) =>
              it.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : section.items;

        const isFirstBlock = sectionIdx === 0;

        return (
          <div key={section.id} style={{ marginBottom: 16 }}>
            {/* Título de sección */}
            {section.title ? (
              <div
                style={{
                  color: BLUE,
                  fontSize: 16,
                  lineHeight: 1.2,
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                {section.title}
              </div>
            ) : null}

            {/* Buscador por sección (opcional) */}
            {section.searchable ? (
              <div style={{ marginBottom: 12 }}>
                <div style={{ position: "relative" }}>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search"
                    style={{
                      width: "100%",
                      fontSize: 13,
                      borderRadius: 6,
                      border: `1px solid ${BORDER_LIGHT}`,
                      padding: "8px 8px 8px 28px",
                      lineHeight: 1.2,
                      color: BLUE,
                      outline: "none",
                      background: "#fff",
                    }}
                    aria-label="Buscar en la sección"
                  />
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 12,
                      lineHeight: 1,
                      color: BLUE,
                    }}
                  >
                    🔍
                  </span>
                </div>
              </div>
            ) : null}

            {/* Lista */}
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {visibleItems.map((it) => {
                const isActive = String(activeId) === String(it.id);
                const bgColor = isActive ? BLUE : "transparent";
                const textColor = isActive ? "#fff" : BLUE;

                return (
                  <li
                    key={it.id}
                    onClick={() => onSelectItem(it.id)}
                    style={{
                      cursor: "pointer",
                      userSelect: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: 8,
                      padding: "10px 10px",
                      backgroundColor: bgColor,
                      transition: "background-color .15s ease",
                    }}
                  >
                    {/* Izquierda: icono + label */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        minWidth: 0,
                        flex: "1 1 auto",
                        color: textColor,
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: 1.2,
                      }}
                    >
                      {it.iconNode ? (
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: textColor,
                          }}
                        >
                          {it.iconNode}
                        </span>
                      ) : null}

                      <span
                        style={{
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          maxWidth: 160,
                          color: textColor,
                        }}
                        title={it.label}
                      >
                        {it.label}
                      </span>
                    </div>

                    {/* Derecha: count y estrella si activo */}
                    <div
                      style={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        lineHeight: 1,
                        color: textColor,
                        fontWeight: 500,
                        minWidth: 24,
                        justifyContent: "flex-end",
                      }}
                    >
                      {typeof it.count === "number" ? (
                        <span style={{ color: textColor }}>{it.count}</span>
                      ) : null}

                      {isActive ? (
                        <svg
                          width={16}
                          height={16}
                          viewBox="0 0 24 24"
                          fill={textColor}
                          aria-hidden="true"
                          style={{ display: "block" }}
                        >
                          <path d="M12 2.5 14.9 9l7.1.6-5.4 4.6 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.6 9.1 9 12 2.5Z" />
                        </svg>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Divider si hay más secciones */}
            {isFirstBlock && sections.length > 1 ? (
              <div
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: BORDER_LIGHT,
                  margin: "16px 0 0 0",
                }}
              />
            ) : null}
          </div>
        );
      })}

      {showMainBlock ? (
        <div style={{ padding: 12 }}>{/* banner/promo opcional */}</div>
      ) : null}
    </aside>
  );
}

/* ======================
   Helpers de offset
====================== */

/** Empuja el contenido para que la barra inferior fija no lo tape */
export function withBottomDockOffset(
  node: React.ReactNode,
  heightBottom = 72,
  bottomOffset = 0
) {
  const total = heightBottom + bottomOffset;
  return <div style={{ paddingBottom: total }}>{node}</div>;
}

/** Desplaza el main cuando usas sidebar fijo left/right */
export function withFixedSidebarOffset(
  node: React.ReactNode,
  sidebarWidth = 260,
  dock: Dock = "left"
) {
  if (dock === "right") {
    return (
      <div style={{ marginRight: sidebarWidth, width: `calc(100% - ${sidebarWidth}px)` }}>
        {node}
      </div>
    );
  }
  return (
    <div style={{ marginLeft: sidebarWidth, width: `calc(100% - ${sidebarWidth}px)` }}>
      {node}
    </div>
  );
}

/* ======================
   Portal fijo (opcional)
====================== */

/**
 * Monta la barra fuera del flujo de tu layout (en <body>) para evitar que
 * "position: fixed" se rompa cuando un ancestro tiene transform/overflow.
 */
export function FixedDockPortal(props: GenericSidebarDockProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(<GenericSidebarDock {...props} />, document.body);
}

/* ======================
   USO DE EJEMPLO (copiar y pegar en tu página)
====================== */

/**
// 1) Barra inferior fija

"use client";
import React, { useState } from "react";
import GenericSidebarDock, { withBottomDockOffset, SidebarSection } from "@/components/GenericSidebarDock";

export default function PageBottomDock() {
  const [activeId, setActiveId] = useState<string | number>("home");
  const sections: SidebarSection[] = [
    { id: "dock", items: [
      { id: "home", label: "Home" },
      { id: "live", label: "Live" },
      { id: "today", label: "Today", count: 12 },
      { id: "promos", label: "Promos" },
      { id: "stats", label: "Stats" },
    ]},
  ];

  const content = (
    <main style={{ padding: 24 }}>
      <h1>Contenido</h1>
      <div style={{ height: 1600 }} />
    </main>
  );

  return (
    <>
      {withBottomDockOffset(content, 72, 0)}
      <GenericSidebarDock
        sections={sections}
        activeId={activeId}
        onSelectItem={setActiveId}
        variant="fixed"
        dock="bottom"
        heightBottom={72}
        bottomOffset={0}
      />
    </>
  );
}

// 2) Sidebar izquierda fija con scroll propio

"use client";
import React, { useState } from "react";
import GenericSidebarDock, { withFixedSidebarOffset, SidebarSection } from "@/components/GenericSidebarDock";

export default function PageLeftFixed() {
  const [activeId, setActiveId] = useState<string | number>("markets");
  const sections: SidebarSection[] = [
    {
      id: "main",
      title: "Menú",
      searchable: true,
      items: [
        { id: "markets", label: "Markets" },
        { id: "live", label: "Live", count: 8 },
        { id: "futures", label: "Futures" },
        { id: "results", label: "Results" },
      ],
    },
  ];

  const sidebarWidth = 260;
  const topOffset = 72; // altura de tus headers fijos si los tienes

  const main = (
    <main style={{ padding: 24 }}>
      <h1>Página</h1>
      <div style={{ height: 2000 }} />
    </main>
  );

  return (
    <>
      {withFixedSidebarOffset(main, sidebarWidth, "left")}
      <GenericSidebarDock
        sections={sections}
        activeId={activeId}
        onSelectItem={setActiveId}
        variant="fixed"
        dock="left"
        width={sidebarWidth}
        topOffset={topOffset}
        showRightDivider
      />
    </>
  );
}

// 3) Montaje con Portal si tienes transform/overflow en ancestros

"use client";
import React, { useState } from "react";
import { FixedDockPortal, SidebarSection } from "@/components/GenericSidebarDock";

export default function PagePortalDock() {
  const [activeId, setActiveId] = useState<string | number>("home");
  const sections: SidebarSection[] = [{ id: "dock", items: [ { id: "home", label: "Home" }, { id: "live", label: "Live" } ] }];
  return (
    <>
      <main style={{ padding: 24 }}>
        <h1>Contenido</h1>
        <div style={{ height: 1600 }} />
      </main>

      <FixedDockPortal
        sections={sections}
        activeId={activeId}
        onSelectItem={setActiveId}
        variant="fixed"
        dock="bottom"
        heightBottom={72}
      />
    </>
  );
}
*/
