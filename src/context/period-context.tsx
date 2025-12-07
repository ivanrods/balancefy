"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type PeriodMode = "month" | "total";

interface PeriodContextProps {
  mode: PeriodMode;
  setMode: (mode: PeriodMode) => void;
}

const PeriodContext = createContext<PeriodContextProps | undefined>(undefined);

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PeriodMode>("month");

  useEffect(() => {
    const saved = localStorage.getItem("period-mode");
    if (saved === "month" || saved === "total") {
      setMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("period-mode", mode);
  }, [mode]);

  return (
    <PeriodContext.Provider value={{ mode, setMode }}>
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
