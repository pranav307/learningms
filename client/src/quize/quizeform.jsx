import { useToast } from "@/hooks/use-toast";
import { useGetcoursebycreatorQuery, useGetcourseQuery } from "@/redux/admincourse";
import { useGetcourselecQuery } from "@/redux/lecturecrud";
import { useGetProfileQuery } from "@/redux/userauth";
import { useCreatequizeMutation } from "@/storertk/quizertk";
import { useState } from "react";

export const Createquize = () => {
  const { data } = useGetProfileQuery();
  const user = data?.user || [];
  const { data: courses } = useGetcourseQuery();
  const coursedata = courses?.course;
  const { data: crecourse } = useGetcoursebycreatorQuery();
  const creatorcourse = crecourse?.courses;
  const [createquize, { isLoading }] = useCreatequizeMutation();
  const [courseid, setcourseid] = useState("");
  const { data: lecture } = useGetcourselecQuery(courseid, {
  skip: !courseid, // Only run the query if courseid exists
});


  const lec = lecture?.lectures;
  
  const [lectureid, setlectureid] = useState("");
  const [question, setquestion] = useState("");
  const [options, setoptions] = useState(["", "", "", ""]);
  const [correctans, setcorrectans] = useState("");
  const { toast } = useToast();

  const handleOptions = (value, index) => {
    const update = [...options];
    update[index] = value;
    setoptions(update);
  };

  const handleCreatequize = async () => {
    // Validate inputs
    console.log("Course ID:", courseid);
  console.log("Lecture ID:", lectureid);
  console.log("Question:", question);
  console.log("Options:", options);
  console.log("Correct Answer:", correctans);
    if (!courseid || !lectureid || !question || options.includes("") || !correctans) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
      });
      return;
    }

    // Ensure correctans matches one of the options
    if (!options.includes(correctans)) {
      toast({
        title: "Error",
        description: "Correct answer must match one of the options.",
      });
      return;
    }

    // Send quiz creation request
    try {
      await createquize({
        course: courseid,
        lecture: lectureid,
        questions: [
          {
            question: question,
            options: options,
            correctAnswer: correctans,
          },
        ],
      }).unwrap();

      toast({
        title: "Success",
        description: "Quiz created successfully.",
      });

      // Reset state
      setoptions(["", "", "", ""]);
      setquestion("");
      setcorrectans("");
    } catch (error) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to create quiz.",
      });
    }
  };

  const courseList = user.role === "admin" ? coursedata || [] : creatorcourse || [];
  const lectureList = lec || [];
  const filterlecture = lectureList.filter((le) => le.course === courseid);
  
  return (
    <div className="">
      <h1 className="text-center font-bold text-2xl">Create Quiz</h1>
      <div className="flex flex-col  justify-between items-center bg-blue-50  font-bold m-2 p-2 border overflow-hidden">
        <div className=" p-4">
        {/* Course Selection */}
        <select
          className=""
          value={courseid}
          onChange={(e) => {
            setcourseid(e.target.value);
          }}
        >
          <option value="">Select Course</option>
          {courseList?.map((item) => (
            <option key={item._id} value={item._id}>
              {item.courseTitle}
            </option>
          ))}
        </select>
         </div>
        {/* Lecture Selection */}
        <div className="p-2">
        {courseid && (
          <select
            className="border p-2 rounded-2xl"
            value={lectureid}
            onChange={(e) => setlectureid(e.target.value)}
          >
            <option value="">Select a Lecture</option>
            {filterlecture.map((lecture) => (
              <option key={lecture._id} value={lecture._id}>
                {lecture.title}
              </option>
            ))}
          </select>
        )}
</div>
        {/* Question Input */}
     
        <label className="p-2">Write Question</label>
        <input
          type="text"
          className="rounded-2xl p-2"
          placeholder="Write question"
          value={question}
          onChange={(e) => setquestion(e.target.value)}
        />
        
        {/* Options Input */}
        <label className="p-2 ">Write Options</label>
        {options.map((opt, idx) => (
          <input
          className="p-2 "
            key={idx}
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptions(e.target.value, idx)}
          />
        ))}

        {/* Correct Answer Input */}
        <label className="p-2">Write Correct Answer</label>
        <input
          type="text"
          className="border p-2 rounded-2xl"
          placeholder="Correct Answer"
          value={correctans}
          onChange={(e) => setcorrectans(e.target.value)}
        />

        {/* Submit Button */}
        <button onClick={handleCreatequize} disabled={isLoading} 
        className="p-2 m-4 bg-blue-100 hover:bg-blue-500 rounded-2xl w-xl"
        >
          {isLoading ? "Creating..." : "Create Quiz"}
        </button>
      </div>
    </div>
  );
};