import mongoose, { Schema } from "mongoose";

const QuizeSchema = new Schema({
  question: {
    type: String,
  },
  options: [
    {
      type: String,
    },
  ],
  correctAnswer: {
    type: String,
  },
});

const quizeSchema = new Schema(
  {
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lecture", // Ensure this matches the model name for the lecture
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Ensure this matches the model name for the course
    },
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    },
    questions: [QuizeSchema],
  },
  { timestamps: true }
);

export const QuizeModel = mongoose.model("Quize", quizeSchema);
