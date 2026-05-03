// components/modules/Chapter/PageList.tsx
"use client";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

interface PageListProps {
  selected: number;
  onSelect: (id: number) => void;
}

export function PageList({ selected, onSelect }: PageListProps) {
  const [search, setSearch] = useState("");

  const pages = useMemo(() =>
    Array.from({ length: 604 }, (_, i) => i + 1).filter((p) =>
      search ? String(p).includes(search) : true
    ),
    [search]
  );

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Page"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto flex-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all cursor-pointer w-full
              ${selected === p
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "hover:bg-gray-50 dark:hover:bg-neutral-800"
              }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0
              ${selected === p
                ? "bg-green-600 text-white"
                : "bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {p}
            </div>
            <p className={`text-sm font-semibold ${selected === p ? "text-green-700 dark:text-green-400" : "text-gray-800 dark:text-gray-200"}`}>
              Page {p}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}