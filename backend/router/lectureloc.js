import express from "express"
import { authentication } from "../middleware/authentication.js";
import { completelecture, getlocklecture } from "../control/lecturelock.js";
import { paidlecture } from "../control/purchase.js";


const lectureloc = express.Router();
lectureloc.route('/completelec').post(authentication,completelecture);
lectureloc.route('/getlocklec/:courseid').get(authentication,getlocklecture)
lectureloc.route('/purchaselec/:course').get(authentication,paidlecture)


export default lectureloc;