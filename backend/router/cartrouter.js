import { Router } from "express";
import {authentication} from "../middleware/authentication.js";
import { addTocart, getcart, removeitem } from "../control/cartcontrol.js";


export const cartrouter = Router();
cartrouter.route('/addcart').post(authentication,addTocart);
cartrouter.route('/getitems').get(authentication,getcart);
cartrouter.route('/removeitem/:id').delete(authentication,removeitem);