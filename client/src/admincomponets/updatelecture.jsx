import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUpdateLectureMutation } from "@/redux/lecturecrud";
import { Imageupload } from "./imageupload";

export function Updatelecform({ lecdata }) {
  const { courseId } = useParams();
  const { toast } = useToast();
  const [updateLecture] = useUpdateLectureMutation();

  const firstLecture = lecdata[0];

  // Initialize useForm with defaultValues
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: firstLecture?.title || "",
      vedioUrl: firstLecture?.vedioUrl?.url || "",
      duration: firstLecture?.duration || "",
      order: firstLecture?.order || "",
    },
  });

  // Dynamically update form values once firstLecture is available
  useEffect(() => {
    if (firstLecture) {
      reset({
        title: firstLecture?.title || "",
        vedioUrl: firstLecture?.vedioUrl?.url || "",
        duration: firstLecture?.duration || "",
        order: firstLecture?.order || "",
      });
    }
  }, [firstLecture, reset]);

  const onSubmit = async (data) => {
    const inputdata = {
      title: data.title,
      vedioUrl: { url: data.vedioUrl }, // backend expects vedioUrl object
      duration: data.duration,
      order: data.order,
      courseid: courseId,
    };

    try {
      const res = await updateLecture({
        inputdata,
        lectureid: firstLecture._id,
      }).unwrap();

      toast({
        title: "Lecture Updated",
        description: res.message || "Lecture updated successfully",
      });
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Update Failed",
        description: error?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold text-center">Update Lecture</h2>

      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          className="w-full p-2 border rounded-lg"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <Imageupload
        setimageurl={(url) => setValue("vedioUrl", url)}
      />

      <div>
        <label className="block font-semibold mb-1">Video URL</label>
        <input
          type="text"
          {...register("vedioUrl", { required: "Video URL is required" })}
          className="w-full p-2 border rounded-lg"
        />
        {errors.vedioUrl && <p className="text-red-500 text-sm">{errors.vedioUrl.message}</p>}
      </div>

      <div>
        <label className="block font-semibold mb-1">Duration</label>
        <input
          type="text"
          {...register("duration", { required: "Duration is required" })}
          className="w-full p-2 border rounded-lg"
        />
        {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
      </div>

      <div>
        <label className="block font-semibold mb-1">Order</label>
        <input
          type="number"
          {...register("order", { required: "Order is required", min: 1 })}
          className="w-full p-2 border rounded-lg"
        />
        {errors.order && <p className="text-red-500 text-sm">{errors.order.message}</p>}
      </div>

      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
        Update Lecture
      </Button>
    </form>
  );
}
