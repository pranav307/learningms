import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Import Input component
import { useToast } from "@/hooks/use-toast";
import { useVerifycodeMutation } from "@/redux/userauth";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export function Verifycode() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { username } = useParams();
    const form = useForm({
        defaultValues: {
            code: "", // Ensure the input field is always controlled
        },
    });
    const [verifycode, { isLoading, error }] = useVerifycodeMutation();

    const onSubmit = async (data) => {
        try {
            const response = await verifycode({ username, code: data.code }).unwrap();
            toast({ title: "Success", description: response?.data?.message || "Verification successful" });
            navigate('/signin');
        } catch (error) {
            console.error("Error in code verification", error);
            toast({
                title: "Error",
                description: error?.message || "An error occurred during verification",
            });
        }
    };

    return (
        <div className="flex text-center justify-center bg-gray-100 min-h-screen">
            <div className="p-16 rounded-2xl bg-white w-full max-w-md shadow-lg">
                <h1 className="text-2xl font-bold">{username} Enter the Code</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <Input {...field} placeholder="Enter code" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="text-center bg-cyan-300 hover:bg-blue-600 rounded-lg">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}