import { useToast } from "@/hooks/use-toast";
import { useGetProfileQuery } from "@/redux/userauth";
import { useCreatesessionMutation, useVerifyPaymentMutation } from "@/storertk/razorpayrtk";
import { useNavigate } from "react-router-dom";

export const Orderbutton = ({ courseid, cartid,paymentstatus}) => {
  const [createsession] = useCreatesessionMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: userData } = useGetProfileQuery();

  // Step 1: Create the session for the order
  const handleOrder = async () => {
    try {
      // Call API to create the payment session
      const res = await createsession({
        courseid: courseid,
        cartid: cartid,
      }).unwrap();

      // Step 2: Load PayPal SDK dynamically if it's not already loaded
      if (!window.paypal) {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=AduzWNfepOEli3MtXBIX1l9TxccVRUxKDoIzmYiMJwwxnAX6EAGlPMb2W8CoBEvZQPSJihCaUg7vzCHw&components=buttons`;
        script.onload = () => renderPayPalButton(res.order.result.id);
        document.body.appendChild(script);
      } else {
        renderPayPalButton(res.order.result.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create payment session",
      });
    }
  };

  // Step 3: Render PayPal button dynamically
  const renderPayPalButton = (orderID) => {
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return orderID; // Use server-generated PayPal order ID
      },
      onApprove: async (data, actions) => {
        try {
          const verifyPayload = {
            paypal_order_id: data.orderID,
            paypal_payment_id: data.paymentID || null,
          };
          await verifyPayment(verifyPayload).unwrap();
          toast({
            title: "Success",
            description: "Payment completed and verified",
          });
          setTimeout(()=>{
          if (userData?.user.role === "student") {
            navigate('/student/getorders');
          } else if (userData?.role === "creator") {
            navigate('/creator/getordercre');
          }
        },1000)

        
             // ✅ Payment success — now call refetch from parent
          if(paymentstatus){
            paymentstatus(); // <-- tells the cart to refresh
          }
        
        } catch (error) {
          toast({
            title: "Payment Failed",
            description: error?.message || "Verification error",
          });
        }
      },
      onError: (err) => {
        toast({
          title: "PayPal Error",
          description: err.message || "Something went wrong with PayPal.",
        });
      }
    }).render("#paypal-button-container"); // Renders the PayPal button inside the container
  };

  return (
    <div>
      <button onClick={handleOrder} className="bg-blue-600 text-white px-4 py-2 rounded">
        Buy now
      </button>
      <div id="paypal-button-container"></div> {/* PayPal button container */}
    </div>
  );
};
