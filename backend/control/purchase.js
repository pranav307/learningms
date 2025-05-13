import { Enrolled } from "../model/enrolledstu.js";
import { lecturemodel } from "../model/lecture.js";
import { lecturepro } from "../model/lectureprogress.js";

export const paidlecture = async (req, res) => {
  try {
    const { course } = req.params;
    const userId = req.user._id;

    // ✅ Check enrollment
    const enrollment = await Enrolled.findOne({ courseId: course, userId });

    if (!enrollment) {
      return res.status(403).json({ message: "You are not enrolled in this course." });
    }

    // ✅ Get all lectures for the course
    const lectures = await lecturemodel.find({ course }).populate("vedioUrl");

    // ✅ Get user’s completed lectures
    const progress = await lecturepro.findOne({ userid: userId, courseid: course });
    const completedIds = progress
      ? progress.completeLecture.map((id) => id.toString())
      : [];

    // ✅ Apply locking logic
    let unlock = true;
    const lectureList = lectures.map((lecture) => {
      const iscomplete = completedIds.includes(lecture._id.toString());
      const islocked = !unlock;

      if (!iscomplete) unlock = false;

      return {
        ...lecture.toObject(),
        iscomplete,
        islocked,
      };
    });

    return res.status(200).json({ lectures: lectureList });

  } catch (error) {
    console.error("Error in paidlecture:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
