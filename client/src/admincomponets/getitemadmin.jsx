
import { useDeleteCourseMutation, useGetcourseQuery } from "@/redux/admincourse";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";


export function GetProductAdmin() {
    const { data, isLoading, error,refetch } = useGetcourseQuery();
    const [deleteCourse] = useDeleteCourseMutation();
    const { toast } = useToast();
    const navigate = useNavigate();

    const deletecourse = async (id) => {
        try {
            const response = await deleteCourse(id).unwrap();
            toast({
                title: "Success",
                description: "Course deleted successfully",
            });
            refetch();
            return response;
        } catch (error) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to delete course",
            });
        }
    };

    if (isLoading) {
        return <p className="text-center text-lg font-semibold">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error in getting courses: {error.message}</p>;
    }

    if (!data || !Array.isArray(data.course) || data.course.length === 0) {
        return <p className="text-center text-gray-500">No courses are available</p>;
    }

    return (
        <div className="bg-amber-100 min-h-screen py-10">
            <div className="mx-auto max-w-7xl px-6 sm:px-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Available Courses</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {data.course.map((course) => (
                        <div key={course._id} className="bg-white shadow-lg rounded-lg overflow-hidden 
                        transition-transform transform hover:scale-105">
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
                                        onClick={() => navigate(`/admin/admincourse/${course._id}`)}
                                    >
                                        Details
                                    </Button>
                                    <Button 
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                                        onClick={() => deletecourse(course._id)}
                                    >
                                        Delete
                                    </Button>
                                    
                                  
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}