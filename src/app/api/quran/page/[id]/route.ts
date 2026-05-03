// app/api/quran/page/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await fetch(
      `https://api.quran.com/api/v4/verses/by_page/${id}?per_page=50&words=true&word_fields=text_indopak,translation,audio_url&translation_language=bn&fields=page_number,juz_number,text_indopak,verse_number`,
      { next: { revalidate: 86400 }, headers: { Accept: "application/json" } }
    );
    if (!res.ok) return NextResponse.json({ error: `API error: ${res.status}` }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}