import { Createcart } from "@/component/cartcreate";
import { Button } from "@/components/ui/button";
import { useGetSearchQuery } from "@/redux/filterrtk";
import { useGetProfileQuery } from "@/redux/userauth";
import { ArrowBigLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export const SearchResult = () => {
    const { query } = useParams(); // Get the search query from the URL
      const navigate = useNavigate();
       const { data:userData } = useGetProfileQuery();
       console.log("user",userData)
    // Fetch search results using RTK Query
    const { data, isLoading, error } = useGetSearchQuery(
        query ? { query, page: 1, limit: 5 } : {},
        { skip: !query }
    );
    console.log("Query received:", query);
    console.log("Search results:", data.searchResult);


    return (
        <>
        <Button onClick={()=>{
           if (userData?.user.role === "student") {
                        navigate('/student');
                      } else if (userData?.user.role === "creators") {
                        navigate('/creator');
                      } else if (userData?.user.role === "admin") {
                        navigate('/admin');
                      }
        }} 
        
        
        className="bg-lime-300 p-3 m-2"><ArrowBigLeft size={30}/></Button>
        <div className="flex flex-col items-center">
           
            <h1 className="font-bold flex gap-2 mt-2 text-2xl text-center">Search results for<h1 className="font-extrabold">"{query}"</h1> </h1>
                  
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error fetching results</p>}
             <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-10 p-12 ">
            {data?.searchResult?.length > 0 ? (
                data.searchResult.map((item) => (
                    <div key={item._id} className="bg-gray-50 p-4 hover:scale-105 rounded-2xl">
                       {item.Thumbnail && item.Thumbnail.match(/\.(mp4|webm|ogg|avi|mov|mkv|flv)$/) ? (
    <video src={item.Thumbnail} autoPlay controls className="w-full h-74 object-cover rounded-2xl"></video>
) : (
    <img src={item.Thumbnail} alt={item.courseTitle} className="w-full h-74 object-cover rounded-2xl" />
)} 
                        <p className="font-extrabold mt-6">{item.courseTitle}</p>
                        <p className="font-bold p-4">{item.category}</p>
                        <div className="flex justify-between">
                        <div>
                         <button
                            className="bg-blue-200 hover:bg-blue-500 
                            rounded-2xl text-xl p-2 font-bold border border-red-500"
                            onClick={() => {
                      if (userData?.user.role === "student") {
                        navigate(`/student/getproductidstu/${item._id}`);
                      } else if (userData?.user.role === "creators") {
                        navigate(`/creator/getproductidcre/${item._id}`);
                      } else if (userData?.user.role === "admin") {
                        navigate(`/admin/admincourse/${item._id}`);
                      }
                    }}
                  >
                    Details
                  </button>
                  </div>
                  <div className="">

                    <Createcart course={item._id}></Createcart>
                  </div>
                  </div>
                    </div>
                ))
            ) : (
                <p>No courses found</p>
            )}
            </div>
        </div>
        </>
    );
};
