import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { HomeIcon, ShoppingBasketIcon, Projector, TableProperties } from "lucide-react";
import { useNavigate } from "react-router-dom";

const creatorbar = [
  { id: "creator", path: "/creator", label: "Home", icon: <HomeIcon /> },
 
  { id:"pro", path:"creprofile", label:"Profile", icon:<Projector/> },
  {id :"get",path:'getitem',label:"Cart",icon:<TableProperties/>},
  {id:"order",path:'getordercre',label:"Purchase",icon:<ShoppingBasketIcon/>},
];

export function Navbar({ setopen }) {
  const navigate = useNavigate();

  return (
    <nav className="flex flex-col gap-2">
      {creatorbar.map((item) => (
        <div key={item.id}
          onClick={() => {
            navigate(item.path);
            setopen(false);
          }}
          className="flex items-center gap-2 cursor-pointer text-lg p-2 hover:bg-gray-200 rounded-md"
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </nav>
  );
}

export function Rightsidebar({ open, setopen }) {
  return (
    <Sheet open={open} onOpenChange={setopen}>
      <SheetContent side="right" className=" fixed inset-0 w-80 max-w-full min-h-screen z-[60] bg-white shadow-lg p-4 transition-transform duration-300">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex gap-2 items-center">
            <h1 className="text-2xl font-extrabold">Creates</h1>
          </SheetTitle>
        </SheetHeader>
        <Navbar setopen={setopen} />
      </SheetContent>
    </Sheet>
  );
}

export function Desktopbar() {
  const navigate = useNavigate();
  return (
    <div className="hidden lg:flex bg-gray-100 shadow-md p-4 justify-evenly">
      {creatorbar.map((item) => (
        <div key={item.id}
          onClick={() => navigate(item.path)}
          className="flex items-center gap-2 cursor-pointer text-lg p-2 hover:bg-gray-200 rounded-md"
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}