import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedOptionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Option",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Response = mongoose.model("Response", responseSchema);
