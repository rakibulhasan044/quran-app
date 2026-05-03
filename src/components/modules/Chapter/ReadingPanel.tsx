// // components/modules/Chapter/ReadingPanel.tsx
// "use client";

// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useQuranData } from "@/hooks/useQuranData";
// import { useChapters } from "@/hooks/useQuranMeta";
// import { useRef, useState } from "react";
// import type { Word } from "@/types/quran";

// type Mode = "Surah" | "Juz" | "Page";

// interface ReadingPanelProps {
//   mode: Mode;
//   id: number;
//   onPrev: () => void;
//   onNext: () => void;
// }

// /* ---------------- helpers ---------------- */

// function toArabicIndic(n: number): string {
//   return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
// }

// function AyahEndMark({ number }: { number: number }) {
//   return (
//     <span
//       className="inline-flex items-center justify-center mx-2 w-9 h-9 rounded-full border-2 border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 text-sm font-semibold select-none"
//       style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
//     >
//       {toArabicIndic(number)}
//     </span>
//   );
// }

// /* ---------------- Word Chip ---------------- */

// function WordChip({
//   word,
//   banglaVerse,
// }: {
//   word: Word;
//   banglaVerse?: string;
// }) {
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const [hovering, setHovering] = useState(false);

//   const isWord = word.char_type_name === "word";

//   const englishText = word.translation?.text;

//   const playAudio = () => {
//     if (!word.audio_url) return;

//     const url = word.audio_url.startsWith("http")
//       ? word.audio_url
//       : `https://audio.qurancdn.com/${word.audio_url}`;

//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.src = url;
//       audioRef.current.play().catch(() => {});
//     } else {
//       const audio = new Audio(url);
//       audioRef.current = audio;
//       audio.play().catch(() => {});
//     }
//   };

//   if (!isWord) return null;

//   /* ---------------- SMART TOOLTIP LOGIC ---------------- */
//   const tooltipText =
//     banglaVerse?.trim()
//       ? banglaVerse
//       : englishText?.trim()
//       ? englishText
//       : "—";

//   return (
//     <span className="relative inline-flex flex-col items-center">
//       {/* Tooltip */}
//       {hovering && (
//         <span
//           className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-lg shadow-lg pointer-events-none"
//         >
//           {tooltipText}

//           <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
//         </span>
//       )}

//       {/* Arabic word */}
//       <span
//         onClick={playAudio}
//         onMouseEnter={() => setHovering(true)}
//         onMouseLeave={() => setHovering(false)}
//         className="cursor-pointer px-1 py-0.5 rounded-lg transition-all hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300 active:scale-95"
//         style={{
//           fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
//           fontSize: "28px",
//           lineHeight: "3.2rem",
//         }}
//       >
//         {word.text_indopak}
//       </span>
//     </span>
//   );
// }

// /* ---------------- Main Panel ---------------- */

// export function ReadingPanel({
//   mode,
//   id,
//   onPrev,
//   onNext,
// }: ReadingPanelProps) {
//   const { verses, loading, error } = useQuranData(mode, id);
//   const { chapters } = useChapters();

//   const firstVerse = verses[0];
//   const chapterId = firstVerse
//     ? Number(firstVerse.verse_key.split(":")[0])
//     : null;

//   const chapter = chapters.find((c) => c.id === chapterId);

//   const surahName = chapter?.name_simple ?? "—";
//   const pageNum = firstVerse?.page_number ?? "-";
//   const juzNum = firstVerse?.juz_number ?? "-";

//   const isMakkah =
//     chapter?.revelation_place?.toLowerCase() === "makkah";

//   const ayahCount = chapter?.verses_count;
//   const revelationPlace = isMakkah ? "Makkah" : "Madinah";
//   const maxId = mode === "Surah" ? 114 : mode === "Juz" ? 30 : 604;

//   return (
//     <div className="flex flex-col h-full overflow-hidden">

