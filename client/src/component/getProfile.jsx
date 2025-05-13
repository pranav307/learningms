import { Imageupload } from "@/admincomponets/imageupload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { userLogOut } from "@/redux/authslice";
import { useCreatephotoMutation, useGetProfileQuery } from "@/redux/userauth";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export function GetProfile() {
  const dispatch = useDispatch();
  const { data, isLoading, error, refetch } = useGetProfileQuery(); // refetch added
  const [createphoto] = useCreatephotoMutation();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      photourl: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await createphoto(data).unwrap();
      toast({
        title: "Success",
        description: res.message,
      });
      await refetch(); // refetch profile after successful upload
    } catch (err) {
      toast({
        title: "Error",
        description: err?.data?.message || "Upload failed",
        variant: "destructive",
      });
    }
  };

  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!data || !data.user) return <p>No profile data available</p>;

  const { user } = data;

  return (
    <div className="flex items-center justify-center mt-6">
      <div>
        {/* Only show form if photourl is not set */}
        {!user.photourl && (
          <Form {...form}>
            <div>
              <Imageupload
                setimageurl={(url) => form.setValue("photourl", url)}
                className="p-2"
              />
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="photourl"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Photo</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Photo URL"
                        className="m-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="font-bold p-2 bg-blue-300 hover:bg-blue-600"
              >
                Upload
              </Button>
            </form>
          </Form>
        )}

        {/* Show photo if photourl exists */}
        {user.photourl ? (
          <img
            src={user.photourl}
            alt={`${user.username}'s profile`}
            className="w-32 h-32 rounded-full mt-2"
          />
        ) : (
          <h1>No profile photo</h1>
        )}

        <h1 className="font-extrabold">{user.username}</h1>
        <p className="font-bold">Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <Button onClick={()=> dispatch(userLogOut())} className="text-2xl bg-blue-200 m-2 hover:bg-blue-500">LogOut</Button>
      </div>
    </div>
  );
}
