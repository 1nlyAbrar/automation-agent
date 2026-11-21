"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "aa-theme";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  // The inline script in layout.tsx already set the class; just read it.
  useEffect(() => {
    setThemeState(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage blocked: theme still applies for this session */
    }
  }, []);

  return { theme, setTheme };
}