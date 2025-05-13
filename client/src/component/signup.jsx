import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRegisteruserMutation } from "@/redux/userauth";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Select } from "@/components/ui/select";

export default function SignUpForm() {
  const { toast } = useToast();
  const router = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisteruserMutation();
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role:"",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data).unwrap();
      toast({ title: "Success", description: response.message });
      router(`/verifyemail/${data.username}`);
    } catch (error) {
      console.error("Error in registering user");
      toast({
        title: "Registration failed",
        description: error.data?.message || "Error in registering",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex  items-center justify-center   bg-gray-100 ">
      <div className="bg-white p-16 rounded-2xl  w-full max-w-md shadow-lg ">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Create an Account</h1> 
         <h2 className="font-bold text-center"> if already then<Link to="/signin" className="text-blue-300">signin</Link></h2>
        

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Username</FormLabel>
                  <Input {...field} placeholder="Enter your username" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <Input type="email" {...field} placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            
  <FormField
  name="role"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-gray-700">Role</FormLabel>
      <select
        {...field}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a role</option>
        <option value="admin">Admin</option>
        <option value="creators">Creator</option>
        <option value="student">Student</option>
      </select>
      <FormMessage />
    </FormItem>
  )}
/>


            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <Input type="password" {...field} placeholder="Enter your password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50">
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
