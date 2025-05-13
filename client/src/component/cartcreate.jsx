import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreatecartMutation, useGetcartQuery } from "@/redux/cartredux";
import { useGetorderQuery } from "@/storertk/razorpayrtk";
import { useEffect, useState } from "react";

export function Createcart({ course }) {
  const { data: cartData, refetch } = useGetcartQuery();
  const { data } = useGetorderQuery();
  const courses = data?.courses || [];

  const [createCart, { isLoading }] = useCreatecartMutation();
  const { toast } = useToast();
  const [isincart, setisincart] = useState(false);
  const [puchase, setpurchase] = useState(false);

  useEffect(() => {
    // ✅ Check if course is already in cart
    if (cartData?.cartitems) {
      const exists = cartData.cartitems.some((item) => item.course._id === course);
      setisincart(exists);
    }

    // ✅ Check if course has been purchased
    if (courses) {
      const purchases = courses.some((en) =>
        Array.isArray(en.courseId)
          ? en.courseId.some((c) => c._id === course && en.paymentStatus === "success")
          : en.courseId?._id === course && en.paymentStatus === "success"
      );
      setpurchase(purchases);
    }
  }, [cartData, course, courses]);

  const onSubmit = async () => {
    try {
      const response = await createCart({ courseid: course }).unwrap();
      toast({
        title: "Success",
        description: "Course added to cart successfully",
      });
      await refetch();
      return response;
    } catch (error) {
      toast({
        title: "Already",
        description: error?.data?.message || "Failed to add course to cart",
      });
    }
  };

  if (isLoading) {
    return <p>Loading courses...</p>;
  }

  return (
    <div>
      <div className="add-to-cart-btn">
        {puchase ? (
          <p className="font-bold">Purchased</p>
        ) : (
          <>
            {!isincart && (
              <Button
                onClick={onSubmit}
                className="font-bold bg-blue-100 p-2 rounded-2xl hover:bg-blue-400"
              >
                Add Cart
              </Button>
            )}
            {isincart && <p className="font-bold">Already in Cart</p>}
          </>
        )}
      </div>
    </div>
  );
}
