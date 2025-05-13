import { cartModel } from "../model/cartiems.js";
import { courseModel } from "../model/course.js";
import { Enrolled } from "../model/enrolledstu.js";
import Razorpay from "razorpay"
import dotenv from "dotenv"
import crypto from "crypto"

 dotenv.config()
 const razorpay =  new Razorpay({
    key_id:process.env.rezaorpay_id,
    key_secret:process.env.razorpay_secret
 })
export const getOrders= async(req,res)=>{
    const userid = req.user._id;
    const courses = await Enrolled.findById({userId:userid}).populate("courseId").populate("userId");
    return res.status(200).json({courses})

}
export const createsesion=async(req,res)=>{
    const {courseid,cartid} = req.body;
    const userid= req.user._id;
    let coursetobuy=[]
    if(courseid){
        const course = await courseModel.findOne({_id:courseid})
        if (course){
        coursetobuy.push(course)
        }
    }
   else if(cartid){
    const cartitem = await cartModel.findOne({_id:cartid})
    if(cartitem){
        const course= await courseModel.findOne({_id:cartitem.course})
        coursetobuy.push(course)
    }
   }
   
   else {
      const cartitem = await cartModel.findOne({user:userid})
      if(cartitem){
        const course = await courseModel.findOne({_id:cartitem.course})
        coursetobuy.push(course)
      }
   }
   console.log("seelcted courses",coursetobuy)
   let courseforpay =[]
   for (order in coursetobuy){
    const createorder = await Enrolled.create({
        userId:userid,
        courseId:order._id,
        paymentStatus:"pending",
        orderStatus:"proccessing",
        price:order.coursePrice,
        title:order.courseTitle
    })
    courseforpay.push(createorder)
   }
   console.log("order created", courseforpay)
   const totalAmount = coursetobuy.reduce((sum,course)=>sum + course.coursePrice,0) * 100

    const razorpayorder = await razorpay.orders.create({
        amount:totalAmount,
        currency:"inr",
        receipt:courseforpay.map((order)=> order._id).join(","), //store multiple order id if any
        notes:{
            userid:userid.toString(),
            courses:coursetobuy.map((item=>
            ({
                id:item._id,
                title:item.courseTitle
            }
            )
            ))
        }
    }) 
    if (!razorpayorder) {
        return res.status(401).json({ message: "Error creating Razorpay order" });
      }
    return res.status(201).json({
        order:razorpayorder,
        key_id:process.env.rezaorpay_id,
    })
}

// Razorpay Webhook Handler
// export const razorpayWebhook = async (req, res) => {
//     const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
//     const signature = req.headers["x-razorpay-signature"];
//     const body = JSON.stringify(req.body);
  
//     const expectedSignature = crypto.createHmac('sha256', secret)
//       .update(body)
//       .digest('hex');
  
//     if (signature !== expectedSignature) {
//       return res.status(400).json({ message: "Invalid signature" });
//     }
  
//     const event = req.body;
  
//     if (event.event === "payment.captured") {
//       const { notes, amount } = event.payload.payment.entity;
//       const receipt = event.payload.payment.entity.order_id;
  
//       // receipt was the Enrolled order IDs
//       const enrolledOrderIds = receipt.split(",");
  
//       for (let orderId of enrolledOrderIds) {
//         const order = await Enrolled.findById(orderId);
//         if (order) {
//           order.paymentStatus = "success";
//           order.orderStatus = "completed";
//           order.price = amount / 100; // Convert from paise to rupees
//           await order.save();
//         }
//       }
//       return res.status(200).json({ message: "Payment captured and orders updated" });
//     }
  
//     return res.status(200).json({ received: true });
//   };


export const verifypayment=async(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
      // Signature verification
      const body= razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto.createHmac("sha256",process.env.razorpay_secret).
      update(body.toString()).digest("hex")

    if(expectedSignature!=razorpay_signature){
        return res.status(400).json({ message: "Payment verification failed" });
    }

    try {
         // Step 2: Fetch order from Razorpay to get amount and notes
        const razorpayorder = await razorpay.orders.fetch(razorpay_order_id);
        const enrolledorderIdsString = razorpayorder.receipt; // You earlier saved enrolled IDs in receipt
        const enrolledorderIds = enrolledorderIdsString.split(",");
         // Step 3: Capture payment manually
         const payment = await razorpay.payments.capture(
            razorpay_payment_id,
            razorpayorder.amount // Capture with original order amount

         )

         //  // Step 4: Update enrolled orders
         for(let orderIDs of enrolledorderIds){
            const order = await Enrolled.findById(orderIDs)
            order.paymentStatus == "success",
            order.orderStatus == "completed",
            order.price == payment.amount/100 //convert paise into inr
           await  order.save()
         }
         res.status(200).json({ message: "Payment verified, captured and orders updated", payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", error });
    }

}