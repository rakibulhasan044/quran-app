// components/modules/Chapter/JuzList.tsx
"use client";
import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { useJuzs, useChapters } from "@/hooks/useQuranMeta";

interface JuzListProps {
  selected: number;
  onSelect: (id: number) => void;
}

export function JuzList({ selected, onSelect }: JuzListProps) {
  const [search, setSearch] = useState("");
  const [expandedJuz, setExpandedJuz] = useState<number | null>(selected);
  const { juzs, loading } = useJuzs();
  const { chapters } = useChapters();

  // Deduplicate juzs by juz_number
  const uniqueJuzs = juzs.filter(
    (j, index, self) =>
      index === self.findIndex((x) => x.juz_number === j.juz_number)
  );

  const getSurahsInJuz = (verseMapping: Record<string, string>) => {
    return Object.keys(verseMapping).map((surahId) => {
      const chapter = chapters.find((c) => c.id === Number(surahId));
      return {
        id: Number(surahId),
        name: chapter?.name_simple ?? `Surah ${surahId}`,
        translation: chapter?.translated_name?.name ?? "",
        verses: verseMapping[surahId],
      };
    });
  };

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
      String(j.juz_number).includes(search)
  );

  const toggleExpand = (juzNumber: number) => {
    setExpandedJuz((prev) => (prev === juzNumber ? null : juzNumber));
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Juz"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm outline-none focus:ring-2 focus:ring-green-500"
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
          const surahCount = surahsInJuz.length;

          return (
            <div key={j.juz_number} className="flex flex-col">
              {/* Juz row */}
              <button
                onClick={() => {
                  onSelect(j.juz_number);
                  toggleExpand(j.juz_number);
                }}
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all cursor-pointer w-full border
                  ${
                    isSelected
                      ? "bg-[#F4F7F3] dark:bg-[#121810] border-[#C5D5C2] dark:border-[#2a3d27]"
                      : "border-slate-100 dark:border-neutral-800 hover:bg-[#F4F7F3] dark:hover:bg-[#121810] hover:border-[#C5D5C2] dark:hover:border-[#2a3d27]"
                  }`}
              >
                {/* Diamond badge */}
                <div
                  className={`w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors
                    ${
                      isSelected
                        ? "bg-[#428039] text-white"
                        : "bg-slate-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 group-hover:bg-[#428039] group-hover:text-white dark:group-hover:bg-[#428039] dark:group-hover:text-white"
                    }`}
                  style={{ borderRadius: "6px", transform: "rotate(45deg)" }}
                >
                  <span
                    style={{ transform: "rotate(-45deg)" }}
                    className="text-xs font-bold"
                  >
                    {j.juz_number}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold ${
                      isSelected
                        ? "text-[#428039] dark:text-green-400"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    Juz {j.juz_number}
                  </p>
                  <p className="text-xs text-gray-400">
                    {getFirstSurahName(j.verse_mapping)}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">
                    {surahCount} Surah
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Surah dropdown */}
              {isExpanded && (
                <div className="ml-4 mt-1 mb-1 flex flex-col gap-0.5 border-l-2 border-[#C5D5C2] dark:border-[#2a3d27] pl-3">
                  {surahsInJuz.map((surah) => (
                    <button
                      key={surah.id}
                      onClick={() => onSelect(j.juz_number)}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-all cursor-pointer w-full hover:bg-[#F4F7F3] dark:hover:bg-[#121810]"
                    >
                      <div
                        className="w-6 h-6 flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400"
                        style={{
                          borderRadius: "4px",
                          transform: "rotate(45deg)",
                        }}
                      >
                        <span
                          style={{ transform: "rotate(-45deg)" }}
                          className="text-[10px] font-bold"
                        >
                          {surah.id}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                          {surah.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {surah.translation}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">
                        {surah.verses}
                      </span>
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