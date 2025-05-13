import { useGetcoursebyidQuery } from "@/redux/admincourse";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Editcourseform } from "./updatecourse";
import { useState } from "react";

export function Getadminproductbyid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editupdate, seteditupdate] = useState(false);

  const { data, isLoading, error } = useGetcoursebyidQuery(id);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading course: {error.message || "Unknown error"}</p>;
  }

  if (!data || !data.course) {
    return <p>No course found.</p>;
  }

  const course = data.course;

  return (
    <div className="p-4 sm:p-16 rounded-3xl">
      {!editupdate ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md">
          <div className="flex justify-center">
            {course.Thumbnail && typeof course.Thumbnail === "string" && course.Thumbnail.match(/\.(mp4|webm|ogg|avi|mov|mkv|flv)$/) ? (
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
              <span className="block">{course.isfree ? "Free" : `$${course.coursePrice}`}</span>
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
      ) : (
        <Editcourseform courseData={course} seteditupdate={seteditupdate}/>
      )}

      {!editupdate && (
        <div className="flex justify-evenly p-4 items-center">
          <Button
            onClick={() => navigate(`/admin/lec/${course._id}`)}
            className="font-bold border-2 bg-amber-100 hover:bg-amber-400 hover:scale-105"
          >
            Lectures
          </Button>
          <Button
            onClick={() => navigate("/admin/get")}
            className="font-bold border-2 bg-amber-100 hover:bg-amber-400 hover:scale-105"
          >
            Go to More Products
          </Button>
          <Button
            onClick={() => seteditupdate(true)}
            className="font-bold border-2 bg-amber-100 hover:bg-amber-400 hover:scale-105"
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}