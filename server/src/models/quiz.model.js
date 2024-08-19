import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    quizname: {
      type: String,
      required: [true, "Quiz name required"],
    },
    quiztype: {
      type: String,
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    impressions: {
      type: Number,
      default: 0,
    },
    publicLink: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
