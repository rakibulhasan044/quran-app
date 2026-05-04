// app/api/quran/surah/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await fetch(
      `https://api.quran.com/api/v4/verses/by_chapter/${id}?per_page=286&words=true&word_fields=text_uthmani,translation,audio_url&translation_language=en&translations=131&fields=page_number,juz_number,text_uthmani,verse_number,translations`,
      { next: { revalidate: 86400 }, headers: { Accept: "application/json" } }
    );
    if (!res.ok) return NextResponse.json({ error: `API error: ${res.status}` }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}