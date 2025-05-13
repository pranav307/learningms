import { Button } from "@/components/ui/button";
import { useGetfreecourseQuery } from "@/redux/studentredux";
import { useGetProfileQuery } from "@/redux/userauth";
import { useNavigate } from "react-router-dom";

export function Getfreecourse() {
  const { data, isLoading } = useGetfreecourseQuery();
  const { data: userdata } = useGetProfileQuery();
  const user = userdata?.user.role || [];
  const navigate = useNavigate();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data || !data.freeCourse || data.freeCourse.length === 0) {
    return <p>No free courses available</p>;
  }

  const handleclick = (id) => {
    if (user === "student") {
      navigate(`/student/freelec/${id}`);
    }
    else if (user === "creators"){
        navigate(`/creator/freelec/${id}`)
    }
  };

  return (
    <div>
      <div>
        <h1>Courses</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {data.freeCourse.map((item) => (
          <div key={item._id}>
            {item.Thumbnail.match(/\.(mp4|webm|ogg|avi|mov|mkv|flv)$/) ? (
              <video
                src={item.Thumbnail}
                autoPlay
                controls
                className="w-full h-48 object-cover"
              ></video>
            ) : (
              <img
                src={item.Thumbnail}
                alt={item.courseTitle}
                className="w-full h-48 object-cover"
              />
            )} 
            <div className="flex ">
            <h1 className="p-2 m-2 ">{item.courseTitle}</h1>
            <Button onClick={() => handleclick(item._id)}
                className="text-center bg-blue-100 p-2 m-2
                hover:bg-blue-500
                "
                >
              View Details
            </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}