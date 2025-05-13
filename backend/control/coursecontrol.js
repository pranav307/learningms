import { courseModel } from "../model/course.js";




export const Createcourse=async(req,res)=>{
    try {
      const {courseTitle,category,description,courseLevel,coursePrice,Thumbnail,isfree} =req.body;
      if(!courseTitle || !category || !description|| !courseLevel){
          return res.status(400).json({success:false,message:"title and category required"});
  
      }
  
      if(req.user.role !== "admin" && req.user.role !=="creators"){
          return res.status(400).json({success:false,message:"admin required or creators required "});
      }
        
      const courses = await courseModel.create({
          courseTitle,category,creator:{
             userid:req.user._id,
              role:req.user.role,
         },description,courseLevel,
          Thumbnail,
          coursePrice,
          isfree,
          
      })
 
     
      //await courses.save();
      return res.status(201).json({courses,message:"coursese created successfully"})
    } catch (error) {
     return res.status(400).json({success:false,message:"course not creaated "})
    }
 }
export const getcourseadmin = async (req, res) => {
    try {
      // Check if the user is an admin
      
  
      // Fetch courses with populated Thumbnail field
      const course = await courseModel.find();
  
      return res.status(200).json({
        success: true,
        course,
      });
    } catch (error) {
      console.error("Error fetching courses:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error while fetching courses.",
      });
    }
  };
  
  export const updateCourse = async (req, res) => {
    const { courseTitle, category, description, courseLevel, isfree, coursePrice, Thumbnail } = req.body;
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.role!=="creators") {
        return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    try {
        const course = await courseModel.findById(id);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Update only if fields are provided
        if (courseTitle) course.courseTitle = courseTitle;
        if (category) course.category = category;
        if (description) course.description = description;
        if (courseLevel) course.courseLevel = courseLevel;
        if (Thumbnail) course.Thumbnail = Thumbnail;

        // Handle isfree and coursePrice
        if (typeof isfree!=='undefined'){
        course.isfree = isfree;
        if (isfree) {
            course.coursePrice = undefined;
        } else {
            if (typeof coursePrice === 'number' && coursePrice >= 0) {
                course.coursePrice = coursePrice;
            } else {
                return res.status(400).json({ success: false, message: "Valid coursePrice is required when isfree is false" });
            }
        }
    }

        await course.save();

        return res.status(200).json({ success: true, course, message: "Course updated successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};



export const deleteCourse =async(req,res)=>{
    try {
        const {id} =req.params;
        if(req.user.role!=="admin"){
            return res.status(401).json({success:false,message:'invalid to use'})
        }
    
        await courseModel.findByIdAndDelete(id);
        return res.status(201).json({success:true,message:"course deleted succesfuuly"})
    }
    catch (error) {
       return res.status(500).json({success:false,message:"server error",error:error.message});
    }
}
export const getproductbyid = async (req, res) => {
    try {
        const { id } = req.params;

        // Find course by ID
        const coursepro = await courseModel.findById(id);

        // Check if the course exists
        if (!coursepro) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        return res.status(200).json({
            success: true,
            course: coursepro, // Use 'course' instead of 'coursepro' for clarity
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


