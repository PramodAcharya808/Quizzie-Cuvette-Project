import { Quiz } from "../models/quiz.model.js";
import { Question } from "./../models/question.model.js";
import { Option } from "./../models/option.model.js";
import { v4 as uuidv4 } from "uuid";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { QNA } from "../constants.js";
import { User } from "../models/user.model.js";

const quizUuid = () => {
  const uuid = uuidv4();
  const publicLink = `${process.env.REACT_FRONTEND}/public/quiz/${uuid}`;
  return { publicLink };
};

const createQuiz = async (req, res) => {
  try {
    const { quizName, quizType, questions } = req.body;
    const creatorId = req.user._id;
    const { publicLink } = quizUuid();

    const questionIds = [];
    const optionIds = [];

    // console.log(quizName, quizType, questions);

    if (quizName === "") {
      throw new ApiResponse(400, "Quiz name is required");
    }
    // Create Quiz Data
    const quizObject = await Quiz.create({
      quizName,
      quizType,
      creatorId,
      questions: [],
      quizLink: publicLink,
    });

    // Create Question Data
    for (const questionData of questions) {
      const { questionText, optionType, options, timer } = questionData;
      const questionObject = await Question.create({
        quizId: quizObject._id,
        questionText,
        optionType,
        options: [],
        timer: quizType === QNA ? timer : undefined,
      });

      questionIds.push(questionObject._id);
      quizObject.questions = questionIds;
      await quizObject.save();

      // Create Option Data
      for (const optionData of options) {
        const { optionText, imageURL, isCorrect } = optionData;
        const optionObject = await Option.create({
          questionId: questionObject._id,
          optionText,
          imageURL,
          isCorrect,
        });

        optionIds.push(optionObject._id);
        questionObject.options.push(optionObject._id);
        await questionObject.save();
      }
    }

    await User.findByIdAndUpdate(creatorId, {
      $push: { quizes: quizObject._id },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Quiz Created Successfully", publicLink));
  } catch (error) {
    return res.json(new ApiError(500, "Error creating quiz", error));
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user._id;
    // console.log(quizId);

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      throw new ApiResponse(404, "Quiz not found");
    }
    if (quiz.creatorId.toString() !== userId.toString()) {
      throw new ApiResponse(403, "You are not authorized to delete this quiz");
    }

    // Delete options linked to the questions of the quiz
    const questions = await Question.find({ quizId: quiz._id });
    const questionIds = questions.map((question) => question._id);

    await Option.deleteMany({ questionId: { $in: questionIds } });

    // Delete questions
    await Question.deleteMany({ quizId: quiz._id });

    // Finally, delete the quiz itself
    await Quiz.deleteOne({ _id: quizId });

    // Remove quiz from user's quizzes array
    await User.findByIdAndUpdate(userId, {
      $pull: { quizes: quizId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Quiz Deleted Successfully"));
  } catch (error) {
    return res.json(new ApiError(500, "Error deleting quiz", error));
  }
};
export { createQuiz, deleteQuiz };
