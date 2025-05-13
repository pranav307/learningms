import { QuizeModel } from "../model/quize.js";

export const createQuize = async (req, res) => {
  const { course, lecture, questions } = req.body;


  const {role} = req.user;
  if (role !== "admin" && role !== "creators") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  if (!course || !lecture || !questions || !Array.isArray(questions)) {
    return res.status(400).json({
      success: false,
      message: "You must provide course, lecture, and a question.",
    });
  }

  try {
    // Find if a quiz already exists for this lecture
    let quiz = await QuizeModel.findOne({ lecture });

    // const newQuestion = {
    //   question: question.question,
    //   options: question.options, // Should be an array
    //   correctAnswer: question.correctAnswer,
    // };

    if (quiz) {
      // Add new question to existing quiz
      quiz.questions.push(...questions);
      await quiz.save();
      return res.status(200).json({
        success: true,
        message: "Question added to existing quiz.",
      });
    } else {
      // Create new quiz
      quiz = new QuizeModel({
        course,
        lecture,
        questions,
        user:req.user._id
      });

      await quiz.save();

      return res.status(201).json({
        success: true,
        message: "New quiz created with one question.",
      });
    }
  } catch (error) {
    console.error("Error creating quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating quiz.",
    });
  }
};



// Fetch all quizzes
export const getQuizes = async (req, res) => {
  try {
    const {lecture} = req.params;
    const quizes = await QuizeModel.find({lecture:lecture})
      .populate('course')  // Populate course details
      .populate('lecture'); // Populate lecture details
    
    if (!quizes || quizes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No quizzes found",
      });
    }

    return res.status(200).json({
      success: true,
      quizes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching quizzes",
    });
  }
};

// Fetch a single quiz by ID
export const getQuizById = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await QuizeModel.findById(id)
      .populate('course')
      .populate('lecture');
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the quiz",
    });
  }
};

export const updatequize = async (req, res) => {
  const { questionId, question, options, correctAnswer } = req.body;
  const { id } = req.params; // quiz ID

  if (!questionId) {
    return res.status(400).json({
      success: false,
      message: "You must provide the questionId to update.",
    });
  }

  try {
    const quiz = await QuizeModel.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const questionToUpdate = quiz.questions.id(questionId);
    if (!questionToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Question not found in quiz",
      });
    }

    // Update fields if provided
    if (question) questionToUpdate.question = question;
    if (options) questionToUpdate.options = options;
    if (correctAnswer) questionToUpdate.correctAnswer = correctAnswer;

    await quiz.save();

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      quiz,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deletequestion =async(req,res)=>{
  const {id,questionid} = req.params;
   const quize = await QuizeModel.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }
   const question = quize.questions.id(questionid)
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found in quiz",
      });
    
   

}
 question.remove();
  await quize.save()
  return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
}