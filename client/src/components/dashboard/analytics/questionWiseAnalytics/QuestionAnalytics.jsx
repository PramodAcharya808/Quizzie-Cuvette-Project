import React, { useEffect, useState } from "react";
import "./QuestionAnalytics.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import CountUp from "react-countup";
import { format, parseISO } from "date-fns";
import QuestionCard from "./questionCard/QuestionCard";

const QuestionAnalytics = () => {
  const [quizDetails, setQuizDetails] = useState({
    totalImpressions: 0,
    createdAt: "",
    quizName: "",
    questions: [
      {
        questionText: "",
        totalAnswered: 0,
        totalCorrect: 0,
        totalWrong: 0,
      },
    ],
  });
  const { quizId } = useParams();

  function formatDate(date) {
    if (!date) return "";
    return format(parseISO(date), "dd MMM, yyyy");
  }

  useEffect(() => {
    async function getQuestion() {
      const response = await axios.get(
        `/api/analytics/getquestionwiseanalytics/${quizId}`
      );
      if (response.data.data) {
        setQuizDetails(response.data.data);
      }
    }
    getQuestion();
  }, [quizId]);

  // console.log(quizDetails.questions[0].questionText);

  return (
    <div className="question-analysis-container">
      <div className="question-info">
        <div className="quiz-question-name">
          <h1>{quizDetails.quizName} Question Analysis</h1>
        </div>
        <div className="quiz-meta-data">
          <h2>Created on : {formatDate(quizDetails.createdAt)}</h2>
          <h2>
            Impressions :{" "}
            <CountUp
              start={0}
              end={quizDetails.totalImpressions}
              duration={2}
            />
          </h2>
        </div>
      </div>
      <div className="questions-container">
        <div className="question-inner-container">
          {quizDetails.questions.map((question, index) => (
            <QuestionCard
              key={index}
              index={index + 1}
              questionText={question.questionText}
              totalAnswered={question.totalAnswered}
              totalCorrect={question.totalCorrect}
              totalWrong={question.totalWrong}
            />
          ))}
        </div>
        ;
      </div>
    </div>
  );
};

export default QuestionAnalytics;
