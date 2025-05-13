import { courseModel } from "../model/course.js";
import { lecturemodel } from "../model/lecture.js";
import { urlModel } from "../model/urlmodel.js";

export const Lecturecreate = async (req, res) => {
    const { vedioUrl, title, duration, order, courseid } = req.body;
    const userId = req.user.id;

    if (!vedioUrl || typeof vedioUrl !== "string") {
        return res.status(400).json({ success: false, message: "vedioUrl is required and must be a string." });
    }

    const courses = await courseModel.findById(courseid);
    if (!courses) {
        return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (
        req.user.role !== "admin" &&
        courses.creator.toString() !== userId.toString() &&
        req.user.role !== "creators"
    ) {
        return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Validate or transform duration (without changing variable name)
    let validDuration = duration;
    const durationPattern = /^(\d{1,2}):([0-5]?\d)$/; // matches MM:SS or HH:MM
    if (!durationPattern.test(duration)) {
        return res.status(400).json({
            success: false,
            message: "Invalid duration format. Use HH:MM or MM:SS format.",
        });
    }

    const [minOrHour, secondsOrMinutes] = duration.split(":").map(Number);
    const totalSeconds = minOrHour * 60 + secondsOrMinutes;
    validDuration = `${minOrHour}:${secondsOrMinutes.toString().padStart(2, "0")}`;

    let urlexist = await urlModel.findOne({ url: vedioUrl });
    if (!urlexist) {
        urlexist = await urlModel.create({
            url: vedioUrl,
            type: vedioUrl.includes("mp4") ? "video" : "image", // basic check
        });
    }

    const lecture = await lecturemodel.create({
        vedioUrl: urlexist._id,
        title,
        duration: validDuration,
        order,
        course: courseid,
        user: userId,
    });

    courses.lectures.push(lecture._id);
    await courses.save();
    await lecture.save();

    return res.status(200).json({ success: true, lecture });
};



/*export const getLectures = async (req, res) => {
    try { 
        const {courseId} = req.params;
       // const query = courseId ? {course:courseId} : {};

        const lectures = await lecturemodel.find({course:courseId.toString()}).populate("course",["courseTitle","category"]).populate("vedioUrl","url"); // Populate course details
        
        if (!lectures || lectures.length === 0) {
            return res.status(200).json({ success: true, message: "No lectures found" });
        }

        return res.status(200).json({ success: true, lectures });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
*/


export const getLectures = async (req, res) => {
    try { 
        const { courseId } = req.params;

        // Fetch the course along with its lectures
        const course = await courseModel.findById(courseId)
            .populate({
                path: "lectures",
                populate: { path: "vedioUrl", select: "url" } // Populate video URLs
            });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        return res.status(200).json({ success: true, lectures: course.lectures });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const updateLecture = async (req, res) => {
    try {
        const {  vedioUrl, title, duration, order, courseid } = req.body;
        const userId = req.user.id;
        const {lectureid} = req.params;

        if (!lectureid || !courseid) {
            return res.status(400).json({ success: false, message: "Lecture ID and Course ID are required" });
        }

        const course = await courseModel.findById(courseid);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Check if the user is Admin or the Creator of the Course
        if (req.user.role !== "admin" && req.user.role !== "creators") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
    //           const updateFields ={}
    // if (vedioUrl) updateFields.vedioUrl = vedioUrl;
    // if (title) updateFields.title = title;
    // if (duration) updateFields.duration = duration;
    // if (order) updateFields.order = order;
    //     const lecture = await lecturemodel.findByIdAndUpdate(
    //         lectureid, // Find by Lecture ID
    //         updateFields, // Update fields
    //         { new: true } // Return updated document
    //     );
    const videoUrlString = typeof vedioUrl === "object" ? vedioUrl.url : vedioUrl;

let urlexist = await urlModel.findOne({ url: videoUrlString });
if (!urlexist) {
    urlexist = await urlModel.create({
        url: videoUrlString,
        type: videoUrlString.includes("mp4") ? "video" : "image",
    });
}

const lecture = await lecturemodel.findById(lectureid);
if (!lecture) {
    return res.status(404).json({ success: false, message: "Lecture not found" });
}
         if (vedioUrl) lecture.vedioUrl = urlexist._id;
         if (title) lecture.title = title;
         if (duration) lecture.duration = duration;
         if (order) lecture.order = order;


        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecturerrrrrrr not found" });
        }
        await lecture.save()
        return res.status(200).json({ success: true, lecture });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


export const deletelecture = async (req, res) => {
    try {
        const { id } = req.params; // Extract lectureId correctly

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Lecture ID is required",
            });
        }

        const deletedLecture = await lecturemodel.findByIdAndDelete(id);

        if (!deletedLecture) {
            return res.status(400).json({
                success: false,
                message: "Lecture not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lecture deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
