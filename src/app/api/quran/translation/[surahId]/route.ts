// app/api/quran/translation/surah/[surahId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import data from "@/data/data.json";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ surahId: string }> }
) {
  const { surahId } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chapters = (data as any).chapters;
  const chapter = chapters[surahId];
  if (!chapter) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const verses: Record<number, { ayah: number; translation: string; transliteration: string }> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.entries(chapter.verses).forEach(([ayahId, verse]: [string, any]) => {
    verses[Number(ayahId)] = {
      ayah: Number(ayahId),
      translation: verse.translation_eng,
      transliteration: verse.transliteration,
    };
  });

  return NextResponse.json({ surah_name: chapter.surah_name, verses });
}