import { useGetcoursebyidQuery } from "@/redux/admincourse";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetProfileQuery } from "@/redux/userauth";
import { useGetorderQuery } from "@/storertk/razorpayrtk";
import { useToast } from "@/hooks/use-toast";

export function Getproductbyid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetcoursebyidQuery(id);
  const { data: userData } = useGetProfileQuery();
  const { data: orderData } = useGetorderQuery();
  const orders = orderData?.courses || [];
  const { toast } = useToast();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading course</p>;
  }

  if (!data || !data.course) {
    return <p>No course found.</p>;
  }

  const course = data.course;
  const users = userData?.user;

  // ✅ Corrected purchase check
  const isPurchased = orders.some((order) =>
    Array.isArray(order.courseId)
      ? order.courseId.some((c) => c._id === course._id)
      : order.courseId?._id === course._id
  );

  const handleLectureClick = () => {
    if (isPurchased) {
      if (users?.role === "creators") {
        navigate(`/creator/purchaselec/${course._id}`);
      } else if (users?.role === "student") {
        navigate(`/student/purchaselec/${course._id}`);
      }
    } else {
      toast({ title: "You are not allowed to view this lecture without purchase" });
    }
  };

  return (
    <div className="p-4 sm:p-16 rounded-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md">
        <div className="flex justify-center">
          {course.Thumbnail && course.Thumbnail.match(/\.(mp4|webm|ogg|avi|mov|mkv|flv)$/) ? (
            <video
              src={course.Thumbnail}
              autoPlay
              controls
              className="w-full min-h-screen object-cover"
            ></video>
          ) : (
            <img
              src={course.Thumbnail}
              alt={course.courseTitle}
              className="w-full min-h-screen object-cover"
            />
          )}
        </div>
        <div className="bg-amber-100 p-8">
          <h1 className="font-bold text-2xl mb-4">
            <span className="block">Course Title:</span>
            <span className="block">{course.courseTitle}</span>
          </h1>
          <p className="mb-4">
            <span className="font-bold text-xl">Description:</span>
            <span className="block">{course.description}</span>
          </p>
          <p className="mb-4">
            <span className="font-bold text-xl">Course Price:</span>
            <span className="block">{course.coursePrice}</span>
          </p>
          <p className="mb-4">
            <span className="font-bold text-xl">Category:</span>
            <span className="block">{course.category}</span>
          </p>
          <p>
            <span className="font-bold text-xl">Course Level:</span>
            <span className="block">{course.courseLevel}</span>
          </p>
        </div>
      </div>
      <div className="flex justify-evenly p-4 items-center">
        <Button
          onClick={handleLectureClick}
          className="font-bold border-2 bg-amber-100 hover:bg-amber-400 hover:scale-105"
        >
          Lectures
        </Button>
        <Button
          onClick={() => {
            if (users.role === "creators") {
              navigate("/creator/getpro");
            } else if (users.role === "student") {
              navigate("/student/getproducts");
            }
          }}
          className="font-bold border-2 bg-amber-100 hover:bg-amber-400 hover:scale-105"
        >
          Go to More Products
        </Button>
      </div>
    </div>
  );
}
