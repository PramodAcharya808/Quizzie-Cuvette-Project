import { Router } from "express";
import {
  createQuiz,
  deleteQuiz,
  getQuizData,
} from "../controller/quiz.controller.js";
import { JWTverify } from "../middleware/auth.middleware.js";

const quizRouter = Router();

quizRouter.route("/create").post(JWTverify, createQuiz);
quizRouter.route("/delete/:quizId").delete(JWTverify, deleteQuiz);
quizRouter.route("/view/:quizId").get(JWTverify, getQuizData);

export default quizRouter;
