"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

export type Locale = "pt-BR" | "en";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

function getInitialLocale(): Locale {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "pt-BR" || saved === "en") return saved;
  }
  return "pt-BR";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt-BR");

  useEffect(() => {
    setLocaleState(getInitialLocale());
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem("locale", newLocale);
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    window.location.reload();
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context)
    throw new Error("useLocale must be used within LocaleProvider");
  return context;
}
