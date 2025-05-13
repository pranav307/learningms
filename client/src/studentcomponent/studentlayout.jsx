import {  Outlet, useLocation } from "react-router-dom";
import {  Desktopstu, Sidebars } from "./navbar";
import { useState } from "react";
import { FileBox, Menu } from "lucide-react";
import { GetProduct } from "@/admincomponets/getproduct";
import { CourseFilter } from "@/storertk/courseFilter";
import { SearchBar } from "@/storertk/searchbar";






export function Studentlayout(){
    const [op,setop] = useState(false);
     const location = useLocation();
    const isHome = location.pathname === '/student';
    const [ops, setops] = useState(false);
    return (
        <div className="flex h-screen bg-gradient-to-bl from-violet-300 to-blue-100">
            {/* Sidebar & Navbar Container */}
            <div className="sm:w-64 w-auto">
                {/* Mobile Sidebar Button */}
                <button className="sm:hidden p-2" onClick={() => setops(true)}>
                    <Menu size={24} />
                </button>
                <Sidebars open={ops} setopen={setops} />
            </div>

            {/* Main Content Wrapper */}
            <div className="flex flex-col flex-grow h-screen">
                {/* Desktop Navbar */}
                <Desktopstu />
                <div className="flex items-center justify-evenly">
                  <div className={`hidden sm:block`}>
               <CourseFilter isOpen={true} setIsopen={setop} />
               </div>  
                <button onClick={()=> setop(true)} className="sm:hidden"> <FileBox size={30}/></button>
               {/* Conditional sidebar drawer for mobile */}
               {op && <div className="block sm:hidden fixed top-0 left-0 w-64 h-full  shadow-md">
                <CourseFilter isOpen={op} setIsopen={setop}/>
                <button onClick={()=> setop(false)} className="absolute top-2 right-2 text-black"> X</button>
               </div> }
               
              <div className="flex"> <SearchBar/> 
              </div>
               </div>
                {/* Main Content Area */}
                <main className="flex-grow p-4 bg-gray-100 overflow-auto">
                    {isHome && <GetProduct/>}
                    <Outlet />
                   
                </main>
              
            </div>
        </div>
    );
}
