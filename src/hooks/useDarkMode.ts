// hooks/useDarkMode.ts
"use client";
import { useState, useLayoutEffect } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useLayoutEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark" || document.documentElement.classList.contains("dark");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isDark) setDark(true);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return { dark, toggle };
}