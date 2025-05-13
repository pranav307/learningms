import express from "express";
import { authorize } from "../middleware/authorise.js";
import { authentication } from "../middleware/authentication.js";
import { deletelecture, getLectures, Lecturecreate, updateLecture } from "../control/lecturecontrol.js";


const lectureroute = express.Router();
lectureroute.route('/createlec').post(authentication,authorize("admin","creators"),Lecturecreate);
lectureroute.route('/getcourselec/:courseId').get(authentication,authorize("admin","creators","student"),getLectures);
lectureroute.route('/updatelecture/:lectureid').put(authentication,authorize("admin","creators"),updateLecture);
lectureroute.route("/deletelec/:id").delete(authentication,authorize("admin","creators"),deletelecture);

export default lectureroute;