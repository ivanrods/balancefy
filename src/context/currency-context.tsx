"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Currency = "BRL" | "USD";

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("currency") as Currency | null;
      if (saved === "BRL" || saved === "USD") return saved;
    }
    return "BRL";
  });

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
