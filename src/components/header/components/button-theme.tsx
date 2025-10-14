"use client";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/theme-context";
import { Sun, Moon } from "lucide-react";

export function ButtonTheme() {
  const { toggleTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex items-center justify-center">
      <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
      <span className="pointer-events-none absolute left-0.5 top-0.5">
        <Sun
          size={14}
          className={theme === "dark" ? "text-white" : "text-primary"}
        />
      </span>
      <span className="pointer-events-none absolute right-0.5 top-0.5">
        <Moon
          size={14}
          className={theme === "dark" ? "text-primary" : "text-white"}
        />
      </span>
    </div>
  );
}
