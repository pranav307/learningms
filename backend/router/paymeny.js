import express from "express";
import { authentication } from "../middleware/authentication.js";
import { createsession, getAllorders, getOrders, verifypayment } from "../control/paypal.js";




export const paymoney = express.Router();

paymoney.route('/getorder').get(authentication,getOrders)
paymoney.route('/session').post(authentication,createsession)
// paymoney.route('/webhook').post(express.raw({type:application/json}),stripeWebhook)
paymoney.route('/verifypayment').post(authentication,verifypayment)
paymoney.route('/allorders').get(authentication,getAllorders);