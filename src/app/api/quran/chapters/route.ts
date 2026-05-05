import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.quran.com/api/v4/chapters?language=en",
      { next: { revalidate: 86400 }, headers: { "Accept": "application/json" } }
    );
    if (!res.ok) return NextResponse.json({ error: `API error: ${res.status}` }, { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}