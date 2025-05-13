import { Link, Outlet, useLocation } from "react-router-dom";
import { AdminNavbar, AdminSidebar} from "./adminnav";
import { useState } from "react";
import { FilterIcon, Menu, ProjectorIcon } from "lucide-react";
import { CourseFilter } from "@/storertk/courseFilter";
import { SearchBar } from "@/storertk/searchbar";

import { GetProductAdmin } from "./getitemadmin";
export function Adminlayout(){
    const [open,setopen] =useState(false);
  const [isops, setop] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/admin';
  
  return (
      <div className={isHome ? "bg-blue-200 min-h-screen" :"min-h-screen"}>
          <div className="flex justify-around items-center bg-blue-300 px-6 py-4">
              <div className="flex justify-between sm:gap-10 gap-4">

                <div className="block sm:hidden justify-end
                   items-center">
                    <button onClick={()=> setopen(true)}><Menu size={24}/></button>
                    <AdminSidebar open={open} setOpen={setopen} /></div>
                  <div>
                      <button onClick={() => setop(true)}>
                          <FilterIcon size={24}/>
                      </button>
                      <CourseFilter isOpen={isops} setIsopen={setop} />
                  </div>
                  <div>
                      <Link to='adminpro'><ProjectorIcon/></Link>
                  </div>
             
              <div className="overflow-hidden block sm:hidden flex-1/2 "><SearchBar/></div>
              </div>
              <div className="  hidden flex-1 sm:flex ">
                  <SearchBar/>
              </div>
              <div className="hidden flex-1 sm:flex justify-end">
                  <AdminNavbar/>
              </div>
          </div>

          {/* ✅  GetProduct from here */}
          {isHome && <GetProductAdmin/>}

          <div className="mt-4">
              <Outlet/>  {/* ✅ Only render content based on the route */}
          </div>
      </div>
  );
}
