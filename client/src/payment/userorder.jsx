import { Button } from "@/components/ui/button";
import { useGetProfileQuery } from "@/redux/userauth";
import { useGetorderQuery } from "@/storertk/razorpayrtk";
import { useNavigate } from "react-router-dom";

export const Orderscom = () => {
 const { data, isLoading, refetch } = useGetorderQuery(undefined, {
  refetchOnMountOrArgChange: true,
});
  const { data: userData } = useGetProfileQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <p>...isloading courses</p>;
  }

  console.log("all purchase course", data?.courses);

  return (
    <div>
      <div className="font-bold text-center">
        <h1>All Purchased Courses</h1>
      </div>
       
      {Array.isArray(data?.courses) && data.courses.length > 0 ? (
        data.courses.map((item) => (
          <div key={item._id}>
            {item.courseId && (
              <div key={item.courseId._id} className="">
                {/\.(mp4|webm|ogg|avi|mov|mkv|flv)$/i.test(item.courseId.Thumbnail) ? (
                  <video src={item.courseId.Thumbnail} autoPlay controls></video>
                ) : (
                  <img src={item.courseId.Thumbnail} alt="Course Thumbnail" />
                )}

                <h1 className="font-bold m-4">{item.courseId.courseTitle}</h1>
                <p className="">{item.courseId.description}</p>

                <Button
                className="font-bold bg-blue-100 p-2 m-2 w-xl hover:bg-amber-500"
                  onClick={() => { 
                    console.log("Navigating to course ID:", item.courseId._id);
                    console.log(`/student/getproductidstu/${item.courseId._id}`);
                    console.log(userData);

                    if (userData?.user.role === "student") {
                      navigate(`/student/getproductidstu/${item.courseId._id}`);
                    } else if (userData?.user.role === "creators") {
                      navigate(`/creator/getproductidcre/${item.courseId._id}`);
                    }
                  }}
                >
                  Details
                </Button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No purchases found.</p>
      )}
    </div>
  );
};
