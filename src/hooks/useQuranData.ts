// hooks/useQuranData.ts
"use client";
import { useState, useEffect } from "react";
import type { Verse, QuranResponse } from "@/types/quran";

type Mode = "Surah" | "Juz" | "Page";

export function useQuranData(mode: Mode, id: number) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    setVerses([]);

    const endpoint =
      mode === "Surah" ? `/api/quran/surah/${id}`
      : mode === "Juz" ? `/api/quran/juz/${id}`
      :                  `/api/quran/page/${id}`;

    fetch(endpoint)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.text();
          throw new Error(`${r.status}: ${body}`);
        }
        return r.json();
      })
      .then((data: QuranResponse & { error?: string }) => {
        if (data.error) throw new Error(data.error);
        if (!data.verses || data.verses.length === 0) throw new Error("No verses returned");
        setVerses(data.verses);
      })
      .catch((err) => {
        console.error("useQuranData error:", err);
        setError(err.message ?? "Failed to load");
      })
      .finally(() => setLoading(false));
  }, [mode, id]);

  return { verses, loading, error };
}