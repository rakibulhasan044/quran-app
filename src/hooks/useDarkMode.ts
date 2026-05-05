"use client";
import { useState, useLayoutEffect } from "react";

function getInitialTheme() {
  if (typeof window === "undefined") return false;

  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return stored === "dark" || (!stored && prefersDark);
}

export function useDarkMode() {
  const [dark, setDark] = useState(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return { dark, toggle };
}