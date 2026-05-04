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

  const pages = useMemo(
    () =>
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
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-100 dark:bg-[#171717] text-sm outline-none "
        />
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto flex-1 no-scrollbar">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all cursor-pointer w-full border
              ${
                selected === p
                  ? "bg-[#F4F7F3] dark:bg-[#121810] border-[#C5D5C2] dark:border-[#2a3d27]"
                  : "border-slate-100 dark:border-neutral-800 hover:bg-[#F4F7F3] dark:hover:bg-[#121810] hover:border-[#C5D5C2] dark:hover:border-[#2a3d27]"
              }`}
          >
            {/* Diamond badge */}
            <div
              className={`w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors
                ${
                  selected === p
                    ? "bg-[#428039] text-white"
                    : "bg-slate-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 group-hover:bg-[#428039] group-hover:text-white dark:group-hover:bg-[#428039] dark:group-hover:text-white"
                }`}
              style={{ borderRadius: "6px", transform: "rotate(45deg)" }}
            >
              <span
                style={{ transform: "rotate(-45deg)" }}
                className="text-xs font-bold"
              >
                {p}
              </span>
            </div>

            {/* Label */}
            <p
              className={`text-sm font-semibold ${
                selected === p
                  ? "text-black dark:text-white"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              Page {p}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}