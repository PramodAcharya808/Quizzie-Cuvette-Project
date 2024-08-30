import React, { useEffect, useState, useCallback } from "react";
import "./GameView.css";
import "./GameViewMediaQuery.css";
import { v4 as uuidv4 } from "uuid";
import TextOverlay from "./text/TextOverlay";
import TextUrlOverlay from "./textUrl/TextUrlOverlay";
import UrlOverlay from "./url/UrlOverlay";
import QnaResult from "./result/QnaResult";
import PollResult from "./result/PollResult";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "./../loader/Loader";

const GameView = () => {
  const { quizLink } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  // Retrieve sessionId from local storage or create a new one
  const sessionId = localStorage.getItem("sessionId") || uuidv4();
  if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", sessionId);
  }

  // Function to increase quiz impression
  const increaseImpression = useCallback(async (quizId) => {
    try {
      await axios.post(
        `https://quizcraft-gl9v.onrender.com/api/v1/analytics/increaseimpression/${quizId}`
      );
    } catch (error) {
      console.error("Failed to increase quiz impression", error);
    }
  }, []);

  useEffect(() => {
    async function getQuiz() {
      try {
        const response = await axios.get(
          `https://quizcraft-gl9v.onrender.com/api/v1/public/quiz/${quizLink}`
        );
        setQuizData(response.data.data);

        // Increase impression once when the quiz data is successfully fetched
        increaseImpression(response.data.data._id);
      } catch (error) {
        console.error(error);
      }
    }
    getQuiz();

    // Clear sessionId when the page is refreshed
    const handleBeforeUnload = () => {
      localStorage.removeItem("sessionId");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [quizLink, increaseImpression]);

  const handleNext = useCallback(async () => {
    if (currentQuestionIndex + 1 === quizData.questions.length) {
      setIsSubmitting(true);
      await handleSubmit(); // Ensure submission is handled
    } else {
      const question = quizData.questions[currentQuestionIndex];
      const answerData = {
        quizId: quizData._id,
        questionId: question._id,
        selectedOptionId: selectedOption || null, // Allow null if no option selected
        sessionId,
      };

      try {
        await axios.post(
          "https://quizcraft-gl9v.onrender.com/api/v1/public/quiz/start/",
          answerData
        );
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } catch (error) {
        console.error(error);
      }
    }
  }, [currentQuestionIndex, quizData, selectedOption, sessionId]);

  const handleSubmit = useCallback(async () => {
    const question = quizData.questions[currentQuestionIndex];
    const answerData = {
      quizId: quizData._id,
      questionId: question._id,
      selectedOptionId: selectedOption || null, // Allow null if no option selected
      sessionId,
    };

    try {
      const response = await axios.post(
        "https://quizcraft-gl9v.onrender.com/api/v1/public/quiz/start/",
        answerData
      );
      const { totalCorrect, totalQuestions } = response.data.data;
      setQuizCompleted(true);
      setResults({ totalCorrect, totalQuestions }); // Store the results
      setQuizCompleted(true);
      localStorage.removeItem("sessionId"); // Clear sessionId on submit
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false); // Ensure isSubmitting is reset
    }
  }, [currentQuestionIndex, quizData, selectedOption, sessionId]);

  const handleOptionClick = useCallback((optionId) => {
    setSelectedOption(optionId);
  }, []);

  if (quizCompleted) {
    return quizData.quizType === "Q&A" ? (
      <div className="game-view-container">
        <QnaResult results={results} />
      </div>
    ) : (
      <div className="game-view-container">
        <PollResult />
      </div>
    );
  }

  if (isSubmitting) {
    return <Loader />;
  }

  if (!quizData) return <Loader />;

  const question = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const currentQuestionNumber = currentQuestionIndex + 1;

  return (
    <div className="game-view-container">
      {question.optionType === "Text" && (
        <TextOverlay
          questionText={question.questionText}
          options={question.options}
          onOptionClick={handleOptionClick}
          timer={question.timer}
          currentQuestionNumber={currentQuestionNumber}
          totalQuestions={totalQuestions}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      )}
      {question.optionType === "Text and Image URL" && (
        <TextUrlOverlay
          questionText={question.questionText}
          options={question.options}
          onOptionClick={handleOptionClick}
          timer={question.timer}
          currentQuestionNumber={currentQuestionNumber}
          totalQuestions={totalQuestions}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      )}
      {question.optionType === "Image URL" && (
        <UrlOverlay
          questionText={question.questionText}
          options={question.options}
          onOptionClick={handleOptionClick}
          timer={question.timer}
          currentQuestionNumber={currentQuestionNumber}
          totalQuestions={totalQuestions}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default GameView;
