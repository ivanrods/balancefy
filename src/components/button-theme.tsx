"use client";

import { useTheme } from "@/hooks/use-theme";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

export function ButtonTheme() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className="relative flex items-center justify-center ">
      <Switch
        checked={darkMode}
        onCheckedChange={(checked) => setDarkMode(checked)}
        className="relative"
      />
      <span className="pointer-events-none absolute left-0.5 top-0.5">
        <Sun size={14} className="  text-primary" />
      </span>
      <span className="pointer-events-none absolute right-0.5 top-0.5 ">
        <Moon
          size={14}
          className=" text-gray-400 flex justify-center items-center"
        />
      </span>
    </div>
  );
}
