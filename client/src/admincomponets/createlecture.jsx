import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCreatelecMutation } from "@/redux/lecturecrud";
import { useForm } from "react-hook-form";
import { Imageupload } from "./imageupload";
import { useGetcourseQuery } from "@/redux/admincourse";


export function Createlec() {
    const { data:course, isLoading: isloadingcoourses } = useGetcourseQuery();
    const [createlec, { isLoading, error }] = useCreatelecMutation();
    
    const { toast } = useToast();

    const form = useForm({
        defaultValues: {
            vedioUrl: "",
            title: "",
            duration: "",
            order: "",
            courseid: "",
        },
    }); 
   

    const onSubmit = async (data) => {
        try {
            const response = await createlec(data).unwrap();
            toast({ title: "Success", description: "Lecture created successfully" });
            console.log("resssss",response)
            return response?.lecture;
        } catch (error) {
            toast({ title: "Error", description: "Error in creation" });
        }
    };
    console.log("Fetched courses:", course);
  
    return (
        <div className="flex justify-center min-h-screen  ">
            <div className=" sm:w-2xl w-80 overflow-hidden  sm:m-4 border-2 p-8 mt-6 rounded-md ">
                <h1 className="font-extrabold">Create Lecture</h1>
            
            
            

            {/* Pass form.setValue to Imageupload to update the videoUrl */}
            <Imageupload setimageurl={(url) => form.setValue("vedioUrl", url)} />
           
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="vedioUrl"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-extrabold">Add Video</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} placeholder="Enter the video URL"
                                    className="p-2 m-2"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="title"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-extrabold">Lecture Title</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter the title"
                                    className="p-2 m-2"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="duration"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Add Duration of Lecture</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} 
                                    className="p-2 m-2"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="order"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Video Position</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} placeholder="Enter position"
                                    className="p-2 m-2"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="courseid"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-extrabold">Add Course</FormLabel>
                                <FormControl>
                                    <select {...field} className="p-2 m-2">
                                        <option value="">Select course</option>
                                        {isloadingcoourses ? (
                                            <option>Loading...</option>
                                        ) : ( Array.isArray(course?.course)?
                                          (course.course?.map((course) => (
                                                <option key={course._id} value={course._id}>
                                                    {course.courseTitle}
                                                </option>) )):
                                                (<option>no option Available</option>)
                                 
                                        )}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <button type="submit" disabled={isLoading} className="sm:w-full w-50 items-center border-2 p-2
                     bg-blue-300 hover:bg-blue-50 m-4 rounded-md">
                        {isLoading ? "Creating..." : "Create Lecture"}
                    </button>
                </form>
            </Form>
           
            </div>
            
        </div>
    );
}