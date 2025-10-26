"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

import {
  IconArrowBadgeRight,
  IconBrandTelegram,
  IconBrandGithubFilled,
  IconBrandBehance,
  IconBrandFacebookFilled,
  IconBrandDiscordFilled,
  IconCurrencyBitcoin,
  IconBrandInstagram,
} from "@tabler/icons-react";
import CryptoTicker from "@/components/generic/CryptoTicker";

export default function MainFooter() {
  const { t } = useI18n();

  // Helper: intenta "Footer.xxx" y si no existe, usa "xxx"
  const tr = (k: string) => t(`Footer.${k}`, t(k));

  return (
    <footer className="footer_section pt-10 pt-md-15 pt-lg-20 p2-bg pb-12 pb-md-0">
      <div className="container-fluid">
        <div className="row mb-10 mb-md-15 mb-lg-20">
          <div className="col-12">
            <div className="footer_section__main">
              <div className="row gy-8">
                {/* Deportes */}
                <div className="col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2">
                  <div className="footer_section__sports">
                    <h4 className="mb-5 mb-md-6">{tr("sports")}</h4>
                    <ul className="d-flex flex-column gap-5">
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("sports_link")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="/floorball">
                          {tr("live_betting")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("virtuals")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("football")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="/basketball">
                          {tr("basketball")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="/ice-hockey">
                          {tr("ice_hockey")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Promociones */}
                <div className="col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2">
                  <div className="footer_section__promotions">
                    <h4 className="mb-5 mb-md-6">{tr("promotions")}</h4>
                    <ul className="d-flex flex-column gap-5">
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="/promotions">
                          {tr("sports_promotions")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("tournaments")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("achievements")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("bonus_shop")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Ayuda */}
                <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2">
                  <div className="footer_section__help">
                    <h4 className="mb-5 mb-md-6">{tr("help")}</h4>
                    <ul className="d-flex flex-column gap-5">
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("help_link")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("bet_slip_check")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("deposits_withdrawals")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("sports_results")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("sports_stats")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Seguridad */}
                <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4 col-xxl-3">
                  <div className="footer_section__security">
                    <h4 className="mb-5 mb-md-6">{tr("security_privacy")}</h4>
                    <ul className="d-flex flex-column gap-5">
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("privacy_policy")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("terms_conditions")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("cookie_policy")}
                        </Link>
                      </li>
                      <li className="iconstyle d-flex align-items-center">
                        <IconArrowBadgeRight className="fs-five rtawin" />
                        <Link className="fs-ten n4-color" href="#">
                          {tr("sports_results")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Comunidad */}
                <div className="col-sm-8 col-md-5 col-lg-6 col-xxl-3">
                  <div className="footer_section__community">
                    <h4 className="mb-5 mb-md-6">{tr("join_community")}</h4>
                    <ul className="d-flex align-items-center flex-wrap gap-5">
                      <li>
                        <Link className="footer_section__community-sitem n4-coloLink" href="#">
                          <IconBrandTelegram className="fs-three footericon" />
                        </Link>
                      </li>
                      <li>
                        <Link className="footer_section__community-sitem n4-coloLink" href="#">
                          <IconBrandGithubFilled className="fs-three footericon" />
                        </Link>
                      </li>
                      <li>
                        <Link className="footer_section__community-sitem n4-coloLink" href="#">
                          <IconBrandBehance className="fs-three footericon" />
                        </Link>
                      </li>
                      <li>
                        <Link className="footer_section__community-sitem n4-coloLink" href="#">
                          <IconBrandFacebookFilled className="fs-three footericon" />
                        </Link>
                      </li>
                      <li>
                        <Link className="footer_section__community-sitem n4-coloLink" href="#">
                          <IconBrandDiscordFilled className="fs-three footericon" />
                        </Link>
                      </li>
                      <li>
                        <Link className="footer_section__community-sitem n4-coloLink" href="#">
                          <IconCurrencyBitcoin className="fs-three bitcoin" />
                        </Link>
                      </li>
                      <li>
                        <Link className="footer_section__community-sitem n4-coloLink" href="#">
                          <IconBrandInstagram className="fs-three footericon" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>{/* row */}
            </div>
          </div>
        </div>

        {/* ====== TICKER (lo conservo tal cual) ====== */}
        <div className="row">
        
            <div className="p1-bg pt-7 pb-7">
              <CryptoTicker applyBodyStyles={false} speed={1} />
            </div>
        
        </div>
        {/* =========================================== */}
      </div>
    </footer>
  );
}
