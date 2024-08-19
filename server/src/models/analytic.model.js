import mongoose from "mongoose";

const analyticSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
  },
  { timestamps: true }
);

export const Analytic = mongoose.model("Analytic", analyticSchema);
