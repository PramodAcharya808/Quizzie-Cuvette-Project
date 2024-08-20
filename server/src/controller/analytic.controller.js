import { Analytic } from "../models/analytic.model.js";
import { QuestionAnalytic } from "../models/questionAnalytic.model.js";
import { Question } from "../models/question.model.js";
import { User } from "../models/user.model.js";
import { Quiz } from "../models/quiz.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const quizImpressionIncrease = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new ApiResponse(404, "No quiz found");
    }

    quiz.impressions += 1;
    await quiz.save();

    return res.json(new ApiResponse(200, "Quiz impression incremented"));
  } catch (error) {
    return res.json(
      new ApiError(
        500,
        "Something went wrong while incrementing quiz impression",
        error
      )
    );
  }
};

const totalImpressions = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Quiz.aggregate([
      {
        $match: { creatorId: userId },
      },
      {
        $group: {
          _id: null, // Aggregate over all documents
          totalImpressions: { $sum: "$impressions" }, // Sum the 'impressions' field
        },
      },
    ]);

    if (result.length == 0) {
      return res.json(new ApiResponse(200, "Total Quiz Impressions", 0));
    }

    return res.json(
      new ApiResponse(200, "Total quiz impressions", result[0].totalImpressions)
    );
  } catch (error) {
    return res.json(
      new ApiError(
        500,
        "Something went wrong while fetching total quiz impressions",
        error
      )
    );
  }
};

const totalQuestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Quiz.aggregate([
      {
        $match: { creatorId: userId },
      },
      {
        $unwind: "$questions",
      },
      {
        $group: {
          _id: null,
          totalQuestions: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json(new ApiResponse(200, "Total Quiz Questions", 0));
    }

    return res.json(
      new ApiResponse(200, "Total Quiz Questions", result[0].totalQuestions)
    );
  } catch (error) {
    return res.json(
      new ApiError(
        500,
        "Something went wrong while fetching total questions",
        error
      )
    );
  }
};

const trendingQuiz = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Quiz.find({ creatorId: userId }).sort({
      impressions: -1,
    });

    if (result.length === 0) {
      return res.json(new ApiResponse(200, "No trending quiz found", result));
    }
    return res.json(new ApiResponse(200, "Trending quiz", result));
  } catch (error) {
    return res.json(
      new ApiError(
        500,
        "Something went wrong while fetching trending questions",
        error
      )
    );
  }
};

const totalQuiz = async (req, res) => {
  try {
    const userQuizes = req.user.quizes;
    console.log(userQuizes.length);

    return res.json(new ApiResponse(200, "Total Quiz", userQuizes.length));
  } catch (error) {
    return res.json(
      new ApiError(500, "Error while fetching total quiz", error)
    );
  }
};

export {
  quizImpressionIncrease,
  totalImpressions,
  totalQuestions,
  trendingQuiz,
  totalQuiz,
};
