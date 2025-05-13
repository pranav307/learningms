import { useGetfilterQuery } from "@/redux/filterrtk";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "./filterslice";
import { useGetProfileQuery } from "@/redux/userauth";
import { useNavigate } from "react-router-dom";
import { Createcart } from "@/component/cartcreate";


export const FilterCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { filter, currentpage, limit } = useSelector((state) => state.filters);

  const { data, isLoading, error } = useGetfilterQuery({
    filter,
    page: currentpage,
    limit,
  });
  const { data: userData } = useGetProfileQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching courses: {error.message || "An unknown error occurred."}</p>;
  }

  const { course = [], totalpages = 1 } = data || {};
  const currentPage = currentpage || 1;

  return (
    <div className="">
      <div className="">
        {course.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
            {course.map((item) => (
              <div key={item._id} className="bg-gray-50 p-2 mt-6 m-4 hover:bg-gray-100 hover:scale-105">
                {item.Thumbnail.match(/\.(mp4|webm|ogg|avi|mov|mkv|flv)$/) ? (
                  <video src={item.Thumbnail} autoPlay controls></video>
                ) : (
                  <img src={item.Thumbnail} alt={item.courseTitle}></img>
                )}
                <h1 className="p-2  text-xl font-bold">{item.courseTitle}</h1>
                <div className="flex justify-between">
                <h className="p-4 text-green-1000 font-bold">${item.coursePrice}</h>

                <button className="bg-blue-200 hover:bg-blue-500 rounded-2xl text-xl p-2 font-bold"
                  onClick={() => {
                    if (userData?.user.role === "student") {
                      navigate(`/student/getproductidstu/${item._id}`);
                    } else if (userData?.user.role === "creators") {
                      navigate(`/creator/getproductidcre/${item._id}`);
                    }
                    else if(userData?.user.role === "admin"){
                      navigate(`/admin/admincourse/${item._id}`)
                    }
                  }}
                >
                  Details
                </button>
                
                <div className="">
                  <Createcart course={item._id}></Createcart>
                 </div>
                </div>
              
              </div>
               
            ))}
          </div>
        ) : (
          <p>No courses found</p>
        )}
        <div className="flex justify-center">
          <button className="bg-blue-200 hover:bg-blue-500 rounded-2xl text-xl p-2 font-bold
           w-2xl
          "
                  onClick={() => {
                    if (userData?.user.role === "student") {
                      navigate('/student/getitem');
                    } else if (userData?.user.role === "creators") {
                      navigate('/creator/getitem');
                    }
                   
                  }}
                >
                  Cart
                </button>
                </div>
      </div>

      {totalpages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage <= 1}
            onClick={() => dispatch(setPage(currentPage - 1))}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalpages}
          </span>
          <button
            disabled={currentPage >= totalpages}
            onClick={() => dispatch(setPage(currentPage + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};