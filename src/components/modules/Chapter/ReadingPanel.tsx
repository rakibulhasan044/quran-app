"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuranData } from "@/hooks/useQuranData";
import { useChapters } from "@/hooks/useQuranMeta";
import { useRef, useState } from "react";
import Image from "next/image";
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
    <span className="inline-flex items-center justify-center mx-1 select-none align-middle relative">
      <span
        style={{ fontSize: "32px", lineHeight: "3.2rem", color: "#16a34a" }}
      >
        ۝
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center text-green-700 dark:text-green-400"
        style={{ fontSize: "11px", fontWeight: 700, marginTop: "1px" }}
      >
        {toArabicIndic(number)}
      </span>
    </span>
  );
}

function PageSeparator({
  surahName,
  pageNumber,
  juzNumber,
}: {
  surahName: string;
  pageNumber: number;
  juzNumber: number;
}) {
  return (
    <div
      className="w-full flex items-center justify-between py-3 my-2 border-t border-gray-100 dark:border-neutral-800"
      dir="ltr"
    >
      <span className="text-sm text-gray-400 dark:text-gray-500 w-32 truncate shrink-0">
        {surahName}
      </span>
      <span className="text-sm text-gray-400 dark:text-gray-500 shrink-0">
        Page: {String(pageNumber).padStart(2, "0")}
      </span>
      <span className="text-sm text-gray-400 dark:text-gray-500 w-32 text-right shrink-0">
        Juz: {String(juzNumber).padStart(2, "0")}
      </span>
    </div>
  );
}

function WordChip({ word }: { word: Word }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hovering, setHovering] = useState(false);

  const isWord = word.char_type_name === "word";
  const tooltipText = word.translation?.text;

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
      {/* Tooltip */}
      {hovering && tooltipText && (
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-lg shadow-lg pointer-events-none">
          {tooltipText}
          <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-100" />
        </span>
      )}

      {/* Arabic word — green text on hover, no background */}
      <span
        onClick={playAudio}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="cursor-pointer px-0.5 transition-colors hover:text-green-600 dark:hover:text-green-400"
        style={{ fontSize: "28px", lineHeight: "3.2rem" }}
      >
        {word.text_indopak}
      </span>
    </span>
  );
}

export function ReadingPanel({ mode, id, onPrev, onNext }: ReadingPanelProps) {
  const { verses, loading, error } = useQuranData(mode, id);
  const { chapters } = useChapters();

  const firstVerse = verses[0];
  const chapterId = firstVerse
    ? Number(firstVerse.verse_key.split(":")[0])
    : null;
  const chapter = chapters.find((c) => c.id === chapterId);

  const surahName = chapter?.name_simple ?? "—";
  const isMakkah = chapter?.revelation_place?.toLowerCase() === "makkah";
  const ayahCount = chapter?.verses_count;
  const revelationPlace = isMakkah ? "Makkah" : "Madinah";
  const maxId = mode === "Surah" ? 114 : mode === "Juz" ? 30 : 604;

  // Group verses by page_number
  const pages: {
    pageNumber: number;
    juzNumber: number;
    surahName: string;
    verseList: typeof verses;
  }[] = [];

  verses.forEach((verse) => {
    const pg = verse.page_number;
    const jz = verse.juz_number;
    const sName =
      chapters.find((c) => c.id === Number(verse.verse_key.split(":")[0]))
        ?.name_simple ?? surahName;
    const last = pages[pages.length - 1];
    if (!last || last.pageNumber !== pg) {
      pages.push({
        pageNumber: pg,
        juzNumber: jz,
        surahName: sName,
        verseList: [verse],
      });
    } else {
      last.verseList.push(verse);
    }
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-8 py-8 gap-2">
          {/* Surah header */}
          {mode === "Surah" && chapter && (
            <div className="flex items-start justify-between w-full max-w-2xl mb-2">
              {/* Left: city image */}
              <div className="w-28 h-28 relative flex-shrink-0 opacity-60 dark:opacity-50">
                <Image
                  src={
                    isMakkah
                      ? "/assets/images/makkah.webp"
                      : "/assets/images/madinah.webp"
                  }
                  alt={revelationPlace}
                  width={112}
                  height={112}
                  className="object-contain brightness-110 contrast-110 dark:brightness-125 dark:contrast-125 dark:invert"
                />
              </div>

              {/* Center: title + bismillah */}
              <div className="flex flex-col items-center gap-1 flex-1 px-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-wide">
                  Surah {surahName}
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Ayah {String(ayahCount).padStart(2, "0")} · {revelationPlace}
                </p>

                {/* Bismillah SVG — skip for Al-Fatihah (1) and At-Tawbah (9) */}
                {id !== 1 && (
                  <div className="mt-4">
                    <Image
                      src="/assets/svg/bismillah.svg"
                      alt="Bismillah"
                      width={220}
                      height={52}
                      className="opacity-75 dark:opacity-60 dark:invert"
                    />
                  </div>
                )}
              </div>

              {/* Right spacer to balance */}
              <div className="w-20 flex-shrink-0" />
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && <p className="text-red-400 py-20">{error}</p>}

          {/* Verses grouped by page */}
          {!loading && !error && (
            <div className="w-full max-w-2xl flex flex-col">
              {pages.map((page, pageIndex) => (
                <div key={page.pageNumber}>
                  {/* Page meta row — shown above every page */}
                  <PageSeparator
                    surahName={page.surahName}
                    pageNumber={page.pageNumber}
                    juzNumber={page.juzNumber}
                  />

                  {/* Arabic text */}
                  <div
                    className="text-gray-800 dark:text-gray-200 mb-4"
                    dir="rtl"
                    style={{
                      fontSize: "24px",
                      lineHeight: "3rem",
                      textAlign: "justify",
                    }}
                  >
                    {page.verseList.map((verse) => (
                      <span key={verse.id}>
                        {verse.words?.map((word) => (
                          <WordChip key={word.id} word={word} />
                        ))}
                        <AyahEndMark number={verse.verse_number} />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
