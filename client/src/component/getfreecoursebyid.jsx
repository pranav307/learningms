import { useGetcoursebyidQuery } from "@/redux/admincourse";
import { useGetProfileQuery } from "@/redux/userauth";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";

const GetFreeCourseById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetcoursebyidQuery(id);
  const { data: userData } = useGetProfileQuery();

  if (isLoading || !data || !userData) {
    return <p>Course loading...</p>;
  }

  const course = data.course;
  const users = userData?.user;

  const handleClick = () => {
    if (users.role === "student") {
      navigate(`/student/freelec/${course._id}`);
    } else if (users.role === "creators") {
      navigate(`/creator/freelec/${course._id}`);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-hidden">
        {course?.Thumbnail?.match(/\.(mp4|webm|ogg|avi|mov|mkv|flv)$/) ? (
          <video
            src={course.Thumbnail}
            autoPlay
            controls
            className="bg-amber-500 m-4"
          />
        ) : (
          <img src={course.Thumbnail} alt="course thumbnail" />
        )}

        <div className="bg-amber-600 p-4 m-4">
          <h1>{course.courseTitle}</h1>
          <p>
            <span className="font-bold">Description: </span>
            {course.description}
          </p>
          <h2>
            <span className="font-bold">CourseLevel: </span>
            {course.courseLevel}
          </h2>
          <h2>
            <span className="font-bold">Category: </span>
            {course.category}
          </h2>
        </div>
      </div>

      {course.isfree ? (
  <div className="flex justify-center my-4">
    <button
      onClick={handleClick}
      className="w-xl bg-blue-300 px-6 py-2 rounded"
    >
      Lectures
    </button>
  </div>
      ) : (
        <p>You are not allowed to see this lecture without purchase</p>
      )}

     
    </div>
  );
};

export default GetFreeCourseById;
