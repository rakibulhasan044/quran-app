"use client";
import { Search, Sun, Moon, Settings, Menu } from "lucide-react";
import Link from "next/link";
import { useDarkMode } from "@/hooks/useDarkMode";

interface NavbarProps {
  onOpenSettings?: () => void;
  onOpenMenu?: () => void;
}

export function Navbar({ onOpenSettings, onOpenMenu }: NavbarProps) {
  const { dark, toggle } = useDarkMode();

  return (
    <div className="w-full border-b dark:border-neutral-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
      {/* Left: hamburger (mobile) + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMenu}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <Link href="/" className="flex flex-col">
          <span className="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight">
            Quran Mazid
          </span>
          <span className="text-xs text-gray-400 hidden sm:block">
            Read, Study, and Learn The Quran
          </span>
        </Link>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
          <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <button
          onClick={toggle}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {dark ? (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {/* Settings — tablet/mobile only */}
        <button
          onClick={onOpenSettings}
          className="xl:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <button className="hidden md:flex items-center gap-2 ml-2 px-4 py-2 rounded-lg text-white bg-green-700 hover:bg-green-800 text-sm font-medium transition-colors">
          Support Us 🤍
        </button>
      </div>
    </div>
  );
}
