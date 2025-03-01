"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "pencraft-dark",
  setTheme: () => null,
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<string>("pencraft-dark");

  useEffect(() => {
    // Update the html class when theme changes
    const htmlElement = document.documentElement;

    // Remove both theme classes first
    htmlElement.classList.remove("pencraft-dark", "pencraft-light");

    // Add the current theme class
    htmlElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
