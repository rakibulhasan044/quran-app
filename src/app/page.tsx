"use client";
import { useState, useCallback } from "react";
import { Navbar } from "@/components/shared/Navbar";
import SideNavbar from "@/components/shared/SideNavbar";
import { ToggleOptions } from "@/components/modules/Chapter/ToggleOptions";
import { X, BookOpen } from "lucide-react";
import { ReadingPanel } from "@/components/modules/ReadingSection/ReadingPanel";
import { RightPanel } from "@/components/modules/FontSetting/RightPanel";

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
  const [menuOpen, setMenuOpen] = useState(false);

  const [tafsirVerse, setTafsirVerse] = useState<{
    surahId: number;
    ayahId: number;
  } | null>(null);

  const handleOpenTafsir = (surahId: number, ayahId: number) => {
    setTafsirVerse({ surahId, ayahId });
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
  }, []);

  const toggleProps = {
    mode,
    onModeChange: setMode,
    selectedSurah,
    selectedJuz,
    selectedPage,
    onScrollToSurah: handleScrollToSurah,
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Side navbar — md+ only */}
      <div className="hidden md:flex items-center justify-center flex-shrink-0 bg-[#F3F4F6] dark:bg-[#171717]">
        <SideNavbar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenMenu={() => setMenuOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel — full ToggleOptions */}
          <div className="hidden lg:flex w-72 border-r dark:border-neutral-800 overflow-hidden flex-col flex-shrink-0">
            <ToggleOptions
              {...toggleProps}
              onSurahSelect={setSelectedSurah}
              onJuzSelect={setSelectedJuz}
              onPageSelect={setSelectedPage}
            />
          </div>

          {/* Reading panel */}
          <div className="flex-1 border-r dark:border-neutral-800 overflow-hidden flex flex-col min-w-0">
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

          {/* Right panel — xl+ only */}
          <div className="hidden xl:flex w-72 flex-col flex-shrink-0">
            <RightPanel viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <SideNavbar />
      </div>

      {/* ── LEFT MENU DRAWER (below lg) ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-sm bg-white dark:bg-neutral-900 z-50 shadow-2xl
          flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-4 border-b dark:border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight">
                Quran Mazid
              </p>
              <p className="text-xs text-gray-400">
                Read, Study, and Learn The Quran
              </p>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Full ToggleOptions inside drawer — closes on select */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ToggleOptions
            {...toggleProps}
            onSurahSelect={(id) => {
              setSelectedSurah(id);
            }}
            onJuzSelect={(id) => {
              setSelectedJuz(id);
            }}
            onPageSelect={(id) => {
              setSelectedPage(id);
            }}
          />
        </div>
      </div>

      {/* ── SETTINGS DRAWER (below xl) ── */}
      {settingsOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 xl:hidden"
          onClick={() => setSettingsOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-neutral-900 z-50 shadow-2xl
          transform transition-transform duration-300 ease-in-out xl:hidden
          ${settingsOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-neutral-800 flex-shrink-0">
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
        <div className="overflow-y-auto h-[calc(100%-57px)]">
          <RightPanel viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>
    </div>
  );
}
