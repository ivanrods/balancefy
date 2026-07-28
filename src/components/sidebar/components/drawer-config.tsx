"use client";

import * as React from "react";
import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/context/currency-context";
import { useLocale } from "@/context/locale-context";
import { useTranslation } from "@/hooks/use-translation";

export function DrawerConfig() {
  const { t } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = React.useState(false);
  const [tempCurrency, setTempCurrency] = React.useState<"BRL" | "USD">(currency);
  const [tempLocale, setTempLocale] = React.useState<"pt-BR" | "en">(locale);

  React.useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempCurrency(currency);
      setTempLocale(locale);
    }
  }, [open, currency, locale]);

  function handleSave() {
    setCurrency(tempCurrency);
    if (tempLocale !== locale) {
      setLocale(tempLocale);
    } else {
      setOpen(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Settings className="w-4 h-4 mr-2" />
          {t("nav.settings")}
        </DropdownMenuItem>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{t("config.title")}</DrawerTitle>
            <DrawerDescription>{t("config.description")}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t("config.currency")}</label>
              <div className="flex gap-2">
                <Button
                  variant={tempCurrency === "BRL" ? "default" : "outline"}
                  onClick={() => setTempCurrency("BRL")}
                  className="flex-1"
                >
                  BRL (R$)
                </Button>
                <Button
                  variant={tempCurrency === "USD" ? "default" : "outline"}
                  onClick={() => setTempCurrency("USD")}
                  className="flex-1"
                >
                  USD ($)
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t("config.language")}</label>
              <div className="flex gap-2">
                <Button
                  variant={tempLocale === "pt-BR" ? "default" : "outline"}
                  onClick={() => setTempLocale("pt-BR")}
                  className="flex-1"
                >
                  {t("config.portuguese")}
                </Button>
                <Button
                  variant={tempLocale === "en" ? "default" : "outline"}
                  onClick={() => setTempLocale("en")}
                  className="flex-1"
                >
                  {t("config.english")}
                </Button>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSave}>{t("config.save")}</Button>
            <DrawerClose asChild>
              <Button variant="outline">{t("config.cancel")}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
