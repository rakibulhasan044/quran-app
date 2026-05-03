// app/page.tsx
"use client";
import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import SideNavbar from "@/components/shared/SideNavbar";
import { ToggleOptions } from "@/components/modules/Chapter/ToggleOptions";
import { ReadingPanel } from "@/components/modules/Chapter/ReadingPanel";
// import { RightPanel } from "@/components/modules/Chapter/RightPanel";

type Mode = "Surah" | "Juz" | "Page";

export default function Home() {
  const [mode, setMode] = useState<Mode>("Surah");
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedJuz, setSelectedJuz]     = useState(1);
  const [selectedPage, setSelectedPage]   = useState(1);

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

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Side icon nav */}
      <div className="w-15 flex items-center justify-center flex-shrink-0">
        <SideNavbar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <div className="grid grid-cols-5 flex-1 overflow-hidden">
          {/* Left panel — col 1 */}
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
            />
          </div>

          {/* Middle reading — col 3 */}
          <div className="col-span-3 border-r dark:border-neutral-800 overflow-hidden flex flex-col">
            <ReadingPanel
              mode={mode}
              id={currentId}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>

          {/* Right panel — col 1 */}
          <div className="col-span-1 overflow-hidden flex flex-col">
            {/* <RightPanel /> */}
            jjj
          </div>
        </div>
      </div>
    </div>
  );
}