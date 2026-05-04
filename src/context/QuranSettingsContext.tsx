// context/QuranSettingsContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const ARABIC_FONTS = [
  { label: "Noto Naskh Arabic", value: "'Noto Naskh Arabic', serif" },
  { label: "Amiri", value: "'Amiri', serif" },
  { label: "Scheherazade New", value: "'Scheherazade New', serif" },
  { label: "KFGQ Uthmanic", value: "'KFGQPCUthmanicScriptHAFS', serif" },
];

interface QuranSettings {
  arabicFontSize: number;
  translationFontSize: number;
  arabicFont: string;
  setArabicFontSize: (v: number) => void;
  setTranslationFontSize: (v: number) => void;
  setArabicFont: (v: string) => void;
  arabicFonts: typeof ARABIC_FONTS;
}

const QuranSettingsContext = createContext<QuranSettings | null>(null);

export function QuranSettingsProvider({ children }: { children: ReactNode }) {
  const [arabicFontSize, setArabicFontSize] = useState(28);
  const [translationFontSize, setTranslationFontSize] = useState(15);
  const [arabicFont, setArabicFont] = useState(ARABIC_FONTS[0].value);

  return (
    <QuranSettingsContext.Provider value={{
      arabicFontSize, translationFontSize, arabicFont,
      setArabicFontSize, setTranslationFontSize, setArabicFont,
      arabicFonts: ARABIC_FONTS,
    }}>
      {children}
    </QuranSettingsContext.Provider>
  );
}

export function useQuranSettings() {
  const ctx = useContext(QuranSettingsContext);
  if (!ctx) throw new Error("useQuranSettings must be used inside QuranSettingsProvider");
  return ctx;
}