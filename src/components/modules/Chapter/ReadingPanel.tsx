// components/modules/Chapter/ReadingPanel.tsx
"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useChapters } from "@/hooks/useQuranMeta";
import Image from "next/image";
import { useQuranData } from "@/hooks/useQuranData";

type Mode = "Surah" | "Juz" | "Page";

interface ReadingPanelProps {
  mode: Mode;
  id: number;
  onPrev: () => void;
  onNext: () => void;
}

  function toArabicIndic(n: number): string {
    return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
  }

export function ReadingPanel({ mode, id, onPrev, onNext }: ReadingPanelProps) {
  const { verses, loading, error } = useQuranData(mode, id);
  const { chapters } = useChapters();
  // Converts 1 → ١, 2 → ٢ etc (Arabic-Indic numerals)


  const firstVerse = verses[0];
  const chapterId = firstVerse
    ? Number(firstVerse.verse_key.split(":")[0])
    : null;
  const chapter = chapters.find((c) => c.id === chapterId);

  const surahName = chapter?.name_simple ?? "—";
  const pageNum = firstVerse?.page_number ?? "-";
  const juzNum = firstVerse?.juz_number ?? "-";
  const isMakkah = chapter?.revelation_place?.toLowerCase() === "makkah";
  const ayahCount = chapter?.verses_count;
  const revelationPlace = isMakkah ? "Makkah" : "Madinah";

  const maxId = mode === "Surah" ? 114 : mode === "Juz" ? 30 : 604;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top meta bar */}
      <div className="flex items-center justify-between px-8 py-3 border-b dark:border-neutral-800 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
        <span>{surahName}</span>
        <span>Page: {String(pageNum).padStart(2, "0")}</span>
        <span>Juz: {String(juzNum).padStart(2, "0")}</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-8 py-6 gap-6">
          {/* Surah header */}
          {mode === "Surah" && chapter && (
            <div className="flex items-center justify-between w-full max-w-2xl">
              {/* Kaaba / Mosque image */}
              <div className="w-24 h-24 opacity-20 dark:opacity-10">
                {isMakkah ? (
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-gray-400 fill-current"
                  >
                    <rect x="30" y="40" width="40" height="40" rx="2" />
                    <rect x="42" y="55" width="16" height="25" rx="1" />
                    <rect x="20" y="40" width="10" height="30" rx="1" />
                    <rect x="70" y="40" width="10" height="30" rx="1" />
                    <polygon points="50,10 38,40 62,40" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-gray-400 fill-current"
                  >
                    <rect x="25" y="50" width="50" height="35" rx="2" />
                    <ellipse cx="50" cy="50" rx="20" ry="20" />
                    <rect x="45" y="10" width="10" height="20" rx="2" />
                    <rect x="20" y="50" width="8" height="25" rx="1" />
                    <rect x="72" y="50" width="8" height="25" rx="1" />
                  </svg>
                )}
              </div>

              {/* Title */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Surah {surahName}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Ayah {String(ayahCount).padStart(2, "0")} · {revelationPlace}
                </p>
              </div>

              {/* Bismillah (right side) */}
              <div className="w-24 text-right">
                {id !== 1 && id !== 9 && (
                  <p className="text-sm text-gray-400 font-arabic" dir="rtl">
                    بِسۡمِ اللّٰهِ
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Loading / error */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && <p className="text-red-400 py-20">{error}</p>}

          {/* Arabic text */}
          {!loading && !error && (
            <div className="w-full max-w-2xl text-center" dir="rtl">
              <p
                className="text-gray-800 dark:text-gray-100"
                style={{
                  fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
                  fontSize: "28px",
                  lineHeight: "3.2rem",
                }}
              >
                {verses.map((v) => (
                  <span key={v.id}>
                    {v.text_indopak}
                    {/* Ayah number circle in Arabic-Indic style */}
                    <span
                      className="inline-flex items-center justify-center mx-1 text-base"
                      style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
                    >
                      ‌۝{toArabicIndic(v.verse_number)}
                    </span>{" "}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom meta bar */}
      <div className="flex items-center justify-between px-8 py-3 border-t dark:border-neutral-800 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
        <span>{surahName}</span>
        <span>Page: {String(pageNum).padStart(2, "0")}</span>
        <span>Juz: {String(juzNum).padStart(2, "0")}</span>
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-center gap-4 py-4 border-t dark:border-neutral-800 flex-shrink-0">
        <button
          onClick={onPrev}
          disabled={id <= 1}
          className="flex items-center gap-1 px-5 py-2 rounded-full border dark:border-neutral-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={onNext}
          disabled={id >= maxId}
          className="flex items-center gap-1 px-5 py-2 rounded-full border dark:border-neutral-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
