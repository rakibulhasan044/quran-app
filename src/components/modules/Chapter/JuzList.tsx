// components/modules/Chapter/JuzList.tsx
"use client";
import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { useJuzs, useChapters } from "@/hooks/useQuranMeta";

interface JuzListProps {
  selected: number;
  onSelect: (id: number) => void;
  onScrollToSurah?: (surahId: number) => void; // scrolls reading panel, stays in Juz
}

export function JuzList({ selected, onSelect, onScrollToSurah }: JuzListProps) {
  const [search, setSearch] = useState("");
  const [expandedJuz, setExpandedJuz] = useState<number | null>(selected);
  const { juzs, loading } = useJuzs();
  const { chapters } = useChapters();

  const uniqueJuzs = juzs.filter(
    (j, index, self) =>
      index === self.findIndex((x) => x.juz_number === j.juz_number),
  );

  const getSurahsInJuz = (verseMapping: Record<string, string>) =>
    Object.keys(verseMapping).map((surahId) => {
      const chapter = chapters.find((c) => c.id === Number(surahId));
      return {
        id: Number(surahId),
        name: chapter?.name_simple ?? `Surah ${surahId}`,
        arabic: chapter?.name_arabic ?? "",
        translation: chapter?.translated_name?.name ?? "",
      };
    });

  const getFirstSurahName = (verseMapping: Record<string, string>) => {
    const firstId = Object.keys(verseMapping)[0];
    const chapter = chapters.find((c) => c.id === Number(firstId));
    const count = Object.keys(verseMapping).length;
    return chapter
      ? count > 1
        ? `${chapter.name_simple} & More`
        : chapter.name_simple
      : "—";
  };

  const filtered = uniqueJuzs.filter(
    (j) =>
      `juz ${j.juz_number}`.includes(search.toLowerCase()) ||
      String(j.juz_number).includes(search),
  );

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Juz"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-100 dark:bg-[#171717] text-sm outline-none "
        />
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto flex-1 no-scrollbar">
        {loading && (
          <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
        )}

        {filtered.map((j) => {
          const isSelected = selected === j.juz_number;
          const isExpanded = expandedJuz === j.juz_number;
          const surahsInJuz = getSurahsInJuz(j.verse_mapping);

          return (
            <div key={j.juz_number} className="flex flex-col">
              <button
                onClick={() => {
                  onSelect(j.juz_number);
                  setExpandedJuz(isExpanded ? null : j.juz_number);
                }}
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all cursor-pointer w-full border
                  ${
                    isSelected
                      ? "bg-[#F4F7F3] dark:bg-[#121810] border-[#C5D5C2] dark:border-[#2a3d27]"
                      : "border-slate-100 dark:border-neutral-800 hover:bg-[#F4F7F3] dark:hover:bg-[#121810] hover:border-[#C5D5C2] dark:hover:border-[#2a3d27]"
                  }`}
              >

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold ${isSelected ? "text-[#428039] dark:text-green-400" : "text-gray-800 dark:text-gray-200"}`}
                  >
                    Juz {j.juz_number}
                  </p>
                  <p className="text-xs text-gray-400">
                    {getFirstSurahName(j.verse_mapping)}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">
                    {surahsInJuz.length} Surah
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Surah dropdown — stays in Juz, scrolls reading panel */}

              {isExpanded && surahsInJuz.length > 1 && (
                <div className="mt-1 mb-1 flex flex-col gap-0.5">
                  {surahsInJuz.map((surah) => (
                    <button
                      key={surah.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(j.juz_number); // keep the juz selected in the list
                        onScrollToSurah?.(surah.id); // this now also sets mode + selectedSurah
                      }}
                      className="group flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all cursor-pointer w-full border border-slate-100 dark:border-neutral-800 hover:bg-[#F4F7F3] dark:hover:bg-[#121810] hover:border-[#C5D5C2] dark:hover:border-[#2a3d27]"
                    >
                      {/* diamond */}
                      <div
                        className="w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors bg-slate-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 group-hover:bg-[#428039] group-hover:text-white dark:group-hover:bg-[#428039] dark:group-hover:text-white"
                        style={{
                          borderRadius: "6px",
                          transform: "rotate(45deg)",
                        }}
                      >
                        <span
                          style={{ transform: "rotate(-45deg)" }}
                          className="text-xs font-bold"
                        >
                          {surah.id}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {surah.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {surah.translation}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
