"use client";

import Image from "next/image";
import Link from "next/link";
import { IconStarFilled } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { popularData, otherSportsData } from "@/public/data/navData";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function SideNav() {
  const path = usePathname();
  const { t } = useI18n();

  // 👇 invoca las funciones con t()
  const populares = popularData(t);
  const otros = otherSportsData(t);

  return (
    <>
      <ul className="secend-actives bg1-color rounded-5 d-flex flex-column gap-5 mb-5">
        <li className="active">
          <Link href="/" className="d-flex align-items-center gap-2">
            <i className="ti ti-brand-google-home n5-color fs-five"></i>
            {t("SideNav.home", "Home")}
          </Link>
        </li>

        <li className="active">
          <Link href="#" className="d-flex align-items-center gap-2">
            <i className="ti ti-garden-cart n5-color fs-five"></i>
            {t("SideNav.marketplace", "Marketplace")}
          </Link>
        </li>

        <li className="active">
          <Link href="/efighting" className="d-flex align-items-center gap-2">
            {/* tu SVG original */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
              <path d="M12 7.35176C12.6243 7.35116 13.228 7.55648 ..." fill="#BDC2D1" />
            </svg>
            {t("SideNav.in_play", "In-Play")}
          </Link>
        </li>
      </ul>

      <hr className="py-0 my-0" />

      <h5 className="mb-4 mb-md-6 mt-4 mt-md-6">
        {t("NavSection.popular", "Popular")}
      </h5>
      <ul className="aside_namelist d-flex flex-column gap-2">
        {populares.map((item) => (
          <li
            key={item.id}
            className={`d-flex align-items-center justify-content-between px-3 py-2 rounded-3 gap-5 ${path === item.href ? "n11-bg" : ""}`}
          >
            <Link href={item.href} className="d-flex align-items-center gap-2">
              <Image width={16} height={16} src={item.image} alt={item.linkText} />
              {item.linkText}
            </Link>
            {path === item.href && (
              <button type="button" className="g1-color">
                <IconStarFilled width={16} height={16} className="ti ti-star navinStyleClass navinstyle" />
              </button>
            )}
          </li>
        ))}
      </ul>

      <hr className="py-0 my-5" />

      <h5 className="mb-4 mb-md-6">
        {t("NavSection.other_sports", "Other sports")}
      </h5>
      <ul className="aside_namelist d-flex flex-column gap-2 mb-15">
        {otros.map((item) => (
          <li
            key={item.id}
            className={`d-flex align-items-center justify-content-between px-3 py-2 rounded-3 gap-5 ${path === item.href ? "n11-bg" : ""}`}
          >
            <Link href={item.href} className="d-flex align-items-center gap-2">
              <Image width={16} height={16} src={item.image} alt={item.linkText} />
              {item.linkText}
            </Link>
            {path === item.href && (
              <button type="button" className="g1-color">
                <IconStarFilled width={16} height={16} className="ti ti-star navinStyleClass navinstyle" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
