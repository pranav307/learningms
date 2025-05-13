import { Router } from "express";
import { authentication } from "../middleware/authentication.js";
import { createQuize, deletequestion, getQuizes, updatequize } from "../control/quizecontrol.js";
import { authorize } from "../middleware/authorise.js";



export const quizerouter = Router();
quizerouter.route('/addquize').post(authentication,authorize("admin","creators"),createQuize);
quizerouter.route('/getquize/:lecture').get(authentication,getQuizes);
quizerouter.route('/updatequize/:id').put(authentication,updatequize);
quizerouter.route('/deletequize/:id/:questionid').delete(authentication,deletequestion)