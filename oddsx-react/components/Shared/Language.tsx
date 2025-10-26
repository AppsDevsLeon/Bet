"use client";

import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type LanguageOption = {
  code: "es" | "en" | "fr" | "it";
  name: string;
  locale?: string;
  flag: "es" | "us" | "gb" | "fr" | "it";
};

const LANGS: LanguageOption[] = [
  { code: "es", name: "Español",  locale: "es-ES", flag: "es" },
  { code: "en", name: "English",  locale: "en-US", flag: "us" }, // o "gb"
  { code: "fr", name: "Français", locale: "fr-FR", flag: "fr" },
  { code: "it", name: "Italiano", locale: "it-IT", flag: "it" },
];

const flagUrl = (code: string) =>
  `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${code}.svg`;

const flagStyleBase: React.CSSProperties = {
  width: 20,
  height: 15,
  display: "inline-block",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  borderRadius: 2,
};

export default function Language() {
  const { locale, setLocale } = useI18n();

  const [selected, setSelected] = useState<LanguageOption>(
    LANGS.find((l) => l.code === locale) || LANGS[0]
  );

  useEffect(() => {
    const found = LANGS.find((l) => l.code === locale);
    if (found) setSelected(found);
  }, [locale]);

  const handleChange = (opt: LanguageOption) => {
    setSelected(opt);
    setLocale(opt.code);
  };

  return (
    <div className="langu position-relative">
      <Listbox value={selected} onChange={handleChange}>
        <div className="langu__head mt-3 mt-sm-2 mt-md-1">
          {/* Botón: SOLO bandera */}
          <Listbox.Button
            className="relative w-auto d-inline-flex align-items-center justify-content-center p-0 border-0 bg-transparent"
            aria-label={`Idioma actual: ${selected.name}`}
            title={selected.name}
          >
            <span
              style={{
                ...flagStyleBase,
                backgroundImage: `url(${flagUrl(selected.flag)})`,
              }}
              aria-hidden
            />
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* Lista: SOLO banderas */}
            <Listbox.Options className="langu__items p2-bg mt-3 max-h-60 w-auto overflow-auto rounded-md focus:outline-none px-2 py-1 cpoint">
              {LANGS.map((opt) => (
                <Listbox.Option
                  key={opt.code}
                  value={opt}
                  className="relative cursor-default select-none py-1 px-1"
                >
                  {({ active }) => (
                    <div
                      className={`d-flex align-items-center gap-2 rounded ${
                        active ? "bg-body-secondary" : ""
                      }`}
                      title={opt.name}
                    >
                      <span
                        style={{
                          ...flagStyleBase,
                          backgroundImage: `url(${flagUrl(opt.flag)})`,
                        }}
                        aria-label={opt.name}
                      />
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
