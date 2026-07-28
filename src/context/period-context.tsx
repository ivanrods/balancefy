"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type PeriodMode = "month" | "total";

interface PeriodContextProps {
  mode: PeriodMode;
  setMode: (mode: PeriodMode) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
}

const PeriodContext = createContext<PeriodContextProps | undefined>(undefined);

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PeriodMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("period-mode");
      if (saved === "month" || saved === "total") return saved;
    }
    return "month";
  });
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedMonth = Number(localStorage.getItem("period-selected-month"));
      if (Number.isInteger(savedMonth) && savedMonth >= 1 && savedMonth <= 12) return savedMonth;
    }
    return new Date().getMonth() + 1;
  });

  useEffect(() => {
    localStorage.setItem("period-mode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("period-selected-month", String(selectedMonth));
  }, [selectedMonth]);

  return (
    <PeriodContext.Provider value={{ mode, setMode, selectedMonth, setSelectedMonth }}>
      {children}
    </PeriodContext.Provider>
  );
}

export function usePeriod() {
  const context = useContext(PeriodContext);
  if (!context) {
    throw new Error("usePeriod deve ser usado dentro de um PeriodProvider");
  }
  return context;
}
