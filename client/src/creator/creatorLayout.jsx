import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FileBox, Menu } from "lucide-react"; 
import { Desktopbar, Rightsidebar } from "./navbar";
import { Creatorsidebar } from "./sidebar";
import { GetProduct } from "@/admincomponets/getproduct";
import { CourseFilter } from "@/storertk/courseFilter";
import { SearchBar } from "@/storertk/searchbar";


export function CreatorLayout() {
  const [openside, setopenside] = useState(false);
  const [ops, setops] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/creator"
  const [op,setop] =useState(false);

  return (
    
    <div className="sm:flex bg-gradient-to-r from-amber-50 to-blue-150">
      <div className="
      ">
      {/* ✅ Sidebar Component */}
      <Creatorsidebar open={openside} setOpen={setopenside}  />
      </div>
      <div className="flex justify-between ml-5 mt-5">

      {/* ✅ Mobile Sidebar Toggle Button (Left) */}
      <button 
        className="block sm:hidden bg-fuchsia-900"
        onClick={() => setopenside(true)} 
      >
        <Menu size={24} />
      </button>

      {/* ✅ Right Sidebar Component */}
      <Rightsidebar open={ops} setopen={setops} />

      {/* ✅ Mobile Sidebar Toggle Button (Right) */}
      <button  
        className="block sm:hidden mr-5 bg-emerald-100"
        onClick={() => setops(true)}
      >
        <Menu size={24} />
      </button>
       </div> 
      {/* ✅ Main Content */}
      {/* <div className="w-full bg-amber-800 "> */}
        
       
       {/* Main Content Wrapper */}
                   <div className="flex flex-col flex-grow ">
                       {/* Desktop Navbar */}
                      <Desktopbar />
                       <div className="flex items-center justify-evenly">
                       <button onClick={()=> setop(true)}> <FileBox size={30}/></button>
                      <CourseFilter isOpen={op} setIsopen={setop}/>
                     
                     <div className="flex "> <SearchBar/> 
                     </div>
                      </div>
       
        <main className="m-4 ">
          <Outlet /> {/* 👇 Child routes will render here */}
          {isHome && <GetProduct/>}
      </main>
      </div>
       
      
   
      </div>
  );
}