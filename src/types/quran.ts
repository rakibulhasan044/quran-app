// types/quran.ts
export interface Word {
  id: number;
  position: number;
  text_indopak: string;
  audio_url: string | null;
  translation: {
    text: string;
    language_name: string;
  };
  audio?: { url: string };
  char_type_name: string; // "word" | "end" | "pause"
}
export interface VerseTranslation {
  id: number;
  text: string;
  language_name: string;
  resource_id: number;
}

export interface Verse {
  id: number;
  verse_key: string;
  verse_number: number;
  chapter_id: number;
  page_number: number;
  juz_number: number;
  text_indopak: string;
  words: Word[];
  translations?: VerseTranslation[];
}

export interface QuranResponse {
  verses: Verse[];
  meta: {
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_count: number;
  };
}