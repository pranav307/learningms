




import { courseModel } from "../model/course.js";
import { lecturemodel } from "../model/lecture.js";
import { lecturepro } from "../model/lectureprogress.js";

export const getlocklecture = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseid } = req.params;

    // 🔍 Check if the course exists
    const course = await courseModel.findById(courseid);

    if (!course || !course.isfree) {
      return res.status(404).json({ message: "Course not found or not free" });
    }

    // 📚 Get lectures for the course
    const lectures = await lecturemodel.find({ course: courseid }).populate("vedioUrl");

    // 📈 Get user's completed lectures
    const progress = await lecturepro.findOne({ userid: userId, courseid }) ;
    const completelectureid = progress
      ? progress.completeLecture.map((id) => id.toString())
      : [];

    // 🔐 Apply locking logic
    let unlock = true;
    const lectureStatus = lectures.map((lecture) => {
      const iscomplete = completelectureid.includes(lecture._id.toString());
      const islocked = !unlock;

      if (!iscomplete) unlock = false;

      return {
        ...lecture.toObject(),
        iscomplete,
        islocked,
      };
    });

    return res.status(200).json({ lectures: lectureStatus });

  } catch (error) {
    console.error("Error in getlocklecture:", error);
    return res.status(500).json({ message: "Error in getting lectures" });
  }
};


export const completelecture = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseid, lectureid } = req.body;

    let progress = await lecturepro.findOne({ userid: userId, courseid });
    if (!progress) {
      progress = new lecturepro({
        userid: userId,
        courseid,
        completeLecture: [lectureid],
      });
    } else if (!progress.completeLecture.includes(lectureid)) {
      progress.completeLecture.push(lectureid);
    }

    await progress.save();
    return res.status(200).json({ message: "lecture marked as completed" });
  } catch (error) {
    console.error("Error in completelecture:", error); // ✅ helpful log
    return res.status(500).json({ message: "thier is error in getting lecture" });
  }
};
