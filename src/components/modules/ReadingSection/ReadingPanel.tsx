"use client";
import { useQuranData } from "@/hooks/useQuranData";
import { useChapters } from "@/hooks/useQuranMeta";
import { useRef, useState, useEffect, useCallback } from "react";
import { useQuranSettings } from "@/context/QuranSettingsContext";
import { useAudio } from "@/context/AudioContext";
import {
  AyahEndMark,
  PageSeparator,
  SurahHeader,
  TranslationVerse,
  WordChip,
} from "./VerseComponents";
import { NavButtons } from "./NavButtons";

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

export function ReadingPanel({
  mode,
  viewMode,
  id,
  onPrev,
  onNext,
  scrollToSurahId,
  onOpenTafsir,
}: ReadingPanelProps) {
  const { verses, loading, error } = useQuranData(mode, id);
  const { chapters } = useChapters();
  const { arabicFont, arabicFontSize, translationFontSize } =
    useQuranSettings();
  const { play } = useAudio();
  const maxId = mode === "Surah" ? 114 : mode === "Juz" ? 30 : 604;
  const surahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const setSurahRef = useCallback(
    (surahId: number) => (el: HTMLDivElement | null) => {
      surahRefs.current[surahId] = el;
    },
    [],
  );

  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    if (viewMode !== "Translation" || !verses.length) return;
    const surahIds = [
      ...new Set(verses.map((v) => Number(v.verse_key.split(":")[0]))),
    ];
    surahIds.forEach((sid) => {
      fetch(`/api/quran/translation/surah/${sid}`)
        .then((r) => r.json())
        .then((d) => {
          const map: Record<string, string> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.entries(d.verses ?? {}).forEach(([ayah, v]: [string, any]) => {
            map[`${sid}:${ayah}`] = v.translation;
          });
          setTranslations((prev) => ({ ...prev, ...map }));
        })
        .catch(() => {});
    });
  }, [viewMode, verses]);

  useEffect(() => {
    if (!scrollToSurahId || loading || !verses.length) return;
    const surahIdsInVerses = new Set(
      verses.map((v) => Number(v.verse_key.split(":")[0])),
    );
    if (!surahIdsInVerses.has(scrollToSurahId)) return;
    const timer = setTimeout(() => {
      surahRefs.current[scrollToSurahId]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [scrollToSurahId, verses, loading]);

  // Build pages 
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
        ?.name_simple ?? "—";
    const last = pages[pages.length - 1];
    if (!last || last.pageNumber !== pg)
      pages.push({
        pageNumber: pg,
        juzNumber: jz,
        surahName: sName,
        verseList: [verse],
      });
    else last.verseList.push(verse);
  });

  const surahBoundaryVerseIds = new Set<number>();
  verses.forEach((verse, i) => {
    const cur = Number(verse.verse_key.split(":")[0]);
    const prev = i > 0 ? Number(verses[i - 1].verse_key.split(":")[0]) : null;
    if (cur !== prev) surahBoundaryVerseIds.add(verse.id);
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-2 px-8 py-8">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && <p className="text-red-400 py-20">{error}</p>}

          {!loading && !error && (
            <div className="w-full max-w-2xl flex flex-col">
              {/* ── READING MODE ── */}
              {viewMode === "Reading" &&
                pages.map((page, pageIndex) => {
                  const surahHeadersOnPage: {
                    verseId: number;
                    surahId: number;
                  }[] = [];
                  page.verseList.forEach((verse) => {
                    if (surahBoundaryVerseIds.has(verse.id)) {
                      surahHeadersOnPage.push({
                        verseId: verse.id,
                        surahId: Number(verse.verse_key.split(":")[0]),
                      });
                    }
                  });
                  const hasSurahHeader = surahHeadersOnPage.length > 0;

                  return (
                    <div key={page.pageNumber}>
                      {surahHeadersOnPage.map(({ surahId }) => (
                        <div key={surahId} ref={setSurahRef(surahId)}>
                          <SurahHeader
                            chapterId={surahId}
                            chapters={chapters}
                          />
                        </div>
                      ))}
                      <PageSeparator
                        surahName={page.surahName}
                        pageNumber={page.pageNumber}
                        juzNumber={page.juzNumber}
                        showBorder={pageIndex > 0 && !hasSurahHeader}
                      />
                      <div
                        className="text-gray-800 dark:text-gray-200 mb-4"
                        dir="rtl"
                        style={{
                          fontSize: `${arabicFontSize}px`,
                          lineHeight: "3rem",
                          textAlign: "center",
                          fontFamily: arabicFont,
                        }}
                      >
                        {page.verseList.map((verse) => (
                          <span key={verse.id}>
                            {verse.words?.map((word) => (
                              <WordChip
                                key={word.id}
                                word={word}
                                verseKey={verse.verse_key}
                                viewMode="Reading"
                              />
                            ))}
                            <AyahEndMark number={verse.verse_number} />
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}

              {/* ── TRANSLATION MODE ── */}
              {viewMode === "Translation" &&
                verses.map((verse, i) => {
                  const surahId = Number(verse.verse_key.split(":")[0]);
                  const prevSurahId =
                    i > 0
                      ? Number(verses[i - 1].verse_key.split(":")[0])
                      : null;
                  const isBoundary = surahId !== prevSurahId;
                  return (
                    <div key={verse.id}>
                      {isBoundary && (
                        <div ref={setSurahRef(surahId)}>
                          <SurahHeader
                            chapterId={surahId}
                            chapters={chapters}
                          />
                        </div>
                      )}
                      <TranslationVerse
                        verse={verse}
                        translation={translations[verse.verse_key]}
                        onPlayAudio={play}
                        onOpenTafsir={onOpenTafsir}
                        arabicFont={arabicFont}
                        arabicFontSize={arabicFontSize}
                        translationFontSize={translationFontSize}
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      <NavButtons id={id} maxId={maxId} onPrev={onPrev} onNext={onNext} />
    </div>
  );
}
