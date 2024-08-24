import React, { useEffect, useState } from "react";
import "./TrendingQuiz.css";
import axios from "axios";
import { Eye } from "../../../Icons/CustomIcons";
import QuizCard from "./QuizCard/QuizCard";
import { useAuth } from "../../../../context/AuthContext";
import Loader from "./../../../loader/Loader";

const TrendingQuiz = () => {
  const [trendingQuiz, setTrendingQuiz] = useState([]);
  const { loading, setLoadingState } = useAuth();
  useEffect(() => {
    async function fecthTrending() {
      try {
        setLoadingState(true);
        const trendingQuizList = await axios.get("/api/analytics/trendingquiz");
        setTrendingQuiz(trendingQuizList.data);
        setLoadingState(false);
      } catch (error) {
        console.error("Error fetching trending quizzes:", error);
      }
    }
    fecthTrending();
  }, []);

  // useEffect(() => {
  //   // console.log(trendingQuiz.data);
  //   if (trendingQuiz.data) {
  //     trendingQuiz.data.map((quiz) => console.log(quiz));
  //     // console.log("Trending Quiz", trendingQuiz.data);
  //   }
  // }, [trendingQuiz]);

  return (
    <div className="trending-quiz-container">
      {loading && <Loader />}
      <QuizCard trendingQuiz={trendingQuiz} />
    </div>
  );
};

export default TrendingQuiz;
