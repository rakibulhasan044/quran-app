"use client";
import { useState } from "react";
import { useQuranSettings } from "@/context/QuranSettingsContext";
import {
  FontSettingsSection,
  MushafSection,
  ReadingSettingsSection,
  SupportCard,
} from "./Section";

type ViewMode = "Reading" | "Translation";

interface RightPanelProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function RightPanel({ viewMode, onViewModeChange }: RightPanelProps) {
  const [mushaf, setMushaf] = useState("unicode");
  const [mushafOpen, setMushafOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(true);
  const [readingOpen, setReadingOpen] = useState(false);

  const {
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize,
    arabicFont,
    setArabicFont,
    arabicFonts,
  } = useQuranSettings();

  return (
    <div className="flex flex-col h-full border-l dark:border-neutral-800 overflow-hidden">
      {/* Tab toggle */}
      {/* Segmented Toggle */}
      <div className="p-3 border-b dark:border-neutral-800 flex-shrink-0">
        <div className="bg-gray-100 dark:bg-neutral-900 rounded-2xl w-full">
          <div className="p-1.5 w-full flex">
            {(["Translation", "Reading"] as ViewMode[]).map((t) => (
              <button
                key={t}
                onClick={() => onViewModeChange(t)}
                className={`
            flex-1 cursor-pointer rounded-xl text-sm transition-all h-8
            ${
              viewMode === t
                ? "!bg-white dark:!bg-black font-semibold shadow-sm !text-gray-900 dark:!text-white"
                : "!bg-transparent font-normal !text-gray-500 dark:!text-gray-400 hover:!bg-gray-200 dark:hover:!bg-neutral-800"
            }
          `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {viewMode === "Translation" && (
          <ReadingSettingsSection
            open={readingOpen}
            onToggle={() => setReadingOpen((p) => !p)}
          />
        )}

        {viewMode === "Reading" && (
          <MushafSection
            open={mushafOpen}
            onToggle={() => setMushafOpen((p) => !p)}
            mushaf={mushaf}
            onMushafChange={setMushaf}
          />
        )}

        <FontSettingsSection
          open={fontOpen}
          onToggle={() => setFontOpen((p) => !p)}
          viewMode={viewMode}
          arabicFontSize={arabicFontSize}
          setArabicFontSize={setArabicFontSize}
          translationFontSize={translationFontSize}
          setTranslationFontSize={setTranslationFontSize}
          arabicFont={arabicFont}
          setArabicFont={setArabicFont}
          arabicFonts={arabicFonts}
        />
        <SupportCard />
      </div>
    </div>
  );
}
