// app/api/quran/translation/[surahId]/[ayahId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import data from "@/data/data.json";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ surahId: string; ayahId: string }> }
) {
  const { surahId, ayahId } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chapters = (data as any).chapters;
  const chapter = chapters[surahId];
  if (!chapter) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const verse = chapter.verses[ayahId];
  if (!verse) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    surah_name: chapter.surah_name,
    translation: verse.translation_eng,
    transliteration: verse.transliteration,
  });
}