import { cartModel } from "../model/cartiems.js";
import { courseModel } from "../model/course.js";
import { Enrolled } from "../model/enrolledstu.js";



export const addTocart = async(req,res)=>{
    if(!req.user){
        console.log("no user",req.user);
        return res.status(400).json({
            success:false,message:"user nottttt"
        })
    }
    const userid = req.user._id;
    const {courseid} = req.body;
    if (!courseid) {
        return res.status(400).json({ success: false, message: "Course ID is missing" });
    }
    const course = await courseModel.findById(courseid);
    if(!course){
        return res.status(401).json({success:false,message:"not found iiiii"});

    }
    if(course.isfree){
        return res.status(409).json({success:false,message:"course is free"})
    }
    // Check if course is already in cart
    const existingItem = await cartModel.findOne({ user: userid, course: courseid });
    if (existingItem) {
        return res.status(409).json({ success: false, message: "Course already in cart" });
    }

    const purchasecourse = await Enrolled.findOne({user:userid,courseId:courseid})
    if(purchasecourse){
        return res.status(409).json({success:false,message:"course already purchase"})
    }
    const cartitems = await cartModel.create({
        user:userid,
        course:courseid,       // price : course.coursePrice
    })  
     cartitems.save();
    return res.status(200).json({success : true,cartitems});
}

export const getcart = async(req,res)=>{
    const userId = req.user._id;
    const cartitems = await cartModel.find({user:userId}).populate("course",["courseTitle","Thumbnail","coursePrice"]);
   
   console.log("ffff",cartitems);
    return res.status(201).json({success:true,cartitems});
}

export const removeitem=  async(req,res)=>{
    const userId = req.user._id;
    const {id} = req.params;
    const cartitem = await cartModel.findOne({_id:id,user:userId});
    if(!cartitem){
        return res.status(400).json({success:false,message:"not found"})
    }
    
    await cartModel.findByIdAndDelete(id);
    console.log("items ewmoves ");
    return res.status(201).json({success:true,message:"delete successfully"})

}