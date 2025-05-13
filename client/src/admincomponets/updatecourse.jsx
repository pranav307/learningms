import { useToast } from "@/hooks/use-toast";
import { useUpdateCourseMutation } from "@/redux/admincourse";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Imageupload } from "./imageupload";
import { useGetProfileQuery } from "@/redux/userauth";

export function Editcourseform({ courseData, seteditupdate }) {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      courseTitle: courseData.courseTitle,
      category: courseData.category,
      description: courseData.description,
      coursePrice: courseData.coursePrice,
      isfree: courseData.isfree,
      courseLevel: courseData.courseLevel,
      Thumbnail: courseData.Thumbnail,
    },
  });

  const [updateCourse, { isLoading }] = useUpdateCourseMutation();
  const { data: userData } = useGetProfileQuery();
  const user = userData?.user || [];
  console.log("User data:", user);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isFreewatch = watch("isfree");

  useEffect(() => {
    if (isFreewatch) {
      setValue("coursePrice", " ");
    }
  }, [isFreewatch, setValue]);

  const onSubmit = async (data) => {
    try {
      const inputdata = {};

      for (const key in data) {
        if (data[key] !== courseData[key] && data[key] !== "") {
          if (key === "coursePrice") {
            inputdata[key] = parseFloat(data[key]);
          } else {
            inputdata[key] = data[key];
          }
        }
      }

      inputdata.isfree = data.isfree;

      if (!data.isfree) {
        if (
          !data.coursePrice ||
          isNaN(data.coursePrice) ||
          parseFloat(data.coursePrice) < 0
        ) {
          toast({
            title: "Validation Error",
            description:
              "Course price must be a valid number when course is not free",
          });
          return;
        }
        inputdata.coursePrice = parseFloat(data.coursePrice);
      }

      const response = await updateCourse({
        id: courseData._id,
        inputdata,
      }).unwrap();

      toast({
        title: "Success",
        description: response.message || "Course updated successfully",
      });

      // 👇 Unmount the form before navigation (important)
      if (seteditupdate) {
        seteditupdate(false);
      }

      if (user.role === "admin") {
        navigate("/admin/get");
      } else if (user.role === "creators") {
        navigate("/creator/getcrecourse");
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          error.message || "An error occurred while updating the course",
      });
    }
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md min-h-screen "
      >
        <h2 className="text-2xl font-semibold mb-4">Edit Course</h2>
        <div className="flex flex-col justify-between min-h-screen ">
          <label className="block mb-2 font-medium">Course Title</label>
          <input {...register("courseTitle")} className="input" />

          <label className="block mb-2 font-medium mt-4">Category</label>
          <input {...register("category")} className="input" />

          <label className="block mb-2 font-medium mt-4">Description</label>
          <textarea {...register("description")} className="input h-24" />

          <label className="block mb-2 font-medium mt-4">Course Level</label>
          <select {...register("courseLevel")} className="input">
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <label className="flex items-center gap-2 mt-4">
            <input type="checkbox" {...register("isfree")} />
            Free Course
          </label>

          {!isFreewatch && (
            <>
              <label className="block mb-2 font-medium mt-4">Course Price</label>
              <input
                type="number"
                {...register("coursePrice")}
                className="input"
                min="0"
              />
            </>
          )}

          <Imageupload
            setimageurl={(url) => setValue("Thumbnail", url)}
          ></Imageupload>
          <label className="block mb-2 font-medium mt-4">Thumbnail URL</label>
          <input {...register("Thumbnail")} className="input" />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            {isLoading ? "Updating..." : "Update Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
