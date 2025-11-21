"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { naviTemData } from "@/public/data/navData";
import { useI18n } from "@/lib/i18n/I18nProvider";

/** limpia /es /en /pt para comparar rutas */
const stripLocale = (p: string) => p.replace(/^\/(es|en|pt)(?=\/|$)/, "") || "/";

/** activo por igualdad o subruta */
const isActivePath = (href: string, path: string) => {
  if (!href) return false;
  const H = stripLocale(href);
  const P = stripLocale(path);
  if (H === "/") return P === "/";
  return P === H || (H !== "/" && P.startsWith(H + "/"));
};

export default function NavItem() {
  const pathname = usePathname() || "/";
  const { t } = useI18n();
  const items = naviTemData(t);

  return (
    <>
      {items.map((it: { id: string | number; href: string; linkText: string }) => {
        const active = isActivePath(it.href, pathname);
        return (
          <li key={it.id}>
            <Link
              href={it.href}
              className={active ? "active" : undefined}
              aria-current={active ? "page" : undefined}
              prefetch={false}
            >
              {it.linkText}
            </Link>
            <style jsx>{`
              a {
                display: block;
                padding: 6px 0;
                font-size: 14px;
                font-weight: 600;
                color: #0f172a;
                text-decoration: none;
                line-height: 1.2;
                white-space: nowrap;    /* evita cortar (World Cup) */
                word-break: keep-all;
                margin-left:40px;

      
              }
              a:hover { color: #1e3a8a; }
              a.active {
                color: #1e3a8a;
                position: relative;
              }
              a.active::after {
                content: "";
                position: absolute;
                left: 0; right: 0; bottom: -2px;
                height: 2px; background: #1e3a8a; border-radius: 1px;
              }
            `}</style>
          </li>
        );
      })}
    </>
  );
}
