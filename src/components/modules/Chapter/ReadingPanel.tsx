// components/modules/Chapter/ReadingPanel.tsx
"use client";
import { ChevronLeft, ChevronRight, Play, BookOpen } from "lucide-react";
import { useQuranData } from "@/hooks/useQuranData";
import { useChapters } from "@/hooks/useQuranMeta";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import type { Word } from "@/types/quran";
import { useQuranSettings } from "@/context/QuranSettingsContext";
import { useAudio } from "@/context/AudioContext";

type Mode = "Surah" | "Juz" | "Page";
type ViewMode = "Reading" | "Translation";

interface ReadingPanelProps {
  mode: Mode;
  viewMode: ViewMode;
  id: number;
  onPrev: () => void;
  onNext: () => void;
  scrollToSurahId?: number | null;
  onOpenTafsir?: (surahId: number, ayahId: number) => void;
}

function toArabicIndic(n: number): string {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
}

function AyahEndMark({ number }: { number: number }) {
  return (
    <span className="inline-flex items-center justify-center mx-1 select-none align-middle relative">
      <span style={{ fontSize: "32px", lineHeight: "3rem", color: "#16a34a" }}>۝</span>
      <span
        className="absolute inset-0 flex items-center justify-center text-green-700 dark:text-green-400"
        style={{ fontSize: "11px", fontWeight: 700, marginTop: "1px" }}
      >
        {toArabicIndic(number)}
      </span>
    </span>
  );
}

function PageSeparator({ surahName, pageNumber, juzNumber, showBorder = false }: {
  surahName: string; pageNumber: number; juzNumber: number; showBorder?: boolean;
}) {
  return (
    <div className={`w-full flex items-center justify-between py-3 my-2 ${showBorder ? "border-t border-gray-100 dark:border-neutral-800" : ""}`} dir="ltr">
      <span className="text-sm text-gray-400 dark:text-gray-500 w-32 truncate shrink-0">{surahName}</span>
      <span className="text-sm text-gray-400 dark:text-gray-500 shrink-0">Page: {String(pageNumber).padStart(2, "0")}</span>
      <span className="text-sm text-gray-400 dark:text-gray-500 w-32 text-right shrink-0">Juz: {String(juzNumber).padStart(2, "0")}</span>
    </div>
  );
}

function SurahHeader({ chapterId, chapters }: {
  chapterId: number;
  chapters: ReturnType<typeof useChapters>["chapters"];
}) {
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;
  const isMakkah = chapter.revelation_place?.toLowerCase() === "makkah";
  const revelationPlace = isMakkah ? "Makkah" : "Madinah";

  return (
    <div className="relative flex flex-col items-center w-full max-w-2xl mb-4 mt-6">
      <div className="absolute left-0 top-0 w-28 h-28 opacity-60 dark:opacity-50">
        <Image
          src={isMakkah ? "/assets/images/makkah.webp" : "/assets/images/madinah.webp"}
          alt={revelationPlace} width={112} height={112}
          className="object-contain brightness-110 contrast-110 dark:brightness-200 dark:contrast-125 dark:invert"
        />
      </div>
      <div className="flex flex-col items-center gap-1 w-full">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-wide">Surah {chapter.name_simple}</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">Ayah {String(chapter.verses_count).padStart(2, "0")} · {revelationPlace}</p>
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

function WordChip({ word }: { word: Word }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hovering, setHovering] = useState(false);
  const { arabicFont, arabicFontSize } = useQuranSettings();
  if (word.char_type_name !== "word") return null;

  const playAudio = () => {
    if (!word.audio_url) return;
    const url = word.audio_url.startsWith("http") ? word.audio_url : `https://audio.qurancdn.com/${word.audio_url}`;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = url; audioRef.current.play().catch(() => {}); }
    else { const a = new Audio(url); audioRef.current = a; a.play().catch(() => {}); }
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
        onClick={playAudio}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="cursor-pointer px-0.5 transition-colors hover:text-green-600 dark:hover:text-green-400"
        style={{ fontFamily: arabicFont, fontSize: `${arabicFontSize}px`, lineHeight: "3rem" }}
      >
        {word.text_indopak}
      </span>
    </span>
  );
}

