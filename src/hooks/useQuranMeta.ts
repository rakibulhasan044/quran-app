// hooks/useQuranMeta.ts
"use client";
import { useState, useEffect } from "react";

export interface Chapter {
  id: number;
  name_simple: string;        // "Al-Fatihah"
  translated_name: { name: string }; // "The Opener"
  name_arabic: string;        // "الفاتحة"
  verses_count: number;
  revelation_place: string;   // "makkah" | "madinah"
}

export interface Juz {
  id: number;
  juz_number: number;
  verse_mapping: Record<string, string>; // { "1": "1-7", "2": "1-141" }
  first_verse_id: number;
  last_verse_id: number;
  verses_count: number;
}

export function useChapters() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quran/chapters")
      .then((r) => r.json())
      .then((d) => setChapters(d.chapters ?? []))
      .finally(() => setLoading(false));
  }, []);

  return { chapters, loading };
}

export function useJuzs() {
  const [juzs, setJuzs] = useState<Juz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quran/juzs")
      .then((r) => r.json())
      .then((d) => setJuzs(d.juzs ?? []))
      .finally(() => setLoading(false));
  }, []);

  return { juzs, loading };
}