import { Router } from "express";
import { authentication } from "../middleware/authentication.js";
import { getFreeCourse } from "../control/getstucou.js";



export const studentrouter = Router();
studentrouter.route("/getfreecourse").get(authentication,getFreeCourse); 