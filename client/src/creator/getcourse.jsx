import { Editcourseform } from "@/admincomponets/updatecourse";
import { useGetcoursebycreatorQuery } from "@/redux/admincourse";
import { useNavigate } from "react-router-dom";
import { useState } from "react"; // ✅ You forgot to import useState
import { Button } from "@/components/ui/button"; // ✅ Add this if using Button

export function Getcrecourse() {
    const { data, isLoading, error } = useGetcoursebycreatorQuery();
    const [editupdate, seteditupdate] = useState(false);
    const navigate = useNavigate();

    if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error loading courses</p>;

    const coursesList = data?.courses || [];
    console.log("www", data.courses);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-6 text-center text-blue-600">Creator Courses</h1>
            {coursesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {coursesList.map((course) => (
                        <div
                            key={course._id}
                            className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105"
                        >
                            {course.Thumbnail.match(/\.(mp4|webm|ogg|avi|mov|mkv|flv)$/) ? (
                                <video
                                    src={course.Thumbnail}
                                    autoPlay
                                    controls
                                    className="w-full h-48 object-cover"
                                ></video>
                            ) : (
                                <img
                                    src={course.Thumbnail}
                                    alt={course.courseTitle}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h2 className="text-lg font-bold text-gray-800">{course.courseTitle}</h2>
                            </div>
                            
                                

                                {!editupdate ? (
                                    <div className="flex justify-evenly m-2">
                                    <Button
                                        onClick={() => seteditupdate(true)}
                                        className="font-bold border-2 bg-amber-100 hover:bg-amber-400 hover:scale-105"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                    onClick={() => navigate(`/creator/crelec/${course._id}`)}
                                    className="bg-blue-100 hover:bg-blue-300 font-semibold"
                                >
                                    Details
                                </Button>
                                    </div>
                                ) : (
                                    <Editcourseform courseData={course} seteditupdate={seteditupdate} />
                                )}
                            
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No courses found.</p>
            )}
        </div>
    );
}
