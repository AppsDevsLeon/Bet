"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { naviTemData } from "@/public/data/navData";
import { useI18n } from "@/lib/i18n/I18nProvider";

/** Si usas rutas con locale (/en, /es), lo limpiamos para comparar.  */
const stripLocale = (p: string) => p.replace(/^\/(es|en|pt)(?=\/|$)/, "") || "/";

/** Activo por igualdad o por subruta (ej. /sports y /sports/nfl) */
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
      {items.map((item: { id: string | number; href: string; linkText: string }) => {
        const active = isActivePath(item.href, pathname);
        return (
          <li className="dropdown show-dropdown" key={item.id}>
            <Link
              href={item.href}
              className={`navunik ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
              data-active={active ? "true" : undefined}
              prefetch={false}
            >
              {item.linkText}
            </Link>
          </li>
        );
      })}
    </>
  );
}