//       {/* Top bar */}
//       <div className="flex justify-between px-8 py-3 border-b text-sm text-gray-500 dark:text-gray-400">
//         <span>{surahName}</span>
//         <span>Page: {String(pageNum).padStart(2, "0")}</span>
//         <span>Juz: {String(juzNum).padStart(2, "0")}</span>
//       </div>

//       {/* Content */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="flex flex-col items-center px-8 py-6 gap-6">

//           {/* Header */}
//           {mode === "Surah" && chapter && (
//             <div className="text-center">
//               <h1 className="text-2xl font-bold">
//                 Surah {surahName}
//               </h1>
//               <p className="text-sm text-gray-500 mt-1">
//                 Ayah {String(ayahCount).padStart(2, "0")} · {revelationPlace}
//               </p>
//             </div>
//           )}

//           {/* Loading */}
//           {loading && (
//             <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
//           )}

//           {/* Error */}
//           {error && (
//             <p className="text-red-400">{error}</p>
//           )}

//           {/* Verses */}
//           {!loading && !error && (
//             <div className="w-full max-w-2xl" dir="rtl">
//               {verses.map((verse) => {
//                 const banglaVerse =
//                   verse.translations?.find(
//                     (t) => t.language_name === "bengali"
//                   )?.text;

//                 return (
//                   <span key={verse.id} className="inline">
//                     {verse.words?.map((word) => (
//                       <WordChip
//                         key={word.id}
//                         word={word}
//                         banglaVerse={banglaVerse}
//                       />
//                     ))}

//                     <AyahEndMark number={verse.verse_number} />
//                   </span>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Bottom bar */}
//       <div className="flex justify-between px-8 py-3 border-t text-sm text-gray-500 dark:text-gray-400">
//         <span>{surahName}</span>
//         <span>Page: {String(pageNum).padStart(2, "0")}</span>
//         <span>Juz: {String(juzNum).padStart(2, "0")}</span>
//       </div>

//       {/* Navigation */}
//       <div className="flex justify-center gap-4 py-4 border-t">
//         <button
//           onClick={onPrev}
//           disabled={id <= 1}
//           className="flex items-center gap-1 px-5 py-2 border rounded-full disabled:opacity-30 cursor-pointer"
//         >
//           <ChevronLeft className="w-4 h-4" />
//           Previous
//         </button>

//         <button
//           onClick={onNext}
//           disabled={id >= maxId}
//           className="flex items-center gap-1 px-5 py-2 border rounded-full disabled:opacity-30 cursor-pointer"
//         >
//           Next
//           <ChevronRight className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// }

// components/modules/Chapter/ReadingPanel.tsx
"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuranData } from "@/hooks/useQuranData";
import { useChapters } from "@/hooks/useQuranMeta";
import { useRef, useState } from "react";
import type { Word } from "@/types/quran";

type Mode = "Surah" | "Juz" | "Page";

interface ReadingPanelProps {
  mode: Mode;
  id: number;
  onPrev: () => void;
  onNext: () => void;
}

function toArabicIndic(n: number): string {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
}

function AyahEndMark({ number }: { number: number }) {
  return (
    <span
      className="inline-flex items-center justify-center mx-2 w-9 h-9 rounded-full border-2 border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 text-sm font-semibold align-middle select-none"
      style={{ fontFamily: "'Noto Naskh Arabic', serif", lineHeight: 1 }}
    >
      {toArabicIndic(number)}
    </span>
  );
}

function WordChip({ word }: { word: Word }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hovering, setHovering] = useState(false);

  const isWord = word.char_type_name === "word";
  const banglaText = word.translation?.text;

  const playAudio = () => {
    if (!word.audio_url) return;
    const url = word.audio_url.startsWith("http")
      ? word.audio_url
      : `https://audio.qurancdn.com/${word.audio_url}`;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.play().catch(() => {});
    } else {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play().catch(() => {});
    }
  };

  if (!isWord) return null;

  return (
    <span className="relative inline-flex flex-col items-center">
      {/* Bangla tooltip on hover */}
      {hovering && banglaText && (
        <span
          className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-lg shadow-lg pointer-events-none"
          style={{ fontFamily: "inherit" }}
        >
          {banglaText}
          <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-100" />
        </span>
      )}

      {/* Arabic word */}
      <span
        onClick={playAudio}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="cursor-pointer px-1 py-0.5 rounded-lg transition-all hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300 active:scale-95"
        style={{
          fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
          fontSize: "28px",
          lineHeight: "3.2rem",
        }}
      >
        {word.text_indopak}
      </span>
    </span>
  );
}

