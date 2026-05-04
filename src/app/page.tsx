// app/page.tsx
"use client";
import { useState, useCallback } from "react";
import { Navbar } from "@/components/shared/Navbar";
import SideNavbar from "@/components/shared/SideNavbar";
import { ToggleOptions } from "@/components/modules/Chapter/ToggleOptions";
import { ReadingPanel } from "@/components/modules/Chapter/ReadingPanel";
// import { RightPanel } from "@/components/modules/Chapter/RightPanel";

type Mode = "Surah" | "Juz" | "Page";

export default function Home() {
  const [mode, setMode] = useState<Mode>("Surah");
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedJuz, setSelectedJuz] = useState(1);
  const [selectedPage, setSelectedPage] = useState(1);
  const [scrollToSurahId, setScrollToSurahId] = useState<number | null>(null);

  const currentId =
    mode === "Surah" ? selectedSurah :
    mode === "Juz"   ? selectedJuz   : selectedPage;

  const handlePrev = () => {
    if (mode === "Surah") setSelectedSurah((p) => Math.max(1, p - 1));
    if (mode === "Juz")   setSelectedJuz((p)   => Math.max(1, p - 1));
    if (mode === "Page")  setSelectedPage((p)  => Math.max(1, p - 1));
  };

  const handleNext = () => {
    if (mode === "Surah") setSelectedSurah((p) => Math.min(114, p + 1));
    if (mode === "Juz")   setSelectedJuz((p)   => Math.min(30,  p + 1));
    if (mode === "Page")  setSelectedPage((p)  => Math.min(604, p + 1));
  };

  const handleScrollToSurah = useCallback((surahId: number) => {
    setScrollToSurahId(surahId);
    // Clear after a tick so it can re-trigger if clicked again
    setTimeout(() => setScrollToSurahId(null), 500);
  }, []);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="w-15 flex items-center justify-center flex-shrink-0">
        <SideNavbar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="grid grid-cols-5 flex-1 overflow-hidden">
          <div className="col-span-1 border-r dark:border-neutral-800 overflow-hidden flex flex-col">
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

          <div className="col-span-3 border-r dark:border-neutral-800 overflow-hidden flex flex-col">
            <ReadingPanel
              mode={mode}
              id={currentId}
              onPrev={handlePrev}
              onNext={handleNext}
              scrollToSurahId={scrollToSurahId}
            />
          </div>

          <div className="col-span-1 overflow-hidden flex flex-col">
            {/* <RightPanel /> */}
          </div>
        </div>
      </div>
    </div>
  );
}