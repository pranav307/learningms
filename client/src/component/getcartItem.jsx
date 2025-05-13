import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Orderbutton } from "@/payment/checkout";
import { useGetcartQuery, useRemoveitemMutation } from "@/redux/cartredux";
import { useGetProfileQuery } from "@/redux/userauth";
import { useNavigate } from "react-router-dom";

export function GetCartItem() {
  const { data: userData } = useGetProfileQuery();
  const { data, isLoading, error, refetch } = useGetcartQuery(undefined, {
    refetchOnMountOrArgChange: true, // Refetches every time the component mounts
  });
  const [removeItem] = useRemoveitemMutation();
  const { toast } = useToast();
  const navigate = useNavigate();
  

  console.log("User Data:", userData);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const remove = async (id) => {
    try {
      const response = await removeItem(id).unwrap();
      toast({
        title: "Success",
        description: "Deleted successfully",
      });
      return response.message;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete item",
      });
    }
  };

  const items = data?.cartitems || [];
  console.log("Cart Items:", items);

  const goToDetails = (courseId) => {
    if (userData?.user.role === "student") {
      navigate(`/student/getproductidstu/${courseId}`);
    } else if (userData?.user.role === "creators") {
      navigate(`/creator/getproductidcre/${courseId}`);
    } else {
      toast({
        title: "Error",
        description: "Invalid user role",
      });
    }
  };

  return (
    <div className="p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Cart Items</h1>
        {Array.isArray(items) && items.length > 0 ? (
          items.map((carts) => (
            <div key={carts._id} className="mb-4 p-4 border rounded-md">
              {carts.course.Thumbnail.match(/\.(mp4|webm|ogg|avi|mov|mkv|flv)$/) ? (
                                <video
                                    src={carts.course.Thumbnail}
                                    autoPlay
                                    controls
                                    className="w-full h-48 object-cover"
                                ></video>
                            ) :(
              <img
                src={carts.course.Thumbnail}
                alt={carts.course.courseTitle}
                className="w-full h-48 object-cover mb-2"
              />
                            )
                          }
              <h1 className="text-lg font-semibold">{carts.course.courseTitle}</h1>
              <div className="flex gap-4 mt-2">
                <Button onClick={() => remove(carts._id)} className="bg-red-500 text-white">
                  Remove
                </Button>
                <Button
                  onClick={() => {
                    console.log("Navigating to details");
                    goToDetails(carts.course._id);
                  }}
                  className="bg-blue-500 text-white"
                >
                  Details
                </Button>
                <Orderbutton
                  courseid={carts.course._id}
                  cartid={carts._id}
                  paymentstatus={refetch}
                />
              </div>
            </div>
          ))
        ) : (
          <div>
            <p>No items in the cart.</p>
            {error && <p className="text-red-500">{error.message || "Error fetching cart items"}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