export function ReadingPanel({ mode, id, onPrev, onNext }: ReadingPanelProps) {
  const { verses, loading, error } = useQuranData(mode, id);
  const { chapters } = useChapters();

  const firstVerse = verses[0];
  const chapterId = firstVerse ? Number(firstVerse.verse_key.split(":")[0]) : null;
  const chapter = chapters.find((c) => c.id === chapterId);

  const surahName = chapter?.name_simple ?? "—";
  const pageNum = firstVerse?.page_number ?? "-";
  const juzNum = firstVerse?.juz_number ?? "-";
  const isMakkah = chapter?.revelation_place?.toLowerCase() === "makkah";
  const ayahCount = chapter?.verses_count;
  const revelationPlace = isMakkah ? "Makkah" : "Madinah";
  const maxId = mode === "Surah" ? 114 : mode === "Juz" ? 30 : 604;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top meta bar */}
      <div className="flex items-center justify-between px-8 py-3 border-b dark:border-neutral-800 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
        <span>{surahName}</span>
        <span>Page: {String(pageNum).padStart(2, "0")}</span>
        <span>Juz: {String(juzNum).padStart(2, "0")}</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-8 py-6 gap-6">

          {/* Surah header */}
          {mode === "Surah" && chapter && (
            <div className="flex items-center justify-between w-full max-w-2xl">
              <div className="w-24 h-24 opacity-20 dark:opacity-10 flex items-center justify-center">
                {isMakkah ? (
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-gray-500">
                    <rect x="30" y="40" width="40" height="40" rx="2"/>
                    <rect x="42" y="55" width="16" height="25" rx="1"/>
                    <rect x="20" y="40" width="10" height="30" rx="1"/>
                    <rect x="70" y="40" width="10" height="30" rx="1"/>
                    <polygon points="50,10 38,40 62,40"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-gray-500">
                    <rect x="25" y="50" width="50" height="35" rx="2"/>
                    <ellipse cx="50" cy="50" rx="20" ry="20"/>
                    <rect x="45" y="10" width="10" height="20" rx="2"/>
                    <rect x="20" y="50" width="8" height="25" rx="1"/>
                    <rect x="72" y="50" width="8" height="25" rx="1"/>
                  </svg>
                )}
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Surah {surahName}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Ayah {String(ayahCount).padStart(2, "0")} · {revelationPlace}
                </p>
              </div>

              <div className="w-24 text-right">
                {id !== 1 && id !== 9 && (
                  <p className="text-sm text-gray-400 font-arabic" dir="rtl">
                    بِسۡمِ اللّٰهِ
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && <p className="text-red-400 py-20">{error}</p>}

          {/* Verses with word-by-word */}
          {!loading && !error && (
            <div className="w-full max-w-2xl" dir="rtl">
              {verses.map((verse) => (
                <span key={verse.id} className="inline">
                  {/* Render each word */}
                  {verse.words?.map((word) => (
                    <WordChip key={word.id} word={word} />
                  ))}
                  {/* Ayah number circle */}
                  <AyahEndMark number={verse.verse_number} />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom meta bar */}
      <div className="flex items-center justify-between px-8 py-3 border-t dark:border-neutral-800 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
        <span>{surahName}</span>
        <span>Page: {String(pageNum).padStart(2, "0")}</span>
        <span>Juz: {String(juzNum).padStart(2, "0")}</span>
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-center gap-4 py-4 border-t dark:border-neutral-800 flex-shrink-0">
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
    </div>
  );
}