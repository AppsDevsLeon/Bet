"use client";

import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import es from "@/messages/es.json";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import it from "@/messages/it.json";



type Messages = Record<string, any>;
type Locale = "es" | "en" | "fr" | "it";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string, fallback?: string) => string;
};

const I18nCtx = createContext<Ctx | null>(null);

// util: acceso por ruta "A.B.C"
function getByPath(obj: any, path: string) {
  return path.split(".").reduce((acc, k) => (acc && acc[k] != null ? acc[k] : undefined), obj);
}

const MESSAGES_BY_LOCALE: Record<Locale, Messages> = {
  es, en,fr, it
};

export function I18nProvider({
  children,
  defaultLocale = "es",
}: {
  children: React.ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // cargar desde localStorage si existe
  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("APP_LOCALE") as Locale | null) : null;
    if  (saved === "es" || saved === "en" || saved === "fr" || saved === "it"){
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem("APP_LOCALE", l);
    } catch {}
  };

  const messages = useMemo(() => MESSAGES_BY_LOCALE[locale] || {}, [locale]);

  const t = (path: string, fallback?: string) => {
    const val = getByPath(messages, path);
    if (typeof val === "string") return val;
    return fallback ?? path; // si falta clave, muestra la clave
  };

  const value = useMemo<Ctx>(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider/>");
  return ctx;
}
