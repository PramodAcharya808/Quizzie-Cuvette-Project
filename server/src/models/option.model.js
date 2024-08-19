import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    optionText: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
    },
    isCorrect: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

export const Option = mongoose.model("Option", optionSchema);
