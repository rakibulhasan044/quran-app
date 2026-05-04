// components/modules/Chapter/ToggleOptions.tsx
"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SurahList } from "./SurahList";
import { JuzList } from "./JuzList";
import { PageList } from "./PageList";

type Mode = "Surah" | "Juz" | "Page" ;

interface ToggleOptionsProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  selectedSurah: number;
  selectedJuz: number;
  selectedPage: number;
  onSurahSelect: (id: number) => void;
  onJuzSelect: (id: number) => void;
  onPageSelect: (id: number) => void;
  onScrollToSurah?: (surahId: number) => void; // NEW — scroll within Juz
}

export function ToggleOptions({
  mode,
  onModeChange,
  selectedSurah,
  selectedJuz,
  selectedPage,
  onSurahSelect,
  onJuzSelect,
  onPageSelect,
  onScrollToSurah,
}: ToggleOptionsProps) {
  return (
    <div className="flex flex-col gap-3 p-3 h-full">
      {/* Toggle */}
      <div className="bg-gray-100 dark:bg-neutral-900 rounded-2xl w-full">
        <ToggleGroup
          spacing={2}
          value={[mode] as readonly string[]}
          onValueChange={(val: readonly string[]) => {
            if (val.length > 0) onModeChange(val[val.length - 1] as Mode);
          }}
          className="p-1.5 w-full"
        >
          {(["Surah", "Juz", "Page"] as Mode[]).map((item) => (
            <ToggleGroupItem
              key={item}
              value={item}
              className={`flex-1 cursor-pointer rounded-xl text-sm transition-all h-8
                ${mode === item
                  ? "!bg-white dark:!bg-black font-semibold shadow-sm !text-gray-900 dark:!text-white"
                  : "!bg-transparent font-normal !text-gray-500 dark:!text-gray-400 hover:!bg-gray-200 dark:hover:!bg-neutral-800"
                }`}
            >
              {item}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Lists */}
<div className="flex-1 min-h-0 overflow-hidden">
  {mode === "Surah" && (
    <SurahList selected={selectedSurah} onSelect={onSurahSelect} />
  )}
  {mode === "Juz" && (
    <JuzList
      selected={selectedJuz}
      onSelect={onJuzSelect}
      onScrollToSurah={onScrollToSurah}
    />
  )}
  {mode === "Page" && (
    <PageList selected={selectedPage} onSelect={onPageSelect} />
  )}
</div>
    </div>
  );
}