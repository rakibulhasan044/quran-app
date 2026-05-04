// components/shared/AudioPlayerBar.tsx
"use client";
import { useAudio } from "@/context/AudioContext";
import { Play, Pause, Square, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";

function fmt(s: number) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function AudioPlayerBar() {
  const { isPlaying, currentUrl, currentLabel, progress, duration, pause, resume, stop, seek } = useAudio();

  if (!currentUrl) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t dark:border-neutral-800 shadow-2xl px-6 py-3 flex items-center gap-4">
      {/* Label */}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-40 truncate flex-shrink-0">
        {currentLabel}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer">
          <SkipBack className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={isPlaying ? pause : resume}
          className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center cursor-pointer transition-colors"
        >
          {isPlaying
            ? <Pause className="w-5 h-5 text-white" />
            : <Play className="w-5 h-5 text-white ml-0.5" />
          }
        </button>
        <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer">
          <SkipForward className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 flex-1">
        <span className="text-xs text-gray-400 w-10 text-right flex-shrink-0">{fmt(progress)}</span>
        <Slider
          value={[duration ? (progress / duration) * 100 : 0]}
          max={100}
          step={0.1}
          onValueChange={([v]) => seek(v / 100)}
          className="flex-1 accent-green-600"
        />
        <span className="text-xs text-gray-400 w-10 flex-shrink-0">{fmt(duration)}</span>
      </div>

      {/* Stop */}
      <button
        onClick={stop}
        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer flex-shrink-0"
      >
        <Square className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}