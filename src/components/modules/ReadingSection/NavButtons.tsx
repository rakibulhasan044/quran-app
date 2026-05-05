"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavButtonsProps {
  id: number;
  maxId: number;
  onPrev: () => void;
  onNext: () => void;
}

export function NavButtons({ id, maxId, onPrev, onNext }: NavButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-2 border-t dark:border-neutral-800 flex-shrink-0">
      <button
        onClick={onPrev}
        disabled={id <= 1}
        className="flex items-center gap-1 px-5 py-2 rounded-full border dark:border-neutral-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" /> Previous
      </button>
      <button
        onClick={onNext}
        disabled={id >= maxId}
        className="flex items-center gap-1 px-5 py-2 rounded-full border dark:border-neutral-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}