import mongoose from "mongoose";

const questionAnalyticSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    optionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Option",
      required: true,
    },
    quizType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    attended: {
      type: Number,
      default: 0,
    },
    correct: {
      type: Number,
      default: 0,
    },
    incorrect: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const QuestionAnalytic = mongoose.model(
  "QuestionAnalytic",
  questionAnalyticSchema
);
