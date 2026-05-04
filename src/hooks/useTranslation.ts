// hooks/useTranslation.ts
"use client";
import { useState, useEffect } from "react";

interface VerseTranslation {
  ayah: number;
  translation: string;
  transliteration: string;
}

export function useTranslation(surahId: number | null) {
  const [translations, setTranslations] = useState<Record<number, VerseTranslation>>({});
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!surahId) return;

  // eslint-disable-next-line react-hooks/set-state-in-effect
  setLoading(true);

  fetch(`/api/quran/translation/surah/${surahId}`)
    .then((r) => r.json())
    .then((d) => {
      console.log("📦 API RAW RESPONSE:", d); // 👈 full response

      console.log("📖 VERSES:", d.verses); // 👈 verses only

      // Optional: log each ayah
      Object.values(d.verses ?? {}).forEach((v: any) => {
        console.log("Ayah:", v.ayah);
        console.log("Translation:", v.translation);
      });

      setTranslations(d.verses ?? {});
    })
    .catch((err) => {
      console.error("❌ Translation API error:", err);
    })
    .finally(() => setLoading(false));
}, [surahId]);

  return { translations, loading };
}