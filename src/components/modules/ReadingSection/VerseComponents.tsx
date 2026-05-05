"use client";
import { Play, BookOpen } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import type { Word } from "@/types/quran";
import { useQuranSettings } from "@/context/QuranSettingsContext";
import { useAudio } from "@/context/AudioContext";
import { useChapters } from "@/hooks/useQuranMeta";

type ViewMode = "Reading" | "Translation";

export function toArabicIndic(n: number): string {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
}

export function AyahEndMark({ number }: { number: number }) {
  return (
    <span className="inline-flex items-center justify-center mx-1 select-none align-middle relative">
      <span style={{ fontSize: "24px", lineHeight: "4rem", color: "#C5C5C5" }}>۝</span>
      <span
        className="absolute inset-0 flex items-center justify-center text-green-700 dark:text-[#C5C5C5]"
        style={{ fontSize: "20px", fontWeight: 700 }}
      >
        {toArabicIndic(number)}
      </span>
    </span>
  );
}

// ── PageSeparator
export function PageSeparator({
  surahName, pageNumber, juzNumber, showBorder = false,
}: {
  surahName: string; pageNumber: number; juzNumber: number; showBorder?: boolean;
}) {
  return (
    <div className="w-full" dir="ltr">
      {showBorder && <div className="w-full border-t border-gray-100 dark:border-neutral-800 mb-2" />}
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-400 dark:text-gray-500 w-32 truncate shrink-0">{surahName}</span>
        <span className="text-sm text-gray-400 dark:text-gray-500 shrink-0">Page: {String(pageNumber).padStart(2, "0")}</span>
        <span className="text-sm text-gray-400 dark:text-gray-500 w-32 text-right shrink-0">Juz: {String(juzNumber).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

// ── SurahHeader
export function SurahHeader({
  chapterId, chapters,
}: {
  chapterId: number;
  chapters: ReturnType<typeof useChapters>["chapters"];
}) {
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;
  const isMakkah = chapter.revelation_place?.toLowerCase() === "makkah";
  const revelationPlace = isMakkah ? "Makkah" : "Madinah";

  return (
    <div className="relative flex flex-col items-center w-full mb-4 mt-6">
      <div className="absolute left-0 top-0 w-28 h-28 opacity-60 dark:opacity-50">
        <Image
          src={isMakkah ? "/assets/images/makkah.webp" : "/assets/images/madinah.webp"}
          alt={revelationPlace} width={112} height={112}
          className="object-contain brightness-110 contrast-110 dark:brightness-200 dark:contrast-125 dark:invert"
        />
      </div>
      <div className="flex flex-col items-center gap-1 w-full">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-wide">
          Surah {chapter.name_simple}
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Ayah {String(chapter.verses_count).padStart(2, "0")} · {revelationPlace}
        </p>
        {chapterId !== 1 && chapterId !== 9 && (
          <div className="mt-4">
            <Image src="/assets/svg/bismillah.svg" alt="Bismillah" width={220} height={52}
              className="opacity-75 dark:opacity-60 dark:invert" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── WordChip
export function WordChip({ word, verseKey, viewMode }: { word: Word; verseKey: string; viewMode: ViewMode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { play } = useAudio();
  const [hovering, setHovering] = useState(false);
  const { arabicFont, arabicFontSize } = useQuranSettings();

  if (word.char_type_name !== "word") return null;

  const handleClick = () => {
    if (viewMode === "Reading") {
      if (!word.audio_url) return;
      const url = word.audio_url.startsWith("http")
        ? word.audio_url
        : `https://audio.qurancdn.com/${word.audio_url}`;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = url;
        audioRef.current.play().catch(() => {});
      } else {
        const a = new Audio(url);
        audioRef.current = a;
        a.play().catch(() => {});
      }
    } else {
      const [surahId, ayahId] = verseKey.split(":").map(Number);
      const url = `https://verses.quran.com/Alafasy/mp3/${String(surahId).padStart(3, "0")}${String(ayahId).padStart(3, "0")}.mp3`;
      play(url, `Verse ${verseKey}`);
    }
  };

  return (
    <span className="relative inline-flex flex-col items-center">
      {hovering && word.translation?.text && (
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-lg shadow-lg pointer-events-none">
          {word.translation.text}
          <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-100" />
        </span>
      )}
      <span
        onClick={handleClick}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="cursor-pointer px-0.5 transition-colors hover:text-green-600 dark:hover:text-green-400"
        style={{ fontFamily: arabicFont, fontSize: `${arabicFontSize}px`, lineHeight: "3rem" }}
      >
        {word.text_uthmani}
      </span>
    </span>
  );
}

// ── TranslationVerse 
export function TranslationVerse({
  verse, translation, onPlayAudio, onOpenTafsir, arabicFont, arabicFontSize, translationFontSize,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verse: any;
  translation?: string;
  onPlayAudio: (url: string, label: string) => void;
  onOpenTafsir?: (surahId: number, ayahId: number) => void;
  arabicFont: string;
  arabicFontSize: number;
  translationFontSize: number;
}) {
  const verseKey = verse.verse_key;
  const [surahId, ayahId] = verseKey.split(":").map(Number);
  const verseAudioUrl = `https://verses.quran.com/Alafasy/mp3/${String(surahId).padStart(3, "0")}${String(ayahId).padStart(3, "0")}.mp3`;

  return (
    <div className="flex gap-3 py-4 border-b dark:border-neutral-800 last:border-0">
      <div className="flex flex-col items-center gap-2 pt-1 flex-shrink-0">
        <span className="text-xs font-semibold text-[#428039]">{verseKey}</span>
        <button
          onClick={() => onPlayAudio(verseAudioUrl, `Verse ${verseKey}`)}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-[#9AA8A2]" />
        </button>
        <button
          onClick={() => onOpenTafsir?.(surahId, ayahId)}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#9AA8A2]" />
        </button>
      </div>
      <div className="flex-1">
        <p className="text-right text-gray-800 dark:text-gray-100 mb-3 leading-loose" dir="rtl"
          style={{ fontFamily: arabicFont, fontSize: `${arabicFontSize}px` }}>
          {verse.words
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ?.filter((w: any) => w.char_type_name === "word")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((w: any) => (
              <WordChip key={w.id} word={w} verseKey={verseKey} viewMode="Translation" />
            ))}
        </p>
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1 font-medium">Saheeh International</p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontSize: `${translationFontSize}px` }}>
          {translation ?? "Loading..."}
        </p>
      </div>
    </div>
  );
}