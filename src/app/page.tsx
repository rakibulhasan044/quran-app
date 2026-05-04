// app/page.tsx
"use client";
import { useState, useCallback } from "react";
import { Navbar } from "@/components/shared/Navbar";
import SideNavbar from "@/components/shared/SideNavbar";
import { ToggleOptions } from "@/components/modules/Chapter/ToggleOptions";
import { ReadingPanel } from "@/components/modules/Chapter/ReadingPanel";
import { RightPanel } from "@/components/modules/Chapter/RightPanel";
import { X } from "lucide-react";

type Mode = "Surah" | "Juz" | "Page";
type ViewMode = "Reading" | "Translation";

export default function Home() {
  const [mode, setMode] = useState<Mode>("Surah");
  const [viewMode, setViewMode] = useState<ViewMode>("Reading");
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedJuz, setSelectedJuz] = useState(1);
  const [selectedPage, setSelectedPage] = useState(1);
  const [scrollToSurahId, setScrollToSurahId] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [tafsirOpen, setTafsirOpen] = useState(false);
  const [tafsirVerse, setTafsirVerse] = useState<{
    surahId: number;
    ayahId: number;
  } | null>(null);

  const handleOpenTafsir = (surahId: number, ayahId: number) => {
    setTafsirVerse({ surahId, ayahId });
    setTafsirOpen(true);
  };

  const currentId =
    mode === "Surah"
      ? selectedSurah
      : mode === "Juz"
        ? selectedJuz
        : selectedPage;

  const handlePrev = () => {
    if (mode === "Surah") setSelectedSurah((p) => Math.max(1, p - 1));
    if (mode === "Juz") setSelectedJuz((p) => Math.max(1, p - 1));
    if (mode === "Page") setSelectedPage((p) => Math.max(1, p - 1));
  };

  const handleNext = () => {
    if (mode === "Surah") setSelectedSurah((p) => Math.min(114, p + 1));
    if (mode === "Juz") setSelectedJuz((p) => Math.min(30, p + 1));
    if (mode === "Page") setSelectedPage((p) => Math.min(604, p + 1));
  };

  const handleScrollToSurah = useCallback((surahId: number) => {
    setScrollToSurahId(surahId);
    setTimeout(() => setScrollToSurahId(null), 500);
  }, []);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="w-15 flex items-center justify-center flex-shrink-0">
        <SideNavbar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onOpenSettings={() => setSettingsOpen(true)} />

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel */}
          <div className="w-72 border-r dark:border-neutral-800 overflow-hidden flex-col hidden md:flex flex-shrink-0">
            <ToggleOptions
              mode={mode}
              onModeChange={setMode}
              selectedSurah={selectedSurah}
              selectedJuz={selectedJuz}
              selectedPage={selectedPage}
              onSurahSelect={setSelectedSurah}
              onJuzSelect={setSelectedJuz}
              onPageSelect={setSelectedPage}
              onScrollToSurah={handleScrollToSurah}
            />
          </div>

          {/* Reading panel — takes remaining space */}
          <div className="flex-1 border-r dark:border-neutral-800 overflow-hidden flex flex-col">
            <ReadingPanel
              mode={mode}
              viewMode={viewMode}
              id={currentId}
              onPrev={handlePrev}
              onNext={handleNext}
              scrollToSurahId={scrollToSurahId}
              onOpenTafsir={handleOpenTafsir}
            />
          </div>

          {/* Right panel — visible only on xl screens */}
          <div className="hidden xl:flex w-72 flex-col flex-shrink-0">
            <RightPanel viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>
      </div>

      {/* ── DRAWER (tablet + mobile) ── */}
      {/* Backdrop */}
      {settingsOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 xl:hidden"
          onClick={() => setSettingsOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-neutral-900 z-50 shadow-2xl
          transform transition-transform duration-300 ease-in-out xl:hidden
          ${settingsOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-green-600">⚙</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              Settings
            </span>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Reuse RightPanel content inside drawer */}
        <div className="flex-1 overflow-y-auto h-[calc(100%-57px)]">
          <RightPanel viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>
    </div>
  );
}