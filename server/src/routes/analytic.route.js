import { Router } from "express";
import {
  quizImpressionIncrease,
  totalImpressions,
  totalQuestions,
  trendingQuiz,
} from "../controller/analytic.controller.js";
import { JWTverify } from "../middleware/auth.middleware.js";

const analyticRouter = Router();

analyticRouter
  .route("/increaseimpression/:quizId")
  .post(quizImpressionIncrease);

analyticRouter.route("/totalimpressions").get(JWTverify, totalImpressions);
analyticRouter.route("/totalquestions").get(JWTverify, totalQuestions);
analyticRouter.route("/trendingquiz").get(JWTverify, trendingQuiz);

export default analyticRouter;
