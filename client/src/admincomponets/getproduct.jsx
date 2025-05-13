import { useGetcourseQuery } from "@/redux/admincourse";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Createcart } from "@/component/cartcreate";
import { useGetProfileQuery } from "@/redux/userauth";


export function GetProduct() {
    const { data: courseData, isLoading, error } = useGetcourseQuery(); // Ensuring course data is separate
    const { data: userData } = useGetProfileQuery(); // Ensuring user data is separate
    const navigate = useNavigate();

    if (isLoading) {
        return <p className="text-center text-lg font-semibold">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error in getting courses: {error.message}</p>;
    }

    if (!courseData || !Array.isArray(courseData.course) || courseData.course.length === 0) {
        return <p className="text-center text-gray-500">No courses are available</p>;
    }

    const user = userData?.user; // Extracting user information safely

    return (
        <div className="bg-amber-100 min-h-screen py-10">
            <div className="mx-auto max-w-7xl px-6 sm:px-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Available Courses</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {courseData.course.map((course) => (
                        <div key={course._id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                            {course.Thumbnail && course.Thumbnail.match(/\.(mp4|webm|ogg|avi|mov|mkv|flv)$/) ? (
                                <video src={course.Thumbnail} autoPlay controls className="w-full h-48 object-cover"></video>
                            ) : (
                                <img src={course.Thumbnail} alt={course.courseTitle} className="w-full h-48 object-cover" />
                            )}

                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800">{course.courseTitle}</h2>
                                <p className="text-sm text-gray-600">Category: {course.category}</p>
                                <div className="flex justify-between items-center mt-4">
                                    {course.isfree ? (
                                        <span className="text-lg font-bold text-gray-900">Free</span>
                                    ) : (
                                        <span className="text-lg font-bold text-gray-900">${course.coursePrice}</span>
                                    )}

                                    <Button
                                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg"
                                        onClick={() => {
                                            if(course.isfree){
                                                if (user?.role === "student") {
                                                    console.log("Navigating to student course page");
                                                    navigate(`/student/getfreecoursebyid/${course._id}`);
                                                } else if (user?.role === "creators") {
                                                    console.log("Navigating to creator course page");
                                                    navigate(`/creator/getfreecoursebyidcre/${course._id}`);
                                            }
                                        }
                                            else if(course.coursePrice){
                                            if (user?.role === "student") {
                                                console.log("Navigating to student course page");
                                                navigate(`/student/getproductidstu/${course._id}`);
                                            } else if (user?.role === "creators") {
                                                console.log("Navigating to creator course page");
                                                navigate(`/creator/getproductidcre/${course._id}`);
                                            }}
                                        }}
                                    >
                                        Details
                                    </Button>

                                    <span>
                                        <Createcart course={course._id} />
                                    </span>
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
