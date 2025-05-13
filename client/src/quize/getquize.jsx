import { useToast } from "@/hooks/use-toast";
import { useGetquizeQuery } from "@/storertk/quizertk";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const Getquize = () => {
  const { lecture } = useParams();
  const { data, isLoading } = useGetquizeQuery(lecture);
  const quize = data?.quizes || [];
  const { toast } = useToast();

  const [selectedOptions, setSelectedOptions] = useState({});
  const [submitted, setSubmitted] = useState({});

  const handleOptionSelect = (questionId, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = (questionId, correctAnswer) => {
    const selected = selectedOptions[questionId];

    if (!selected) {
      toast({
        title: "No option selected",
        description: "Please select an option before submitting.",
      });
      return;
    }

    if (selected === correctAnswer) {
      toast({ title: "Correct", description: "Answer is correct" });
    } else {
      toast({
        title: "Wrong",
        description: `Your answer is wrong. Correct answer is: ${correctAnswer}`,
      });
    }

    // Mark question as submitted
    setSubmitted((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!quize || quize.length === 0) {
    return <p>No quizzes available for this lecture.</p>;
  }

  return (
    <div>
      <h1 className="font-bold text-2xl text-center">Quiz for this lecture</h1>
      <div className="flex flex-col items-center m-2 p-4 bg-blue-50">
        {quize.map((item) =>
          item.questions.map((q) => (
            <div key={q._id} className="mb-8">
              <p className="font-semibold p-2">Q:{q.question}</p>
              {q.options.map((opt, index) => (
                <label key={index} className="block mb-2">
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    checked={selectedOptions[q._id] === opt}
                    disabled={submitted[q._id]}
                    onChange={(e) => handleOptionSelect(q._id, e.target.value)}
                  />
                  {" "}{opt}
                </label>
              ))}
              <button
                disabled={submitted[q._id]}
                onClick={() => handleSubmit(q._id, q.correctAnswer)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                Submit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};