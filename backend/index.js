import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbconnect } from "./lib/dbconnect.js";
import cookieParser from "cookie-parser";
import router from "./router/userrouter.js";
import adminRouter from "./router/admincrudrouter.js";
import creatorrouter from "./router/creatorcourse.js";
import lectureroute from "./router/lecturerouter.js";
import { cartrouter } from "./router/cartrouter.js";
import { studentrouter } from "./router/student.js";
import { filterrouter } from "./router/filter.js";
import lectureloc from "./router/lectureloc.js";
import { paymoney } from "./router/paymeny.js";
import { quizerouter } from "./router/quizerouter.js";
import { fileURLToPath } from 'url';
import path from 'path';


dotenv.config();
const app =express();
const __filename = fileURLToPath(import.meta.url) //LMSPro/backend/index.js
const __dirname =path.dirname(__filename); //LMSPro/backend/
app.use(express.json());
app.use(cors({
    origin:"https://learningms-7fli.vercel.app",
    methods:['GET','POST','PUT','DELETE'],
    credentials:true,
    allowedHeaders:['Content-Type', 'Authorization'],
}))

dbconnect();


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
const port =5000;
app.get("/",(req,res)=>{
    res.send("wwwwweeee");
})
app.use("/api",router);
app.use("/api",adminRouter);
app.use("/api",creatorrouter);
app.use("/api",lectureroute);
app.use("/api",cartrouter);
app.use("/api",studentrouter);
app.use("/api",filterrouter);
app.use("/api",lectureloc);
app.use("/api",paymoney);
app.use("/api",quizerouter);
 app.listen(port,()=>{
    console.log(`server is runnibg on http://localhost:${port}`);
 })