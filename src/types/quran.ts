// types/quran.ts
export interface Verse {
  id: number;
  verse_key: string;
  verse_number: number;
  chapter_id: number;
  page_number: number;
  juz_number: number;
  text_indopak: string;
}


export interface QuranResponse {
  verses: Verse[];
  meta: {
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
    total_count: number;
  };
}