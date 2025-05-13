import { Router } from "express";
import { Createcourse, deleteCourse, getcourseadmin, getproductbyid, updateCourse } from "../control/coursecontrol.js";
import { authentication } from "../middleware/authentication.js";
import { authorize } from "../middleware/authorise.js";

const adminRouter = Router();

// Routes accessible by both students and admins
adminRouter.route('/getcourse').get(authentication, getcourseadmin);
adminRouter.route("/getpro/:id").get(authentication, getproductbyid);

// Routes restricted to admins only
adminRouter.route('/createcourse').post(authentication, authorize("admin","creators"), Createcourse);
adminRouter.route('/updatecourse/:id').put(authentication, authorize("admin","creators"), updateCourse);
adminRouter.route('/deletecourse/:id').delete(authentication, authorize("admin"), deleteCourse);

export default adminRouter;