"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { CurrencyProvider } from "@/context/currency-context";
import { LocaleProvider } from "@/context/locale-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <QueryClientProvider client={queryClient}>
        <LocaleProvider>
          <CurrencyProvider>{children}</CurrencyProvider>
        </LocaleProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
