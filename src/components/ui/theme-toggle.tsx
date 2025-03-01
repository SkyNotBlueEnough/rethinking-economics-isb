"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ThemeToggleProps {
  theme: string;
  setTheme: (theme: string) => void;
}

export function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        setTheme(
          theme === "pencraft-light" ? "pencraft-dark" : "pencraft-light",
        )
      }
      aria-label="Toggle theme"
      className="h-9 w-9 rounded-md"
    >
      {theme === "pencraft-light" ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </Button>
  );
}
