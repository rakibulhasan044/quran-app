import { ToggleOptions } from "@/components/modules/Chapter/ToggleOptions";
import { Navbar } from "@/components/shared/Navbar";
import SideNavbar from "@/components/shared/SideNavbar";

export default function Home() {
  return (
    <div className="flex gap-4 w-full">
      <div className="w-15 flex items-center justify-center">
        <SideNavbar />
      </div>
      <div className="flex-1">
        <div>
          <Navbar />
        </div>
        <div className="grid grid-cols-5 h-full">
          <div className="col-span-1 w-full border">
            <ToggleOptions />
          </div>
          <div className="col-span-3 text-center border">middle</div>
          <div className="col-span-1 text-center border">right</div>
        </div>
      </div>
    </div>
  );
}
