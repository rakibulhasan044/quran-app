// ToggleOptions.tsx
"use client";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ToggleOptions() {
  const [selected, setSelected] = useState("Surah");

  return (
    <div className="bg-gray-100 dark:bg-neutral-900 rounded-2xl w-full">
      <ToggleGroup
        spacing={2}
        value={[selected] as readonly string[]}
        onValueChange={(val: readonly string[]) => {
          if (val.length > 0) setSelected(val[val.length - 1]);
        }}
        className="p-1.5 w-full"
      >
        {["Surah", "Juz", "Page"].map((item) => (
          <ToggleGroupItem
            key={item}
            value={item}
            aria-label={`Toggle ${item}`}
            className={`flex-1 cursor-pointer rounded-xl text-sm transition-all h-8
              ${selected === item
                ? "bg-white dark:bg-gray-800 font-semibold shadow-sm text-gray-900 dark:text-white"
                : "font-normal text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800"
              }`}
          >
            {item}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}