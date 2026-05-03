import SideNavbar from "@/components/shared/SideNavbar";

export default function Home() {
  return (
    <div className="flex gap-4 w-full">
      <div className="w-15 flex items-center justify-center">
        <SideNavbar />
      </div>
      <div className="grid grid-cols-5 flex-1">
        <div className="col-span-1 text-center border-2">left</div>
        <div className="col-span-3 text-center border-2">middle</div>
        <div className="col-span-1 text-center border-2">right</div>
      </div>
    </div>
  );
}
