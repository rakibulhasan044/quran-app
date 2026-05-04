// src/app/api/quran/translation/surah/[surahId]/route.ts
import { NextRequest, NextResponse } from "next/server";

interface Verse {
  chapter: number;
  verse: number;
  text: string;
}

type Data = Record<string, Verse[]>;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ surahId: string }> }
) {
  try {
    const { surahId } = await params;
    const data = await import("@/data/data.json").then(
      (m) => m.default as Data
    );

    const chapterVerses = data[surahId];

    if (!chapterVerses) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const verses: Record<
      number,
      { ayah: number; translation: string }
    > = {};

    chapterVerses.forEach((verse: Verse) => {
      verses[verse.verse] = {
        ayah: verse.verse,
        translation: verse.text,
      };
    });

    return NextResponse.json({
      surah_number: Number(surahId),
      verses,
    });
  } catch (err) {
    console.error("Translation route error:", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}