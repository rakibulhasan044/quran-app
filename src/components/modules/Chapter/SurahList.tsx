// components/modules/Chapter/SurahList.tsx
"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { useChapters } from "@/hooks/useQuranMeta";

interface SurahListProps {
  selected: number;
  onSelect: (id: number) => void;
}

export function SurahList({ selected, onSelect }: SurahListProps) {
  const [search, setSearch] = useState("");
  const { chapters, loading } = useChapters();

  const filtered = chapters.filter((c) =>
    c.name_simple.toLowerCase().includes(search.toLowerCase()) ||
    c.translated_name.name.toLowerCase().includes(search.toLowerCase()) ||
    String(c.id).includes(search)
  );

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Surah"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto flex-1">
        {loading && <p className="text-sm text-gray-400 text-center py-4">Loading...</p>}
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all cursor-pointer w-full
              ${selected === c.id
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "hover:bg-gray-50 dark:hover:bg-neutral-800"
              }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-semibold flex-shrink-0
              ${selected === c.id
                ? "bg-green-600 text-white"
                : "bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {c.id}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${selected === c.id ? "text-green-700 dark:text-green-400" : "text-gray-800 dark:text-gray-200"}`}>
                {c.name_simple}
              </p>
              <p className="text-xs text-gray-400">{c.translated_name.name}</p>
            </div>
            <span className="text-sm text-gray-400 font-arabic flex-shrink-0" dir="rtl">
              {c.name_arabic}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}