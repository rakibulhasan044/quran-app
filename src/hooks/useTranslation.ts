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
      .then((d) => setTranslations(d.verses ?? {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [surahId]);

  return { translations, loading };
}