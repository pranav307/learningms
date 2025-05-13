import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCreatecourseMutation } from "@/redux/admincourse";
import { useForm } from "react-hook-form";
import { Imageupload } from "./imageupload";
import { useState } from "react";


export const Coursecreate = () => {
    const [free, setFree] = useState(false);
    const form = useForm({
        defaultValues: {
            courseTitle: "",
            category: "",
            description: "",
            courseLevel: "",
            coursePrice: "",
            Thumbnail: "",
            isfree: false,
        },
    });

    const [createcourse, { isLoading }] = useCreatecourseMutation();
    const { toast } = useToast();

    const onSubmit = async (data) => {
        if (data.isfree) {
            delete data.coursePrice;
        }
        try {
            const response = await createcourse(data).unwrap();
            toast({ title: "Course Creation", description: "Course created successfully" });
            console.log("dataaaa", response);
            form.reset();
        } catch (error) {
            toast({ title: "Error in Creation", description: error.data?.message || "Something went wrong" });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className=" w-xs sm:w-2xl bg-gray-50 p-8 border-2 rounded-md overflow-hidden">
                <h1 className="font-extrabold">Create Course</h1>
                <Form {...form}>
                    <div className="mb-4">
                        <Imageupload setimageurl={(url) => form.setValue("Thumbnail", url)} className="p-2" />
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                name="Thumbnail"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Thumbnail</FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field} placeholder="Thumbnail" className="m-2" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="courseTitle"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-extrabold">Course Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="m-2" placeholder="Enter the course title" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Description</FormLabel>
                                        <FormControl>
                                            <textarea {...field} placeholder="Enter the description" className="p-2 h-24 w-full" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="category"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-extrabold">Category</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="p-2 m-2" placeholder="Enter the course category" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="coursePrice"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-extrabold">Course Price</FormLabel>
                                        <FormControl>
                                            <Input disabled={free} type="number" {...field} className="p-2 m-2" placeholder="Enter the course price" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="courseLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Course Level</FormLabel>
                                        <FormControl>
                                            <select {...field} className="p-2 m-2">
                                                <option value="">Select Level</option>
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="isfree"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-extrabold">Check for Free Course</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e.target.checked);
                                                    setFree(e.target.checked);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="text-2xl w-full m-2 text-center border bg-blue-100 p-4 hover:bg-blue-200"
                            >
                                {isLoading ? "Creating..." : "Create"}
                            </Button>
                        </div>
                    </form>
                </Form>
               
            </div>
        </div>
    );
};
