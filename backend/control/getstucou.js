import { courseModel } from "../model/course.js";
import { Enrolled } from "../model/enrolledstu.js";




export const getFreeCourse = async (req, res) => {
  try {
    

    // Query for free courses
    const freeCourse = await courseModel.find({ 
      
      isfree: true     // Correct filter syntax
    }).populate("lectures");

    // Check if the course exists
    if (!freeCourse) {
      return res.status(404).json({ success: false, message: "No free course found" });
    }
     console.log(freeCourse,"gett");
    return res.status(200).json({ success: true, freeCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getstudentCourse=async(req,res)=>{
     try {
      const {userId,courseId} = req.body;
      const exitingusercourse = await Enrolled.findOne({userId:userId,courseId:courseId});
      if(exitingusercourse){
       return res.status(400).json({message:"you already enrolled this course"});
      }
      const newenrolled = new Enrolled({userId,courseId,purchaseDate:Date.now()});
      const saveenrolled = await newenrolled.save();
       if(saveenrolled){
           return res.status(200).json({message:"course enrolled successfully"});
       }
     } catch (error) {
         return res.status(500).json({message:error.message});
      
     }

  } 
  export const getStudentcourses=async(req,res)=>{
    try {
      const {userId} = req.params;
      const courses = await Enrolled.find({userId}).populate("courseId");
if(courses.length== 0){
  return res.status(400).json({message:"no courses are found"})
}
     const listcourse = courses.map((enrolls)=>enrolls.courseId);
      return res.status(200).json({listcourse});
    } catch (error) {
      return res.status(500).json({message:"error in getting courses"})
    }
  }
