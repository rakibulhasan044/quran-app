"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ViewMode = "Reading" | "Translation";

interface Props {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export function RightToggle({ mode, onModeChange }: Props) {
  return (
    <div className="p-3 w-full">
      <ToggleGroup
        // type="single"
        value={[mode] as readonly string[]}
        onValueChange={(val: readonly string[]) => {
            if (val.length > 0) onModeChange(val[val.length - 1] as ViewMode);
          }}
        className="bg-gray-100 dark:bg-neutral-900 rounded-2xl p-1.5"
      >
        {(["Reading", "Translation"] as ViewMode[]).map((item) => (
          <ToggleGroupItem
            key={item}
            value={item}
            className={`flex-1 h-8 rounded-xl text-sm cursor-pointer
              ${
                mode === item
                  ? "!bg-white dark:!bg-black font-semibold"
                  : "text-gray-500"
              }`}
          >
            {item}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}