// // components/modules/Chapter/RightPanel.tsx
// "use client";
// import { useState } from "react";
// import { ChevronDown, ChevronUp, BookOpen, Type } from "lucide-react";

// const MUSHAF_OPTIONS = [
//   {
//     id: "unicode",
//     label: "Unicode Text Mushaf",
//     preview: "بِسۡمِ اللّٰهِ الرَّحۡمٰنِ الرَّحِیۡمِ",
//   },
//   {
//     id: "hafezi",
//     label: "Hafezi Quran Mushaf",
//     preview: "بِسۡمِ اللّٰهِ الرَّحۡمٰنِ الرَّحِیۡمِ",
//   },
//   {
//     id: "madani",
//     label: "New Madani Mushaf",
//     preview: "بِسۡمِ اللّٰهِ الرَّحۡمٰنِ الرَّحِیۡمِ",
//   },
//   {
//     id: "nurani",
//     label: "Nurani Mushaf",
//     preview: "بِسۡمِ اللّٰهِ الرَّحۡمٰنِ الرَّحِیۡمِ",
//   },
//   {
//     id: "qaloon",
//     label: "Qaloon Mushaf",
//     preview: "بِسۡمِ اللّٰهِ الرَّحۡمٰنِ الرَّحِیۡمِ",
//   },
// ];

// const ARABIC_FONTS = [
//   "Noor E Hira",
//   "Noto Naskh Arabic",
//   "Amiri",
//   "Scheherazade New",
// ];

// export function RightPanel() {
//   const [tab, setTab]                   = useState<"Translation" | "Reading">("Reading");
//   const [mushaf, setMushaf]             = useState("unicode");
//   const [mushafOpen, setMushafOpen]     = useState(true);
//   const [fontOpen, setFontOpen]         = useState(false);
//   const [readingOpen, setReadingOpen]   = useState(false);
//   const [arabicSize, setArabicSize]     = useState(34);
//   const [translationSize, setTranslationSize] = useState(20);
//   const [arabicFont, setArabicFont]     = useState("Noor E Hira");

//   return (
//     <div className="flex flex-col h-full border-l dark:border-neutral-800 overflow-hidden">

//       {/* Tab toggle */}
//       <div className="flex border-b dark:border-neutral-800 flex-shrink-0">
//         {(["Translation", "Reading"] as const).map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             className={`flex-1 py-3 text-sm font-medium transition-all cursor-pointer
//               ${tab === t
//                 ? "border-b-2 border-green-600 text-green-600"
//                 : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//               }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       <div className="flex-1 overflow-y-auto">

//         {/* Reading Settings (Translation tab only) */}
//         {tab === "Translation" && (
//           <div className="border-b dark:border-neutral-800">
//             <button
//               onClick={() => setReadingOpen((p) => !p)}
//               className="flex items-center justify-between w-full px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all"
//             >
//               <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
//                 <BookOpen className="w-4 h-4" />
//                 Reading Settings
//               </div>
//               {readingOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
//             </button>
//             {readingOpen && (
//               <div className="px-4 pb-4 text-sm text-gray-500 dark:text-gray-400">
//                 Reading settings coming soon.
//               </div>
//             )}
//           </div>
//         )}

//         {/* Change Mushaf */}
//         <div className="border-b dark:border-neutral-800">
//           <button
//             onClick={() => setMushafOpen((p) => !p)}
//             className="flex items-center justify-between w-full px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all"
//           >
//             <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
//               <span className="w-5 h-5 rounded bg-green-600 text-white text-xs flex items-center justify-center font-bold">T</span>
//               Change Mushaf
//             </div>
//             {mushafOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
//           </button>

//           {mushafOpen && (
//             <div className="px-4 pb-4 space-y-4">
//               {MUSHAF_OPTIONS.map((m) => (
//                 <div key={m.id}>
//                   <button
//                     onClick={() => setMushaf(m.id)}
//                     className="flex items-center gap-3 w-full cursor-pointer mb-2"
//                   >
//                     <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
//                       ${mushaf === m.id ? "border-green-600" : "border-gray-300 dark:border-neutral-600"}`}
//                     >
//                       {mushaf === m.id && <div className="w-2 h-2 rounded-full bg-green-600" />}
//                     </div>
//                     <span className={`text-sm ${mushaf === m.id ? "text-green-700 dark:text-green-400 font-medium" : "text-gray-700 dark:text-gray-300"}`}>
//                       {m.label}
//                     </span>
//                   </button>

//                   {/* Preview box */}
//                   <div className="ml-7 border dark:border-neutral-700 rounded-lg p-3 bg-gray-50 dark:bg-neutral-800 text-right">
//                     <p
//                       className="text-xs text-gray-500 dark:text-gray-400 leading-loose"
//                       dir="rtl"
//                       style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
//                     >
//                       {m.preview}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Font Settings */}
//         <div className="border-b dark:border-neutral-800">
//           <button
//             onClick={() => setFontOpen((p) => !p)}
//             className="flex items-center justify-between w-full px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all"
//           >
//             <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
//               <span className="w-5 h-5 rounded bg-green-600 text-white text-xs flex items-center justify-center font-bold">T</span>
//               Font Settings
//             </div>
//             {fontOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
//           </button>

//           {fontOpen && (
//             <div className="px-4 pb-4 space-y-5">
//               {/* Arabic Font Size */}
//               <div>
//                 <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
//                   <span>Arabic Font Size</span>
//                   <span className="font-medium text-gray-700 dark:text-gray-300">{arabicSize}</span>
//                 </div>
//                 <input
//                   type="range" min={16} max={60} value={arabicSize}
//                   onChange={(e) => setArabicSize(Number(e.target.value))}
//                   className="w-full accent-green-600 cursor-pointer"
//                 />
//               </div>

//               {/* Translation Font Size */}
//               <div>
//                 <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
//                   <span>Translation Font Size</span>
//                   <span className="font-medium text-gray-700 dark:text-gray-300">{translationSize}</span>
//                 </div>
//                 <input
//                   type="range" min={12} max={40} value={translationSize}
//                   onChange={(e) => setTranslationSize(Number(e.target.value))}
//                   className="w-full accent-green-600 cursor-pointer"
//                 />
//               </div>

//               {/* Arabic Font Face */}
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Arabic Font Face</p>
//                 <div className="relative">
//                   <select
//                     value={arabicFont}
//                     onChange={(e) => setArabicFont(e.target.value)}
//                     className="w-full border dark:border-neutral-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-green-500"
//                   >
//                     {ARABIC_FONTS.map((f) => (
//                       <option key={f} value={f}>{f}</option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Support Us card */}
//         <div className="m-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-4">
//           <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
//             Help spread the knowledge of Islam
//           </p>
//           <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
//             Your regular support helps us reach our religious brothers and sisters with the message of Islam.
//           </p>
//           <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-xl transition-all cursor-pointer">
//             Support Us
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }
import React from 'react'

export default function RightPanel() {
  return (
    <div>RightPanel</div>
  )
}
