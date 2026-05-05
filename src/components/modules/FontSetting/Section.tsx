"use client";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MUSHAF_OPTIONS } from "./constants";

type ViewMode = "Reading" | "Translation";

export function AccordionSection({
  open, onToggle, icon, label, children,
}: {
  open: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b dark:border-neutral-800">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[#428039]">
          {icon}
          {label}
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && children}
    </div>
  );
}

export function TIcon() {
  return (
    <span className="w-5 h-5 rounded bg-[#428039] text-white text-xs flex items-center justify-center font-bold">
      T
    </span>
  );
}

// ── Reading Settings (Translation mode only)
export function ReadingSettingsSection({
  open, onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b dark:border-neutral-800">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <BookOpen className="w-4 h-4" />
          Reading Settings
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-500">
          Reading settings coming soon.
        </div>
      )}
    </div>
  );
}

// ── Change Mushaf (Reading mode only)
export function MushafSection({
  open, onToggle, mushaf, onMushafChange,
}: {
  open: boolean;
  onToggle: () => void;
  mushaf: string;
  onMushafChange: (id: string) => void;
}) {
  return (
    <AccordionSection open={open} onToggle={onToggle} icon={<TIcon />} label="Change Mushaf">
      <div className="px-4 pb-4 space-y-3">
        {MUSHAF_OPTIONS.map((m) => (
          <button
            key={m.id}
            onClick={() => onMushafChange(m.id)}
            className="flex items-center gap-3 w-full cursor-pointer"
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
              ${mushaf === m.id ? "border-[#428039]" : "border-gray-300 dark:border-neutral-600"}`}>
              {mushaf === m.id && <div className="w-2 h-2 rounded-full bg-[#428039]" />}
            </div>
            <span className={`text-sm ${mushaf === m.id
              ? "text-[#428039] font-medium"
              : "text-gray-700 dark:text-gray-300"}`}>
              {m.label}
            </span>
          </button>
        ))}
      </div>
    </AccordionSection>
  );
}

// ── Font Settings
export function FontSettingsSection({
  open, onToggle, viewMode,
  arabicFontSize, setArabicFontSize,
  translationFontSize, setTranslationFontSize,
  arabicFont, setArabicFont, arabicFonts,
}: {
  open: boolean;
  onToggle: () => void;
  viewMode: ViewMode;
  arabicFontSize: number;
  setArabicFontSize: (v: number) => void;
  translationFontSize: number;
  setTranslationFontSize: (v: number) => void;
  arabicFont: string;
  setArabicFont: (v: string) => void;
  arabicFonts: { label: string; value: string }[];
}) {
  return (
    <AccordionSection open={open} onToggle={onToggle} icon={<TIcon />} label="Font Settings">
      <div className="px-4 pb-4 space-y-5">
        {/* Arabic Font Size */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Arabic Font Size</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{arabicFontSize}</span>
          </div>
          <Slider
            value={[arabicFontSize]} min={16} max={60} step={1}
            onValueChange={(val) => setArabicFontSize(Array.isArray(val) ? val[0] : val)}
            className="accent-green-600"
          />
        </div>

        {/* Translation Font Size — Translation mode only */}
        {viewMode === "Translation" && (
          <div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>Translation Font Size</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{translationFontSize}</span>
            </div>
            <Slider
              value={[translationFontSize]} min={12} max={32} step={1}
              onValueChange={(val) => setTranslationFontSize(Array.isArray(val) ? val[0] : val)}
              className="accent-green-600"
            />
          </div>
        )}

        {/* Arabic Font Face */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Arabic Font Face</p>
          <Select value={arabicFont} onValueChange={(v) => v && setArabicFont(v)}>
            <SelectTrigger className="w-full rounded-xl text-sm dark:border-neutral-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {arabicFonts.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </AccordionSection>
  );
}

// ── Support Us card
export function SupportCard() {
  return (
    <div className="m-4 rounded-2xl bg-green-50 dark:bg-[#131C12] border border-green-100 dark:border-green-800 p-4">
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
        Help spread the knowledge of Islam
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
        Your regular support helps us reach our religious brothers and sisters with the message of Islam.
      </p>
      <button className="w-full bg-[#428039] text-white text-sm font-semibold py-2 rounded-xl transition-all cursor-pointer">
        Support Us
      </button>
    </div>
  );
}