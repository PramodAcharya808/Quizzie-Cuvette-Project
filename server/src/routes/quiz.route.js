import { Router } from "express";
import {
  createQuiz,
  deleteQuiz,
  getQuizData,
  updateQuiz,
} from "../controller/quiz.controller.js";
import { JWTverify } from "../middleware/auth.middleware.js";

const quizRouter = Router();

quizRouter.route("/create").post(JWTverify, createQuiz);
quizRouter.route("/delete/:quizId").delete(JWTverify, deleteQuiz);
quizRouter.route("/view/:quizId").get(JWTverify, getQuizData);
quizRouter
  .route("/update/:quizId/question/:questionId")
  .patch(JWTverify, updateQuiz);

export default quizRouter;
