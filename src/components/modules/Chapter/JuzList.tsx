// components/modules/Chapter/JuzList.tsx
"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { useJuzs } from "@/hooks/useQuranMeta";
import { useChapters } from "@/hooks/useQuranMeta";

interface JuzListProps {
  selected: number;
  onSelect: (id: number) => void;
}

export function JuzList({ selected, onSelect }: JuzListProps) {
  const [search, setSearch] = useState("");
  const { juzs, loading } = useJuzs();
  const { chapters } = useChapters();

  // Get first surah name of each juz
  const getFirstSurahName = (juz: { verse_mapping: Record<string, string> }) => {
    const firstSurahId = Object.keys(juz.verse_mapping)[0];
    const chapter = chapters.find((c) => c.id === Number(firstSurahId));
    const surahCount = Object.keys(juz.verse_mapping).length;
    return chapter ? `${chapter.name_simple} & More` : "—";
  };

  const filtered = juzs.filter((j) =>
    `juz ${j.juz_number}`.includes(search.toLowerCase()) ||
    String(j.juz_number).includes(search)
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
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto flex-1">
        {loading && <p className="text-sm text-gray-400 text-center py-4">Loading...</p>}
        {filtered.map((j) => (
          <button
            key={j.id}
            onClick={() => onSelect(j.juz_number)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all cursor-pointer w-full
              ${selected === j.juz_number
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "hover:bg-gray-50 dark:hover:bg-neutral-800"
              }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0
              ${selected === j.juz_number
                ? "bg-green-600 text-white"
                : "bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {j.juz_number}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${selected === j.juz_number ? "text-green-700 dark:text-green-400" : "text-gray-800 dark:text-gray-200"}`}>
                Juz {j.juz_number}
              </p>
              <p className="text-xs text-gray-400">{getFirstSurahName(j)}</p>
            </div>
            <span className="text-xs text-gray-400">
              {Object.keys(j.verse_mapping).length} Surah
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}