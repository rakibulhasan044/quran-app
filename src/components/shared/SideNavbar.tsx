import {
  BookmarkCheck,
  BookOpen,
  CircleEllipsisIcon,
  Grid2X2Plus,
  HomeIcon,
  LucideNavigation,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: HomeIcon, label: "Home" },
  { icon: CircleEllipsisIcon, label: "Read Quran" },
  { icon: LucideNavigation, label: "Go to Ayah" },
  { icon: BookmarkCheck, label: "Bookmarks" },
  { icon: Grid2X2Plus, label: "Others" },
];

export default function SideNavbar() {
  return (
    <>
      {/* ── DESKTOP: vertical left sidebar ── */}
      <div className="hidden md:flex flex-col h-screen items-center w-14">
        {/* Logo */}
        <div className="py-3">
          <div className="p-1 rounded-md bg-[#428039]">
            <BookOpen className="text-white w-5 h-5" />
          </div>
        </div>

        {/* Nav icons */}
        <div className="flex flex-col flex-1 justify-center items-center gap-6">
          {navItems.map(({ icon: Icon, label }) => (
            <Tooltip key={label}>
              <TooltipTrigger>
                <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors">
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* ── MOBILE: bottom navigation bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t dark:border-neutral-800 flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{label}</span>
          </button>
        ))}
      </div>
    </>
  );
}