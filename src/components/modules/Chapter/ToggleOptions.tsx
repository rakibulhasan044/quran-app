// components/modules/Chapter/ToggleOptions.tsx
"use client";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SurahList } from "./SurahList";
import { JuzList } from "./JuzList";
import { PageList } from "./PageList";

type Mode = "Surah" | "Juz" | "Page";
// import { useQuranData } from "@/hooks/useQuranMeta";

// type Mode = "Surah" | "Juz" | "Page";

// export function ToggleOptions() {
//   const [mode, setMode] = useState<Mode>("Surah");
//   const [id, setId] = useState(1); // surah 1, juz 1, or page 1
//   const { verses, loading, error } = useQuranData(mode, id);

//   return (
//     <div className="w-full space-y-3">
//       {/* Toggle */}
//       <div className="bg-gray-100 dark:bg-neutral-900 rounded-2xl w-full">
//         <ToggleGroup
//           spacing={2}
//           value={[mode] as readonly string[]}
//           onValueChange={(val: readonly string[]) => {
//             if (val.length > 0) {
//               setMode(val[val.length - 1] as Mode);
//               setId(1); // reset to 1 on mode change
//             }
//           }}
//           className="p-1.5 w-full"
//         >
//           {(["Surah", "Juz", "Page"] as Mode[]).map((item) => (
//             <ToggleGroupItem
//               key={item}
//               value={item}
//               aria-label={`Toggle ${item}`}
//               className={`flex-1 cursor-pointer rounded-xl text-sm transition-all h-8
//                 ${mode === item
//                   ? "!bg-white dark:!bg-gray-800 font-semibold shadow-sm !text-gray-900 dark:!text-white"
//                   : "!bg-transparent font-normal !text-gray-500 dark:!text-gray-400 hover:!bg-gray-200 dark:hover:!bg-neutral-800"
//                 }`}
//             >
//               {item}
//             </ToggleGroupItem>
//           ))}
//         </ToggleGroup>
//       </div>

//       {/* Number selector */}
//       <div className="flex items-center gap-2 px-1">
//         <label className="text-sm text-gray-500 dark:text-gray-400">
//           {mode}:
//         </label>
//         <input
//           type="number"
//           min={1}
//           max={mode === "Surah" ? 114 : mode === "Juz" ? 30 : 604}
//           value={id}
//           onChange={(e) => setId(Number(e.target.value))}
//           className="w-16 border rounded-md px-2 py-1 text-sm dark:bg-neutral-800 dark:border-neutral-700"
//         />
//       </div>

//       {/* Results */}
//       {loading && <p className="text-sm text-gray-400 px-1">Loading...</p>}
//       {error && <p className="text-sm text-red-400 px-1">{error}</p>}
//       {!loading && !error && (
//         <div className="space-y-2 px-1">
//           {verses.map((v) => (
//             <div
//               key={v.id}
//               className="p-3 rounded-xl bg-gray-50 dark:bg-neutral-800 text-right"
//             >
//               <p className="text-base leading-loose font-arabic" dir="rtl">
//                 {v.text_indopak}
//               </p>
//               <p className="text-xs text-gray-400 mt-1 text-left">
//                 {v.verse_key} · Page {v.page_number} · Juz {v.juz_number}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// components/modules/Chapter/ToggleOptions.tsx - updated props
interface ToggleOptionsProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  selectedSurah: number;
  selectedJuz: number;
  selectedPage: number;
  onSurahSelect: (id: number) => void;
  onJuzSelect: (id: number) => void;
  onPageSelect: (id: number) => void;
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
}: ToggleOptionsProps) {
  return (
    <div className="flex flex-col gap-3 p-3 h-full">
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
                ${
                  mode === item
                    ? "!bg-white dark:!bg-gray-800 font-semibold shadow-sm !text-gray-900 dark:!text-white"
                    : "!bg-transparent font-normal !text-gray-500 dark:!text-gray-400 hover:!bg-gray-200 dark:hover:!bg-neutral-800"
                }`}
            >
              {item}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {mode === "Surah" && (
        <SurahList selected={selectedSurah} onSelect={onSurahSelect} />
      )}
      {mode === "Juz" && (
        <JuzList selected={selectedJuz} onSelect={onJuzSelect} />
      )}
      {mode === "Page" && (
        <PageList selected={selectedPage} onSelect={onPageSelect} />
      )}
    </div>
  );
}
