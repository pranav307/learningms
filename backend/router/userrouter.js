import express from "express";
import { createphoto, getProfile, register, signin, verifycode } from "../control/usercontrol.js";
import { uploadVideo } from "../control/urlController.js";
//import { authentication } from "../middleware/authentication.js";
import {authentication} from "../middleware/authentication.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/codeverify').post(verifycode);
router.route('/sign-in').post(signin);
router.route('/createphoto').post(authentication,createphoto)
router.route('/uploadimage/:id').post(uploadVideo);
router.route('/getprofile/:userId').get(getProfile);

export default router;