// Translation view — verse by verse with play button + tafsir icon
function TranslationVerse({
  verse,
  translation,
  onPlayAudio,
  onOpenTafsir,
  arabicFont,
  arabicFontSize,
  translationFontSize,
}: {
  verse: any;
  translation?: string;
  onPlayAudio: (url: string, label: string) => void;
  onOpenTafsir?: (surahId: number, ayahId: number) => void;
  arabicFont: string;
  arabicFontSize: number;
  translationFontSize: number;
}) {
  const verseKey = verse.verse_key; // e.g. "2:142"
  const [surahId, ayahId] = verseKey.split(":").map(Number);

  // Build audio URL for full verse (qurancdn pattern)
  const verseAudioUrl = `https://audio.qurancdn.com/wbw/${String(surahId).padStart(3, "0")}_${String(ayahId).padStart(3, "0")}_001.mp3`;

  return (
    <div className="flex gap-3 py-4 border-b dark:border-neutral-800 last:border-0">
      {/* Action icons column */}
      <div className="flex flex-col items-center gap-2 pt-1 flex-shrink-0">
        {/* Verse key */}
        <span className="text-xs font-semibold text-green-600">{verseKey}</span>

        {/* Play button */}
        <button
          onClick={() => onPlayAudio(verseAudioUrl, `Verse ${verseKey}`)}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-gray-400 hover:text-green-600" />
        </button>

        {/* Tafsir icon */}
        <button
          onClick={() => onOpenTafsir?.(surahId, ayahId)}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-gray-400 hover:text-green-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Arabic */}
        <p
          className="text-right text-gray-800 dark:text-gray-100 mb-3 leading-loose"
          dir="rtl"
          style={{ fontFamily: arabicFont, fontSize: `${arabicFontSize}px` }}
        >
          {verse.words?.filter((w: any) => w.char_type_name === "word").map((w: any) => w.text_indopak).join(" ")}
        </p>

        {/* Translation source label */}
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1 font-medium">Saheeh International</p>

        {/* Translation text */}
        <p
          className="text-gray-700 dark:text-gray-300 leading-relaxed"
          style={{ fontSize: `${translationFontSize}px` }}
        >
          {translation ?? "Loading..."}
        </p>
      </div>
    </div>
  );
}

