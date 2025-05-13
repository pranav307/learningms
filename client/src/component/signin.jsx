import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSignInMutation } from "@/redux/userauth";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";



export default function SignInForm(){


 const {toast} =useToast();
 const navigate= useNavigate();
 
 const [signIn,{isLoading,error}] =useSignInMutation();
 const form =useForm({defaultValues:{
    email:"",
    password:"",
 }})

 const onSubmit = async(data)=>{
    try {
        const response= await signIn(data).unwrap();
        //const token= JSON.parse(localStorage.getItem("token"));
        //console.log("tokemm",token)
        console.log("Token from response:", response.token);
        toast({
            title:response.success,description:response.message,
        })
        if(response.user?.role === "admin"){
            navigate('/admin')
        }
        else if(response.user?.role === "creators"){
            navigate("/creator");
        }
        else {
            navigate("/student")
        }
        
    } catch (error) {
        console.error("error in signin",error);
        toast({
            title:"signin failed",description:error.data?.message ||"errorrrr",
        })
    }
 }
 return(
    <div className="flex  items-center justify-center bg-gray-200 min-h-screen ">
        <div className="bg-white rounded-2xl p-16 w-full max-w-md">
            <h1 className=" text-2xl  font-bold text-center mb-6"> Sign In</h1>
            <h2 className="font-bold text-center"> If Not <Link className="text-cyan-300" to="/">SignUp</Link></h2>
            <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                name="email"
                control={form.control}
                render={({field})=>(
                    <FormItem>
                        <FormLabel className="font-bold">Email</FormLabel>
                        <Input type="email" {...field} placeholder="enter the email" className="w-full px-4 py-6 border-gray-400 focus:ring-2 focus:ring-blue-300"></Input>
                        <FormMessage/>
                    </FormItem>
                )}
                >

                </FormField>
                <FormField
                name="password"
                control={form.control}
                render={({field})=>(
                    <FormItem>
                        <FormLabel className="font-bold">Password</FormLabel>
                        <Input type="password" {...field} placeholder="enter password" className="w-full px-4 py-6 border-gray-400 focus:ring-2 focus:ring-blue-300"></Input>
                        <FormMessage/>
                    </FormItem>
                )}
                >

                </FormField>
                <Button type="submit" className="w-full bg-blue-600 text-2xl text-center focus:ring-2 border-2 border-gray-400 hover:bg-cyan-400 px-4 py-6 rounded-2xl">SignIn</Button>
             </form>

            </Form>
        </div>
    </div>
 )
}
