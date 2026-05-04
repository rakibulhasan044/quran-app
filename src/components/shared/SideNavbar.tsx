import {
  BookmarkCheck,
  BookOpen,
  CircleEllipsisIcon,
  Grid2X2Plus,
  HomeIcon,
  LucideNavigation,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SideNavbar() {
  return (
    <div className="flex flex-col h-screen items-center">
      {/* Top icon */}
      <div className="py-3">
        <div className="p-1 rounded-md bg-[#428039]">
          <BookOpen className="text-white" />
        </div>
      </div>

      {/* Middle icons */}
      <div className="flex flex-col flex-1 justify-center items-center gap-6">
        <Tooltip>
          <TooltipTrigger>
            <div className="p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <HomeIcon />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Home</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <div className="p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <CircleEllipsisIcon />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Read Quran</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <div className="p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <LucideNavigation />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Go to Ayah</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <div className="p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <BookmarkCheck />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Bookmarks</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <div className="p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <Grid2X2Plus />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Others</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