export function ReadingPanel({
  mode, viewMode, id, onPrev, onNext, scrollToSurahId, onOpenTafsir,
}: ReadingPanelProps) {
  const { verses, loading, error } = useQuranData(mode, id);
  const { chapters } = useChapters();
  const { arabicFont, arabicFontSize, translationFontSize } = useQuranSettings();
  const { play } = useAudio();
  const maxId = mode === "Surah" ? 114 : mode === "Juz" ? 30 : 604;
  const surahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Fetch translations for current surah(s)
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    if (viewMode !== "Translation" || !verses.length) return;
    const surahIds = [...new Set(verses.map((v) => Number(v.verse_key.split(":")[0])))];
    surahIds.forEach((sid) => {
      fetch(`/api/quran/translation/surah/${sid}`)
        .then((r) => r.json())
        .then((d) => {
          const map: Record<string, string> = {};
          Object.entries(d.verses ?? {}).forEach(([ayah, v]: [string, any]) => {
            map[`${sid}:${ayah}`] = v.translation;
          });
          setTranslations((prev) => ({ ...prev, ...map }));
        })
        .catch(() => {});
    });
  }, [viewMode, verses]);

  useEffect(() => {
    if (scrollToSurahId && surahRefs.current[scrollToSurahId]) {
      surahRefs.current[scrollToSurahId]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollToSurahId]);

  // Group by page
  const pages: { pageNumber: number; juzNumber: number; surahName: string; verseList: typeof verses }[] = [];
  verses.forEach((verse) => {
    const pg = verse.page_number;
    const jz = verse.juz_number;
    const sName = chapters.find((c) => c.id === Number(verse.verse_key.split(":")[0]))?.name_simple ?? "—";
    const last = pages[pages.length - 1];
    if (!last || last.pageNumber !== pg) pages.push({ pageNumber: pg, juzNumber: jz, surahName: sName, verseList: [verse] });
    else last.verseList.push(verse);
  });

  const surahBoundaryVerseIds = new Set<number>();
  const surahBoundaryMap = new Map<number, number>();
  verses.forEach((verse, i) => {
    const cur = Number(verse.verse_key.split(":")[0]);
    const prev = i > 0 ? Number(verses[i - 1].verse_key.split(":")[0]) : null;
    if (cur !== prev) { surahBoundaryVerseIds.add(verse.id); surahBoundaryMap.set(verse.id, cur); }
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-8 py-8 gap-2">

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && <p className="text-red-400 py-20">{error}</p>}

          {!loading && !error && (
            <div className="w-full max-w-2xl flex flex-col">

              {/* ── READING MODE ── */}
              {viewMode === "Reading" && pages.map((page, pageIndex) => {
                const surahHeadersOnPage: { verseId: number; surahId: number }[] = [];
                page.verseList.forEach((verse) => {
                  if (surahBoundaryVerseIds.has(verse.id)) {
                    surahHeadersOnPage.push({ verseId: verse.id, surahId: surahBoundaryMap.get(verse.id)! });
                  }
                });

                return (
                  <div key={page.pageNumber}>
                    <PageSeparator surahName={page.surahName} pageNumber={page.pageNumber} juzNumber={page.juzNumber} showBorder={pageIndex > 0} />
                    {surahHeadersOnPage.map(({ surahId }) => (
                      <div key={surahId} ref={(el) => { surahRefs.current[surahId] = el; }}>
                        <SurahHeader chapterId={surahId} chapters={chapters} />
                      </div>
                    ))}
                    <div className="text-gray-800 dark:text-gray-200 mb-4" dir="rtl"
                      style={{ fontSize: `${arabicFontSize}px`, lineHeight: "3rem", textAlign: "center", fontFamily: arabicFont }}>
                      {page.verseList.map((verse) => (
                        <span key={verse.id}>
                          {verse.words?.map((word) => <WordChip key={word.id} word={word} />)}
                          <AyahEndMark number={verse.verse_number} />
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* ── TRANSLATION MODE ── */}
              {viewMode === "Translation" && (() => {
                // Show surah header once at top
                const firstSurahId = verses[0] ? Number(verses[0].verse_key.split(":")[0]) : null;
                return (
                  <>
                    {firstSurahId && (
                      <div ref={(el) => { if (firstSurahId) surahRefs.current[firstSurahId] = el; }}>
                        <SurahHeader chapterId={firstSurahId} chapters={chapters} />
                      </div>
                    )}
                    {verses.map((verse) => (
                      <TranslationVerse
                        key={verse.id}
                        verse={verse}
                        translation={translations[verse.verse_key]}
                        onPlayAudio={play}
                        onOpenTafsir={onOpenTafsir}
                        arabicFont={arabicFont}
                        arabicFontSize={arabicFontSize}
                        translationFontSize={translationFontSize}
                      />
                    ))}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-center gap-4 py-4 border-t dark:border-neutral-800 flex-shrink-0">
        <button onClick={onPrev} disabled={id <= 1}
          className="flex items-center gap-1 px-5 py-2 rounded-full border dark:border-neutral-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button onClick={onNext} disabled={id >= maxId}
          className="flex items-center gap-1 px-5 py-2 rounded-full border dark:border-neutral-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}