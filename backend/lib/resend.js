import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();
const resend = new Resend(process.env.RESEND_APIKEY);
export {resend};
//we are using nodemailer in project not resend