import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';
dotenv.config();

import { Enrolled } from '../model/enrolledstu.js';
import { courseModel } from '../model/course.js';
import { cartModel } from '../model/cartiems.js';
import mongoose from 'mongoose';

// ✅ Setup PayPal environment and client using official SDK
const Environment = paypal.core.SandboxEnvironment;
const client = new paypal.core.PayPalHttpClient(
  new Environment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
);

// ✅ Destructure request classes from SDK
const { OrdersCreateRequest, OrdersCaptureRequest } = paypal.orders;

export const getAllorders = async (req, res) => {
  try {
    const users = req.user;

    if (users.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not allowed to access this resource",
      });
    }

    // Populate userId and courseId, including coursePrice
    const purchase = await Enrolled.find()
      .populate("userId", "username email role")
      .populate("courseId", "courseTitle coursePrice creator");

    return res.status(200).json({
      success: true,
      purchase,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const getOrders = async (req, res) => {
  const userid = req.user._id;
  const courses = await Enrolled.find({ userId: userid })
    .populate('courseId',
      'courseTitle description Thumbnail'

    )
    .populate('userId',
     'username' 
    );
  return res.status(200).json({ courses });
};

export const createsession = async (req, res) => {
  const { courseid, cartid } = req.body;
  const userid = req.user._id;
  let coursetobuy = [];

  // Collect courses based on provided courseid or cartid
  if (courseid) {
    const course = await courseModel.findOne({ _id: courseid });
    if (course) coursetobuy.push(course);
  } else if (cartid) {
    const cartitem = await cartModel.findOne({ _id: cartid });
    if (cartitem) {
      const course = await courseModel.findOne({ _id: cartitem.course });
      coursetobuy.push(course);
    }
  } else {
    const cartitem = await cartModel.findOne({ user: userid });
    if (cartitem) {
      const course = await courseModel.findOne({ _id: cartitem.course });
      coursetobuy.push(course);
    }
  }

  console.log("course that are buy",coursetobuy)

  const totalAmount = coursetobuy.reduce((sum, course) => { 
    const price = parseFloat(course.coursePrice);
    return sum + (isNaN(price) ? 0 : price); 
  }, 0);

  // Create an Enrolled order with the user's info
  const enrolledOrder = new Enrolled({
    userId: userid,
    courseId: coursetobuy.map(course => course._id),
    totalAmount,
    paymentStatus: 'pending', // Initially set as pending
    orderStatus: 'proccessing', // Initially set as processing
  });

  await enrolledOrder.save(); // Save the Enrolled order to the database

  // Now that the order is saved, use its _id as the reference_id in PayPal request
  const orderRequest = new OrdersCreateRequest();
  orderRequest.prefer('return=representation');
  orderRequest.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: totalAmount.toFixed(2),
        },
        description: coursetobuy.map(course => course.courseTitle).join(', '),
        reference_id: enrolledOrder._id.toString(), // Use the Enrolled order's _id as reference_id
      },
    ],
  });

  try {
    const paypalOrder = await client.execute(orderRequest);

    // Update the order with PayPal order ID
    enrolledOrder.orderID = paypalOrder.result.id;
    await enrolledOrder.save(); // Save the updated order with PayPal order ID

    return res.status(201).json({
      order: paypalOrder,
      client_id: process.env.PAYPAL_CLIENT_ID,
    });
  } catch (error) {
    console.error('Error creating PayPal order', error);
    return res.status(500).json({ message: 'Error creating PayPal order', error });
  }
};

export const verifypayment = async (req, res) => {
  const { paypal_order_id, paypal_payment_id } = req.body;

  const captureRequest = new OrdersCaptureRequest(paypal_order_id);

  try {
    const paymentResponse = await client.execute(captureRequest);
    const payment = paymentResponse.result;

    if (payment.status === 'COMPLETED') {
      const enrolledOrderIdsString = payment.purchase_units[0].reference_id;
      const enrolledOrderIds = enrolledOrderIdsString.split(',');
      console.log('Payment Response:', paymentResponse.result);
      console.log('Reference ID:', payment.purchase_units[0].reference_id);
      for (let orderId of enrolledOrderIds) {
        if (mongoose.Types.ObjectId.isValid(orderId)) {
        const order = await Enrolled.findById(orderId);
        if (order) {
          order.transactionId=paypal_payment_id
          order.paymentStatus = 'success';
          order.orderStatus = 'completed';
          order.price = payment.purchase_units[0].payments.captures[0].amount.value;
          await order.save();
           
          //remove purchase course from cart
          await cartModel.deleteMany({
            user:order.userId,
            course:{$in:order.courseId}  // delete only the purchased course(s)
          })
        }
      }
    }


      res.status(200).json({ message: 'Payment verified, captured, and orders updated' });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment', error });
  }
};





// export const paypalWebhook = async (req, res) => {
//   const secret = process.env.PAYPAL_WEBHOOK_SECRET;
//   const signature = req.headers['paypal-signature'];
//   const body = JSON.stringify(req.body);

//   const expectedSignature = crypto
//     .createHmac('sha256', secret)
//     .update(body)
//     .digest('hex');

//   if (signature !== expectedSignature) {
//     return res.status(400).json({ message: 'Invalid webhook signature' });
//   }

//   const event = req.body;

//   if (event.event_type === 'PAYMENT.SALE.COMPLETED') {
//     const { payment_id, amount, transaction_id } = event.resource;
//     const enrolledOrderIdsString = event.resource.invoice_id; // Retrieve order IDs from the invoice
//     const enrolledOrderIds = enrolledOrderIdsString.split(",");

//     // Capture payment and update enrolled orders
//     for (let orderId of enrolledOrderIds) {
//       const order = await Enrolled.findById(orderId);
//       if (order) {
//         order.paymentStatus = 'success';
//         order.orderStatus = 'completed';
//         order.price = amount.value; // Update order price with the amount from the payment
//         await order.save();
//       }
//     }
//     return res.status(200).json({ message: 'Payment verified and orders updated' });
//   }

//   return res.status(200).json({ received: true });
// };

