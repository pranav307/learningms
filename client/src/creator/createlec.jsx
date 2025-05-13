import { Imageupload } from "@/admincomponets/imageupload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import { useCreatecretorlecMutation, useGetcretorcourseQuery } from "@/redux/creatorlecture"
import { useForm } from "react-hook-form";



export function Creatorlecture(){
    const {data,isLoading} = useGetcretorcourseQuery();
    const [createcretorlec,isloading] =useCreatecretorlecMutation();
    const {toast} =useToast();
    const form = useForm({
        defaultValues:{
           vedioUrl:"",
           title:"",
           order:"",
           duration:"",
           courseid:"",
        },
  }  );

  const onSubmit = async(data)=>{
   try {
     const response = await createcretorlec(data).unwrap();
     toast({
        title:response.success,description:"lecture created succcesfully"
     })

      // ✅ Reset the entire form after successful creation
    form.reset({
      vedioUrl: "",
      title: "",
      order: "",
      duration: "",
      courseid: "",
    });
      console.log("eee",response);
      return response?.lecture;
   } catch (error) {
     console.log("iifg",error);
   }
  }
  if(isLoading){
    return (<p>......isloaing</p>)
  }
  return (
    <div className="sm:bg-amber-50 p-12 min-h-screen m-4 ">
        <div className="">
            <div className="p-4 text-center text-2xl"> 
                <h1 className="font-extrabold"> Create Lecture</h1>
            </div>
            <Imageupload setimageurl={(url)=>form.setValue("videoUrl",url)}></Imageupload>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
             <FormField
             name="vedioUrl"
             control ={form.control}
             render={({field})=>(
                <FormItem>
                  <div className="pb-2">
                    <FormLabel htmlFor="videoUrl" className="cursor-pointer hover:text-blue-200 hover:underline relative " >
                        media
                         {/* Tooltip */}
        <span className="absolute left-0 top-full mt-1 w-max bg-gray-700 text-white 
        text-xs rounded px-2 py-1 opacity-0 transition-opacity duration-300 hover:opacity-100">
          Enter the video URL here
        </span>
                    </FormLabel>
                    </div>
                    <FormControl>
                        <Input type="text" id="videoUrl" {...field} placeholder="enter videio url"></Input>
                        
                    </FormControl>
                    <FormMessage/>
                </FormItem>
  )}
             ></FormField>
               <FormField name="title"
                 control={form.control}
                 render={({field})=>(
                  <FormItem>
                    <div className="pb-2">
                 <FormLabel>lecture title</FormLabel>
                 </div>
                  <FormControl>
                    <Input type="text" {...field} placeholder="enter the title"></Input>
                  </FormControl>
                  <FormMessage/>
                  </FormItem>
                 )}
               ></FormField>
               <FormField name="order"
                 control={form.control}
                 render={({field})=>(
                  <FormItem>
                    <div className="pb-2">
                 <FormLabel>lecture number</FormLabel></div>
                  <FormControl>
                    <Input type="number" {...field} placeholder="enter the order"></Input>
                  </FormControl>
                  <FormMessage/>
                  </FormItem>
                 )}
               ></FormField>
               <FormField name="duration"
                 control={form.control}
                 render={({field})=>(
                  <FormItem>
                    <div className="pb-2">
                 <FormLabel>lecture duration</FormLabel>
                 </div>
                  <FormControl>
                    <Input type="time" {...field} ></Input>
                  </FormControl>
                  <FormMessage/>
                  </FormItem>
                 )}
               ></FormField>
               <FormField
               name="courseid"
               control={form.control}
               render={({field})=>(
                <FormItem>
                  <div className="pb-2">
                  <FormLabel >Choose course</FormLabel>
                  </div>
                  <FormControl>
                    <select {...field}>
                      <option value="">Select courses</option>
                      {isLoading ? ( <p>...isloading</p>):
                      (Array.isArray(data.courses)?(
                        data.courses.map((item)=>(
                        

                            <option key={item._id} value={item._id}>{item.courseTitle}</option>
                          
                        ))
                      ):(<option value="">no option are Available</option>))
                      }
                    </select>
                  </FormControl>
                </FormItem>
               )}
               ></FormField>
               <button type="onSubmit" className="bg-amber-200 items-center w-full p-2 mt-4 rounded-md hover:bg-blue-400">Create lecture</button>
            </form>
            </Form>
            
        </div>
    </div>
  )
}