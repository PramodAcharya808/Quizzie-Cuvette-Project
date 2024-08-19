import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    questionText: {
      type: String,
      required: [true, "Question required"],
    },
    questionType: {
      type: String,
      required: true,
    },
    timer: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
