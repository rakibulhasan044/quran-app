"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuranData } from "@/hooks/useQuranData";
import { useChapters } from "@/hooks/useQuranMeta";
import { useRef, useState } from "react";
import type { Word } from "@/types/quran";

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

function AyahEndMark({ number }: { number: number }) {
  return (
    <span
      className="inline-flex items-center justify-center mx-1 select-none align-middle"
      style={{
        fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
        fontSize: "28px",
        lineHeight: "3.2rem",
        color: "inherit",
        // Unicode circle with number inside using the end of ayah mark
      }}
    >
      {/* Ayah end mark ۝ with number overlay */}
      <span className="relative inline-flex items-center justify-center">
        <span style={{ fontSize: "32px", color: "#16a34a" }}>۝</span>
        <span
          className="absolute inset-0 flex items-center justify-center text-green-700 dark:text-green-400"
          style={{ fontSize: "11px", fontWeight: 700, marginTop: "1px" }}
        >
          {toArabicIndic(number)}
        </span>
      </span>
    </span>
  );
}

function WordChip({ word }: { word: Word }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hovering, setHovering] = useState(false);

  const isWord = word.char_type_name === "word";
  const banglaText = word.translation?.text;

  const playAudio = () => {
    if (!word.audio_url) return;
    const url = word.audio_url.startsWith("http")
      ? word.audio_url
      : `https://audio.qurancdn.com/${word.audio_url}`;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.play().catch(() => {});
    } else {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play().catch(() => {});
    }
  };

  if (!isWord) return null;

  return (
    <span className="relative inline-flex flex-col items-center">
      {/* Bangla tooltip on hover */}
      {hovering && banglaText && (
        <span
          className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-lg shadow-lg pointer-events-none"
          style={{ fontFamily: "inherit" }}
        >
          {banglaText}
          <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-100" />
        </span>
      )}

      {/* Arabic word — use text_uthmani to avoid missing glyph boxes */}
      <span
        onClick={playAudio}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="cursor-pointer px-1 py-0.5 rounded-lg transition-colors hover:bg-green-100 dark:hover:bg-green-900/30 active:scale-95"
        style={{
          fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
          fontSize: "28px",
          lineHeight: "3.2rem",
          // color stays inherited — no green on hover
        }}
      >
        {/* Switch from text_indopak → text_uthmani to avoid boxes */}
        {word.text_uthmani ?? word.text_indopak}
      </span>
    </span>
  );
}

export function ReadingPanel({ mode, id, onPrev, onNext }: ReadingPanelProps) {
  const { verses, loading, error } = useQuranData(mode, id);
  const { chapters } = useChapters();

  const firstVerse = verses[0];
  const chapterId = firstVerse ? Number(firstVerse.verse_key.split(":")[0]) : null;
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
      <div className="flex items-center justify-between px-8 py-3 border-b dark:border-neutral-800 text-sm text-gray-400 dark:text-gray-500 flex-shrink-0">
        <span>{surahName}</span>
        <span>Page: {String(pageNum).padStart(2, "0")}</span>
        <span>Juz: {String(juzNum).padStart(2, "0")}</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-8 py-8 gap-6">

          {/* Surah header */}
          {mode === "Surah" && chapter && (
            <div className="flex flex-col items-center gap-1 w-full max-w-2xl">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-wide">
                Surah {surahName}
              </h1>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Ayah {String(ayahCount).padStart(2, "0")} · {revelationPlace}
              </p>

              {/* Bismillah — shown for all surahs except 1 and 9 */}
              {id !== 1 && id !== 9 && (
                <p
                  className="text-3xl text-gray-700 dark:text-gray-300 mt-4 mb-2"
                  dir="rtl"
                  style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif", lineHeight: "2" }}
                >
                  بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
                </p>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && <p className="text-red-400 py-20">{error}</p>}

          {/* Verses — continuous mushaf-style flow */}
          {!loading && !error && (
            <div
              className="w-full max-w-2xl text-gray-800 dark:text-gray-200"
              dir="rtl"
              style={{
                fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
                fontSize: "28px",
                lineHeight: "3.2rem",
                textAlign: "justify",
              }}
            >
              {verses.map((verse) => (
                <span key={verse.id}>
                  {verse.words?.map((word) => (
                    <WordChip key={word.id} word={word} />
                  ))}
                  <AyahEndMark number={verse.verse_number} />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom meta bar */}
      <div className="flex items-center justify-between px-8 py-3 border-t dark:border-neutral-800 text-sm text-gray-400 dark:text-gray-500 flex-shrink-0">
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