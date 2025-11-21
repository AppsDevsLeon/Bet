"use client";

import React, { useState } from "react";

export type GenericNavItem = {
  id: number | string;
  label: string;
  href: string;
  iconNode?: React.ReactNode;
  count?: number;
};

export type SidebarSection = {
  id: string;
  title?: string;
  searchable?: boolean;
  items: GenericNavItem[];
};

export type GenericSidebarMobileProps = {
  sections: SidebarSection[];
  activeId: number | string;
  onSelectItem: (id: number | string) => void;
};

const BLUE = "#1E3C8E";
const BORDER_LIGHT = "#e5e7eb";
const FONT_FAMILY =
  'system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif';

export default function GenericSidebarMobile({
  sections,
  activeId,
  onSelectItem,
}: GenericSidebarMobileProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // juntamos todos los items de todas las secciones
  const flatItems: GenericNavItem[] = sections.flatMap((section) => {
    if (section.searchable) {
      return section.items.filter((it) =>
        it.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return section.items;
  });

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#fff",
        fontFamily: FONT_FAMILY,
        color: BLUE,
        borderBottom: `1px solid ${BORDER_LIGHT}`,
        padding: "8px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* buscador, sólo si alguna sección es searchable */}
      {sections.some((s) => s.searchable) ? (
        <div style={{ width: "100%" }}>
          <div style={{ position: "relative" }}>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              style={{
                width: "100%",
                fontSize: "13px",
            
                border: `1px solid ${BORDER_LIGHT}`,
                padding: "6px 8px 6px 28px",
                lineHeight: 1.2,
                color: BLUE,
                outline: "none",
                backgroundColor: "#fff",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "12px",
                lineHeight: 1,
                color: BLUE,
              }}
            >
              🔍
            </span>
          </div>
        </div>
      ) : null}

      {/* fila scrollable de pills */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {/* ocultar scrollbar en webkit */}
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {flatItems.map((it) => {
          const isActive = String(activeId) === String(it.id);

          return (
            <button
              key={it.id}
              onClick={() => onSelectItem(it.id)}
              style={{
                flexShrink: 0,
                border: `1px solid ${BLUE}`,
                backgroundColor: isActive ? BLUE : "#ffffffff",
                color: isActive ? "#fff" : "#1E3A8A",
                fontFamily: FONT_FAMILY,
                fontSize: "13px",
                fontWeight: 500,
                lineHeight: 1.2,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
              }}
            >
              {it.iconNode ? (
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isActive ? "#fff" : BLUE,
                    flexShrink: 0,
                  }}
                >
                  {it.iconNode}
                </span>
              ) : null}

              <span
                style={{
                  display: "inline-block",
                  maxWidth: "140px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {it.label}
              </span>

              {typeof it.count === "number" ? (
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    lineHeight: 1,
                    color: isActive ? "#fff" : BLUE,
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
  );
}
