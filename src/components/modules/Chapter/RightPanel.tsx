// components/modules/Chapter/RightPanel.tsx
"use client";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuranSettings } from "@/context/QuranSettingsContext";

type ViewMode = "Reading" | "Translation";

interface RightPanelProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const MUSHAF_OPTIONS = [
  { id: "unicode", label: "Unicode Text Mushaf" },
  { id: "hafezi", label: "Hafezi Quran Mushaf" },
  { id: "madani", label: "New Madani Mushaf" },
  { id: "nurani", label: "Nurani Mushaf" },
  { id: "qaloon", label: "Qaloon Mushaf" },
];

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
      <div className="flex border-b dark:border-neutral-800 flex-shrink-0">
        {(["Translation", "Reading"] as ViewMode[]).map((t) => (
          <button
            key={t}
            onClick={() => onViewModeChange(t)}
            className={`flex-1 py-3 text-sm font-medium transition-all cursor-pointer
              ${
                viewMode === t
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Reading Settings — only in Translation mode */}
        {viewMode === "Translation" && (
          <div className="border-b dark:border-neutral-800">
            <button
              onClick={() => setReadingOpen((p) => !p)}
              className="flex items-center justify-between w-full px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <BookOpen className="w-4 h-4" />
                Reading Settings
              </div>
              {readingOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {readingOpen && (
              <div className="px-4 pb-4 text-sm text-gray-500">
                Reading settings coming soon.
              </div>
            )}
          </div>
        )}

        {/* Change Mushaf — only in Reading mode */}
        {viewMode === "Reading" && (
          <div className="border-b dark:border-neutral-800">
            <button
              onClick={() => setMushafOpen((p) => !p)}
              className="flex items-center justify-between w-full px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                <span className="w-5 h-5 rounded bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                  T
                </span>
                Change Mushaf
              </div>
              {mushafOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {mushafOpen && (
              <div className="px-4 pb-4 space-y-3">
                {MUSHAF_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMushaf(m.id)}
                    className="flex items-center gap-3 w-full cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${mushaf === m.id ? "border-green-600" : "border-gray-300 dark:border-neutral-600"}`}
                    >
                      {mushaf === m.id && (
                        <div className="w-2 h-2 rounded-full bg-green-600" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${mushaf === m.id ? "text-green-700 dark:text-green-400 font-medium" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Font Settings — both modes */}
        <div className="border-b dark:border-neutral-800">
          <button
            onClick={() => setFontOpen((p) => !p)}
            className="flex items-center justify-between w-full px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
              <span className="w-5 h-5 rounded bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                T
              </span>
              Font Settings
            </div>
            {fontOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {fontOpen && (
            <div className="px-4 pb-4 space-y-5">
              {/* Arabic Font Size */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>Arabic Font Size</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {arabicFontSize}
                  </span>
                </div>
                <Slider
                  value={[arabicFontSize]}
                  min={16}
                  max={60}
                  step={1}
                  onValueChange={(val) => {
                    const v = Array.isArray(val) ? val[0] : val;
                    setArabicFontSize(v);
                  }}
                  className="accent-green-600"
                />
              </div>

              {/* Translation Font Size — only in Translation mode */}
              {viewMode === "Translation" && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>Translation Font Size</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {translationFontSize}
                    </span>
                  </div>
                  <Slider
                    value={[translationFontSize]}
                    min={12}
                    max={32}
                    step={1}
                    onValueChange={(val) => {
                      const v = Array.isArray(val) ? val[0] : val;
                      setTranslationFontSize(v);
                    }}
                    className="accent-green-600"
                  />
                </div>
              )}

              {/* Arabic Font Face */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Arabic Font Face
                </p>
                <Select
                  value={arabicFont}
                  onValueChange={(value) => value && setArabicFont(value)}
                >
                  <SelectTrigger className="w-full rounded-xl text-sm dark:border-neutral-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {arabicFonts.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Support Us */}
        <div className="m-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-4">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
            Help spread the knowledge of Islam
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
            Your regular support helps us reach our religious brothers and
            sisters with the message of Islam.
          </p>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-xl transition-all cursor-pointer">
            Support Us
          </button>
        </div>
      </div>
    </div>
  );
}
