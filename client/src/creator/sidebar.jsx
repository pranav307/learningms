import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChartNoAxesCombined, CodeSquareIcon, LayoutDashboard, BookOpenIcon, Database } from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

const sidebaritem = [
  { id: "profile", label: "Profile", path: "creprofile", icon: <LayoutDashboard /> },
  { id: "course-cre", label: "Course Create", path: "creatorcor", icon: <CodeSquareIcon /> },
  { id: "getcourse", label: "Get CreCourses", path: "getcrecourse", icon: <BookOpenIcon /> },
  { id: "createlec", label: "Lecture", path: "creatorlecture", icon: <ChartNoAxesCombined /> },
  {id:"createquize",label:"create Quize",path:"createquize",icon:<Database/>},
];

function Sidebar({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {sidebaritem.map((items) => (
        <div key={items.id}
          onClick={() => { 
            navigate(items.path);
            if (setOpen) setOpen(false);
          }}
          className="flex items-center gap-2 cursor-pointer text-xl p-2 hover:bg-gray-200 rounded-md"
        >
          {items.icon}
          <span>{items.label}</span>
        </div>
      ))}
    </nav>
  );
}

export function Creatorsidebar({ open, setOpen }) {
  const navigate = useNavigate();
  return (
    <Fragment>
      {/* ✅ Mobile Sidebar (Drawer) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 z-[60] bg-white shadow-md">
          <SheetHeader className="border-b p-4">
            <SheetTitle className="flex gap-2 items-center">
              <ChartNoAxesCombined size={30} />
              <h1 className="text-2xl font-extrabold">Creator</h1>
            </SheetTitle>
          </SheetHeader>
          <Sidebar setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      {/* ✅ Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-white shadow-md p-4">
        <div onClick={() => navigate('/creator')} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-200 rounded-md">
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extralight">Creator Panel</h1>
        </div>
        <Sidebar setOpen={setOpen} />
      </aside>
    </Fragment>
  );
}