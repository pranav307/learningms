import { UserModel } from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


import  {sendMail}  from "../helper/sendverifyemail.js";



export const register = async (Request, Response) => {
    try {
        const { email, username, password,role } = Request.body;

        if (!username || !email || !password || !role) {
            return Response.status(400).json({
                success: false,
                message: "Fill all details",
            });
        }

        const user = await UserModel.findOne({ email });
        let verifycode = Math.floor(100000 + Math.random() * 900000).toString();

        if (user) {
            if (user.isverified) {
                return Response.status(400).json({
                    success: false,
                    message: "You are already registered",
                });
            } else {
                const hashPassword = await bcrypt.hash(password, 10);
                user.password = hashPassword;
                user.verifycode = verifycode;
                user.isExpired = new Date(Date.now() + 360000);
                await user.save();
            }
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const expirydate = new Date();
            expirydate.setHours(expirydate.getHours() + 1);

            const newuser = await UserModel.create({
                username,
                email,
                role,
                password: hashPassword,
                verifycode,
                isExpired: expirydate,
                isverified: false,
            });

            await newuser.save();
        }

        const emailResponse = await sendMail(email, username, verifycode);

        if (!emailResponse.success) {
            return Response.status(400).json({
                success: false,
                message: emailResponse.message,
            });
        }

        return Response.status(200).json({
            success: true,
            message: emailResponse.message,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return Response.status(500).json({ success: false, message: "Error registering user" });
    }
};






export const verifycode=async (req,res)=>{
    
   try {
     const {username,code} =req.body;
     const decodeuriuser =decodeURIComponent(username);
     const user = await UserModel.findOne({username:decodeuriuser});
     if(!user){
         return res.status(400).json({success:false,
             message:"user not foound",
         });
     }
     const iscodevalid = user.verifycode === code;
     const isexpiredcode = new Date(user.isExpired) >new Date();
     if(iscodevalid && isexpiredcode){
         user.isverified =true;
         await user.save();
         return res.status(200).json({
             success:true,
             message:"account verified scuusfully",
         });
     }
     else if(!isexpiredcode){
         return res.status(400).json|({success:false,
             message:"code expired again signup"
         });
     }
     else{
         return res.status(400).json({success:false,
             message:"code is invalid",
         })
     }
 }
    catch (error) {
     console.error("error in getting verification code fromuser");
     return res.status(500).json({success:false,
        message:"error in verifyng user",
     })
   }
}  
export const signin = async(req,res)=>{
    
        const {email,password} = req.body;
        if(!password || !email){
            console.log("email and password required");
            return res.status(400).json({success:false,message:"password and email required"})
        }
        try{
        const user =await UserModel.findOne({
            email
        })
        if(!user){
            console.log("user not found with this email");
        }
        const bcryptpassword = await bcrypt.compare(password,user.password);
        if(!bcryptpassword){
            console.log("password is incorrect");
            return res.status(400).json({success:false,message:"password is incoorect"});
        }
        
       if(!user.isverified){
        return res.status(400).json({success:false,message:"account is not verified please verify"})
       }
       const token =jwt.sign(
       {userId:user._id,username:user.username,email:user.email,role:user.role},
         process.env.jwt_key,
         {expiresIn:"1h"}
       );
       return res.status(200).json({
        success:true,
        message:"succesfullly login",
        token,
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role,
        },
       });

    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ success: false, message: "Internal server erroe"});
    }
}
export const createphoto = async (req, res) => {
  try {
    const user = req.user._id; // Ensure req.user is populated by the authentication middleware
    const { photourl } = req.body;

    if (!user) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (!photourl) {
      return res.status(400).json({ success: false, message: "Photo URL is required" });
    }

    const userdata = await UserModel.findById(user);
    if (!userdata) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    userdata.photourl = photourl;
    await userdata.save();

    return res.status(201).json({ success: true, message: "Photo created successfully" });
  } catch (error) {
    console.error("Error in createphoto:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
         
        const user = await UserModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error during getProfile:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};