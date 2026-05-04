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

  const filtered = chapters.filter(
    (c) =>
      c.name_simple.toLowerCase().includes(search.toLowerCase()) ||
      c.translated_name.name.toLowerCase().includes(search.toLowerCase()) ||
      String(c.id).includes(search),
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

      <div className="flex flex-col gap-1 overflow-y-auto flex-1 no-scrollbar">
        {loading && (
          <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
        )}
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all cursor-pointer w-full border
              ${
                selected === c.id
                  ? "bg-[#F4F7F3] dark:bg-[#121810] border-[#C5D5C2] dark:border-[#2a3d27]"
                  : "border-slate-100 dark:border-neutral-800 hover:bg-[#F4F7F3] dark:hover:bg-[#121810] hover:border-[#C5D5C2] dark:hover:border-[#2a3d27]"
              }`}
          >
            {/* Diamond badge */}
            <div
              className={`w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors
                ${
                  selected === c.id
                    ? "bg-[#428039] text-white"
                    : "bg-slate-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 group-hover:bg-[#428039] group-hover:text-white dark:group-hover:bg-[#428039] dark:group-hover:text-white"
                }`}
              style={{ borderRadius: "6px", transform: "rotate(45deg)" }}
            >
              <span style={{ transform: "rotate(-45deg)" }} className="text-xs font-bold">
                {c.id}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold truncate ${
                  selected === c.id
                    ? "text-[#353635] dark:text-[#C5C5C5]"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {c.name_simple}
              </p>
              <p className="text-xs text-gray-400">{c.translated_name.name}</p>
            </div>

            <span className="text-sm text-[#7A8B85] font-arabic flex-shrink-0 font-semibold" dir="rtl">
              {c.name_arabic}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}