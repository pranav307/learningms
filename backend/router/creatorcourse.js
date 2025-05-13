import { Router } from "express";
import {  deleteCoursebycreator, getcoursebyidcre, getcourseforcreator, updatecoursebycreator } from "../control/cousercreatorcon.js";
import {authorize} from "../middleware/authorise.js";
import {authentication} from "../middleware/authentication.js";



const creatorrouter = Router();


creatorrouter.route('/updatecrecourse').put(updatecoursebycreator);

creatorrouter.route('/getcrecourse').get(authentication,authorize("creators","admin"),getcourseforcreator);
creatorrouter.route('/getbyidcre/:courseId').get(authentication,authorize("creators","admin"),getcoursebyidcre);

creatorrouter.route('/deletecourse/:id').delete(deleteCoursebycreator);

export default creatorrouter;