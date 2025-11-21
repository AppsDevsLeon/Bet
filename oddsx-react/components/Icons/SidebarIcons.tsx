"use client";

import React from "react";

type IconProps = {
  size?: number;
};

/**
 * Puntito rojo "Live"
 * - círculo rojo con ondas, estilo transmisión en vivo
 */
export function LiveIcon({ size = 18 }: IconProps) {
  // usamos size para el <svg>, y adentro escalamos
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* círculo base rojo */}
      <circle cx="12" cy="12" r="4" fill="#e11d48" />
      {/* ondas alrededor */}
      <circle
        cx="12"
        cy="12"
        r="7"
        stroke="#e11d48"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="#e11d48"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Icono "Futures" / mercados largos
 * - velas de trading (candlesticks)
 * - gris oscuro/negro, neutro
 */
export function FuturesIcon({ size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* vela izquierda */}
      <rect
        x="5"
        y="8"
        width="3"
        height="8"
        rx="1"
        fill="#0f172a"
      />
      <line
        x1="6.5"
        y1="5"
        x2="6.5"
        y2="19"
        stroke="#0f172a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* vela media (alta) */}
      <rect
        x="10"
        y="5"
        width="3"
        height="12"
        rx="1"
        fill="#0f172a"
      />
      <line
        x1="11.5"
        y1="3"
        x2="11.5"
        y2="20"
        stroke="#0f172a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* vela derecha (bajita) */}
      <rect
        x="15"
        y="10"
        width="3"
        height="6"
        rx="1"
        fill="#0f172a"
      />
      <line
        x1="16.5"
        y1="9"
        x2="16.5"
        y2="20"
        stroke="#0f172a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Flama roja "POPULAR"
 * - para el header de sección
 */
export function FireIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* cuerpo de la flama */}
      <path
        d="M13.5 2.5s.5 2.5-1 4.5c-1 1.3-2.2 1.9-2.8 3.3-.5 1.2-.4 2.5.1 3.4.3-1.1 1.1-2 2.1-2.6 1-.5 2-.5 2-.5s.2 1.4.2 2.3c0 1.4-.5 2.5-1.4 3.4-.9.9-2.1 1.4-3.4 1.4-2.7 0-5-2.1-5-5 0-2.2 1.3-3.6 2.4-4.9 1-1.3 1.6-2.1 1.7-3.8C8.6 2.5 10.5 1 10.5 1s.4 1.5 1.6 2.3c1 .7 1.4-.8 1.4-.8Z"
        fill="#e11d48"
      />
    </svg>
  );
}

/**
 * FootballIcon
 * - círculo con balón americano estilizado
 * - úsalo para NFL / CFB / etc
 */
export function FootballIcon({ size = 20 }: IconProps) {
  const r = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* fondo circular azul oscuro tipo badge */}
      <circle cx="12" cy="12" r="10" fill="#1E3C8E" />

      {/* forma de balón americano (oval café) */}
      <ellipse
        cx="12"
        cy="12"
        rx="6"
        ry="3"
        fill="#a16207"
      />

      {/* costura blanca */}
      <rect
        x="10.5"
        y="10.75"
        width="3"
        height="2.5"
        rx="0.5"
        fill="#fff"
      />
      <line
        x1="9"
        y1="12"
        x2="15"
        y2="12"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="11.25"
        x2="11"
        y2="12.75"
        stroke="#fff"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="11.25"
        x2="12"
        y2="12.75"
        stroke="#fff"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="13"
        y1="11.25"
        x2="13"
        y2="12.75"
        stroke="#fff"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * BasketballIcon
 * - círculo naranja con líneas negras tipo balón NBA
 */
export function BasketballIcon({ size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* círculo naranja */}
      <circle cx="12" cy="12" r="10" fill="#f97316" />

      {/* líneas de balón */}
      <path
        d="M2 12h20M12 2v20"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 5c4 4 10 4 14 0M5 19c4-4 10-4 14 0"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * CryptoCoinIcon
 * - circulito con símbolo ₿ blanco sobre dorado
 * - úsalo si quieres un genérico BTC style
 */
export function CryptoCoinIcon({ size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* moneda dorada */}
      <circle cx="12" cy="12" r="10" fill="#eab308" />
      {/* símbolo ₿ simplificado */}
      <text
        x="12"
        y="14"
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        fill="#fff"
        fontFamily='system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif'
      >
        ₿
      </text>
    </svg>
  );
}
