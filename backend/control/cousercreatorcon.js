import { courseModel } from "../model/course.js";




export const updatecoursebycreator=async(req,res)=>{
    try {
        const {courseTitle,category} = req.body;
        const {id} =req.params;

        if(req.user.roles !=="creators" && req.user.roles!== "admin"){
            return res.status(401).json({success:false,message:"unauthorise user"});
        }

        const course = await courseModel.findByIdAndUpdate(id,{courseTitle,category},{new:true});
          await course.save();
        return res.status(201).json({success:false,course,message:"course update succesfully"})
    } catch (error) {
        return res.status(500).json({success:false,message:"error in updation",error:error.message})   
    }
}

export const getcourseforcreator = async (req, res) => {
  try {
    const { _id, role } = req.user;

    // Log the user details for debugging
    console.log("User ID:", _id);
    console.log("User Role:", role);

    if (!req.user || !_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User ID not found.",
      });
    }

    if (role !== "creators") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only creators and admin can fetch their courses.",
      });
    }

    // Fetch all courses where the creator matches the logged-in creator's ID
    const coursebycreator = await courseModel.find({ "creator.userid": _id });

    if (!coursebycreator || coursebycreator.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No courses found for this creator.",
      });
    }

    console.log("Creator's courses:", coursebycreator);
    return res.status(200).json({
      success: true,
      courses: coursebycreator,
    });
  } catch (error) {
    console.error("Error fetching creator's courses:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching courses.",
      error: error.message,
    });
  }
};
export const getcoursebyidcre= async(req,res)=>{
    const userId = req.user;
    const {courseId} = req.params;

    if(userId.role !== "creators" && userId.role !== "admin"){
        return res.status(403).json({
            success:false,message:"not applicable for"
        })
    }
    const course = await courseModel.findOne({_id:courseId,creator:userId._id});
    if(!course){
        return res.status(201).json({
            success:true,message:"no course found"
        })
    }
    return res.status(201).json({
        success,course
    })
}

export const deleteCoursebycreator = async(req,res)=>{
    try {
        const {id} =req.params;
        const userid = req.user;
       if(userid.role !="creators"){
        return res.status(403).json({message:"not allow"})
       }

       await courseModel.findByIdAndDelete({_id:id});
       return res.status(200).json({success:true,message:"product delted successfully"});
    } catch (error) {
        return res.status(500).json({success:false,message:"error in deletion",error:error.message})
    }
}
