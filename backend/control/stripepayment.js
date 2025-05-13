import { cartModel } from "../model/cartiems.js";
import { courseModel } from "../model/course.js";
import { Enrolled } from "../model/enrolledstu.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import { json } from "express";
dotenv.config();
const stripe = new Stripe();
export const getOrders=async(req,res)=>{
  const userid=req.user._id;
  const order =await Enrolled.find({userId:userid}).populate("user").populate("courseId");
  return res.status(201).json({order});
}
export const CreateSession= async(req,res)=>{
 const {courseid,cartid} =req.body;
 const userid = req.user._id;
 let coursetoBuy=[];
 if(courseid){
const courses = await courseModel.findOne({_id:courseid});
if(courses){
coursetoBuy.push(courses);
}
 }
//course to buy selectedd in cart
//  else if (Array.isArray(cartid) && cartid.length > 0) {
//   const cartItems = await cartModel.find({ _id: { $in: cartid }, user: userid });

//   for (let item of cartItems) {
//     const course = await courseModel.findById(item.course);
//     if (course) coursetoBuy.push(course);
//   }

//   if (coursetoBuy.length === 0) {
//     return res.status(200).json({ message: "No valid courses found in selected cart items" });
//   }
// }

 else if(cartid){
const cartitem= await cartModel.findOne({_id:cartid});

 if(!cartitem){
  return res.status(200).json({message:"no course available to these id"});
 }
 const coursescart = await courseModel.findOne({_id:cartitem.course});
 if(coursescart){
 coursetoBuy.push(coursescart);
 }
 }
else {
const cartiems = await cartModel.find({user:userid});
for(item of cartiems){
  const courseallcart = await courseModel.find({_id:item.course});
  if(courseallcart){
    coursetoBuy.push(courseallcart);
  }
}

}
console.log("oooff",coursetoBuy);
let createOrderforpay = [];
for (order of coursetoBuy){
const createorder = await Enrolled.create({
  userId:userid, courseId:order._id,paymentStatus:"pending",
  orderStatus:"proccessing",price:order.coursePrice,title:order.courseTitle,
})
createOrderforpay.push(createorder);
}
console.log("our orserss",createOrderforpay);
const lineItems = createLIneItem(coursetoBuy);
const session= await stripe.checkout.sessions.create({
    payment_method_type:[ paymentType || "card"],
    line_items:lineItems,
    mode:"payment",
    success_url:`${process.env.Frontend_url}/order/status`,
    cancel_url:`${process.env.Frontend_url}/order/cancel`,
    metadata:{orderId:createOrderforpay._id.toString(),images:json.Stringfy(coursetoBuy.map((item)=>(
      item.Thumbnail,item._id,item.courseTitle
    )))}

})
if(!session.url){return res.status(401).json({message:"errror in creating session"})};
await createOrderforpay.save();
return res.status(201).json({session});

}

//webhook for atomatic payment confirmation
export const stripeWebhook =async(req,res)=>{
  let event;
  const signature = req.Headers["stripe-signture"];
  const payloadString = json.Stringfy(req.body,null,2);
  const secret=process.env.Webhook_secret;
  /*const header = stripe.webhooks.generateTestHeaderString({
    payload:payloadString,signature,secret
  }); */
//if i replace signture with header it will became test payment
  event = stripe.webhooks.constructEvent(payloadString,signature,secret);
if(event.type === "Checkout.session.completed"){
  try {
    const session =event.data.object;
    const order = await Enrolled.findById(session.metadata?.orderId);
    if(!order){
      return res.status(404).json({message:"order not found"});

    }

    if(session.amount_total) order.price = session.amount_total;
    order.orderStatus = "completed";
    order.paymentStatus="success";
    await order.save();
    return res.status(200).json({order});
  } catch (error) {
    console.log(error)
  }
}
}
const createLIneItem = (coursetoBuy) => {
  return coursetoBuy.map(course => ({
      price_data: {
          currency: "inr",
          product_data: {
              name: course.courseTitle,
              category: course.category,
              images: [course.Thumbnail]
          },
          unit_amount: course.coursePrice * 100
      },
      quantity: 1
  }));
};


