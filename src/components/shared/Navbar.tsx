"use client";

import Link from "next/link";
import { Search, Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  const { dark, toggle } = useDarkMode();

  return (
    <div className="w-full border-b px-4 py-3 flex items-center justify-between">

      {/* Left: Logo */}
      <Link href="/" className="text-lg font-semibold">
        Quran Mazid
      </Link>

      {/* Right: Menu */}
      <NavigationMenu>
        <NavigationMenuList className="flex items-center gap-2">

          {/* Search */}
          <NavigationMenuItem>
            <NavigationMenuLink
              render={
                <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800">
                  <Search className="w-5 h-5" />
                </button>
              }
            />
          </NavigationMenuItem>

          {/* Theme Toggle */}
          <NavigationMenuItem>
            <NavigationMenuLink
              render={
                <button
                  onClick={toggle}
                  className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  {dark ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              }
            />
          </NavigationMenuItem>

          {/* Support Us */}
          <NavigationMenuItem>
            <NavigationMenuLink
              render={
                <button className="px-4 py-2 rounded-md text-white bg-green-800 text-sm font-medium">
                  Support Us
                </button>
              }
            />
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}