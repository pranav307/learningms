import {ChartNoAxesCombined, CreativeCommons, DatabaseIcon, GalleryThumbnails, Heading4, Home, OctagonIcon, Wand} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";


const navbar=[
    {
       id:"admin",
       path:"/admin",
       label:"Home",
         icon:<Home/>
    },
    {
        id:"course",
        path:"course",
        label:"Createcourse",
        icon:<CreativeCommons/>

    },
    {
        id:"Get",
        path:"get",
        label:"GetCourse",
        icon:<GalleryThumbnails/>

    },
    {
        id:"lec",
        path:"createlec",
        label:"Create Lec",
        icon:<Wand/>

    },
    {
      id:"quize",
      path:"adminquize",
      label:"create quize",
      icon:<DatabaseIcon/>

    },
    {
       id:"puchase",
       path:"getallorders",
       label:"Orders",
       icon:<OctagonIcon/>
    },
    
   
];

  function Sidebar({ setOpen }) {
    const navigate = useNavigate();
  
    return (
      <nav className="mt-8 flex flex-col gap-2">
        {navbar.map((items) => (
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
  export function AdminSidebar({ open, setOpen }) {
   // const navigate = useNavigate();
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

        </Fragment>
    )
} 
export function AdminNavbar(){
  const navigate = useNavigate();

  return (
    <nav className="flex justify-around

     items-center w-full gap-4">

      {navbar.map((item)=>(
        <div key={item.id}
        onClick={()=> navigate(item.path)}
        >
           <span>{item.icon}</span>
          <span>{item.label}</span>
         
        </div>
      ))}
    </nav>
  )

}