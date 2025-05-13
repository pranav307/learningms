import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CarTaxiFront, ChevronUpSquareIcon, Home, PilcrowLeftIcon, ProjectorIcon, Vault } from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";



const navbar =[
    {
        id:"student",
        path:"/student",
        label:"Student",
        icon:<Home/>
    },
    {
        id:"freecourse",
        path:"freestu",
        label:"Free",
        icon:<ChevronUpSquareIcon/>
    },
    {
        id:"getcart",
        path:"getitem",
        label:"Cart",
        icon:<CarTaxiFront/>
    },
    {
        id:"orders",
        path:"getorders",
        label:"purchase",
        icon:<ProjectorIcon/>
    },
    {
        id:"profile",
        path:"stuprofile",
        label:"profile",
        icon:<PilcrowLeftIcon/>
    }
];

 function Menus({setopen}){
    const navigate =useNavigate();
    return (
        <div>
            {navbar.map((item)=>(
                <div key={item.id} 
               onClick={()=>{navigate(item.path)

                if(setopen) setopen(false)
               }}
               
              >
                <div className="flex m-4 sm:m-2 sm:gap-1 hover:bg-blue-200 hover:rounded-md sm:mt-6 font-bold">
               <span className="  text-2xl ">{item.icon}</span>
               <span className="w-xl  text-center text-xl sm:w-52 " >{item.label}</span>
               </div>
</div>
))}
        </div>
    )
}

export function Sidebars({open, setopen}){
    const navigate = useNavigate();
    return (
        <Fragment>
            {/* Mobile Sidebar */}
            <div className="sm:hidden">
                <Sheet open={open} onOpenChange={setopen}>
                    <SheetContent side="left" className="bg-white p-3 w-64 shadow-sm">
                        <SheetHeader className="border-b p-4">
                            <SheetTitle>
                                <h1 className="text-sm font-semibold">Student</h1>
                            </SheetTitle>
                            <CarTaxiFront size={30} />
                        </SheetHeader>
                        <Menus setopen={setopen} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden sm:flex flex-col  min-h-screen w-64 shadow-md p-4 ">
                <div className="flex items-center p-2 gap-2 cursor-pointer hover:bg-blue-100 rounded-sm" onClick={() => navigate('/student')}>
                    <Vault className="size-10" />
                    <h1 className="text-sm font-semibold">Student</h1>
                </div>
                <Menus setopen={null} />
            </aside>
        </Fragment>
    );
}

export function Desktopstu(){
    const navigate = useNavigate();
    return (
        <div className="hidden sm:flex w-full h-16 bg-gradient-to-r from-fuchsia-300 to-cyan-100 shadow-md">
            {navbar.map((items) => (
                <div key={items.id}
                    onClick={() => navigate(items.path)}
                    className="flex justify-center items-center w-full p-3 hover:bg-blue-200 cursor-pointer rounded-md transition">
                    <span className="mr-2">{items.icon}</span>
                    <span className="text-sm font-medium">{items.label}</span>
                </div>
            ))}
        </div>
    );
}
