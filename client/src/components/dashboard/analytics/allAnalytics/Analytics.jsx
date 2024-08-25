import React, { useEffect, useState } from "react";
import "./Analytics.css";
import { Link } from "react-router-dom";
import { Delete, Edit, Share } from "./../../../Icons/CustomIcons";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { toast, ToastContainer } from "react-toastify";

function Analytics() {
  const [allQuizList, setAllQuizList] = useState([]);

  function formatDate(date) {
    return format(parseISO(date), "dd MMM, yyyy");
  }

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  }

  useEffect(() => {
    async function fetchAllQuiz() {
      const response = await axios.get("/api/quiz/getAllQuiz");
      setAllQuizList(response.data.data);
    }
    fetchAllQuiz();
  }, []);

  const onDeleteHandler = async (quizId) => {
    try {
      await axios.delete(`/api/quiz/delete/${quizId}`);
      const updatedQuizzes = await axios.get("/api/quiz/getAllQuiz");
      setAllQuizList(updatedQuizzes.data.data);
      toast.success("Quiz deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  console.log(allQuizList);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="analytics-container">
        <div className="analytics-top-container">
          <h1 className="analytics-heading">Quiz Analysis</h1>
        </div>
        <div className="analytics-bottom-container">
          <table>
            <thead className="bg-dark-blue">
              <tr>
                <th className="left-corner">S.No</th>
                <th>Quiz Name</th>
                <th>Created on</th>
                <th>Impression</th>
                <th>Actions</th>
                <th className="right-corner">Analysis</th>
              </tr>
            </thead>
            <tbody>
              {allQuizList.map((quiz, index) => (
                <tr
                  key={quiz._id}
                  className={index % 2 !== 0 ? `bg-light-blue` : ""}
                >
                  <td className="left-corner">{index + 1}</td>
                  <td>{quiz.quizName}</td>
                  <td>{formatDate(quiz.createdAt)}</td>
                  <td>{formatNumber(quiz.impressions)}</td>
                  <td>
                    <button className="action-button edit">
                      <Edit />
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => onDeleteHandler(quiz._id)}
                    >
                      <Delete />
                    </button>
                    <button className="action-button share">
                      <Share />
                    </button>
                  </td>
                  <td className="right-corner">
                    <Link
                      to={
                        quiz.quizType === "POLL"
                          ? `/dashboard/getpollanalytics/${quiz._id}`
                          : `/dashboard/questionanalytics/${quiz._id}`
                      }
                    >
                      Question Wise Analysis
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allQuizList.length === 0 && (
            <p className="no-quiz-message">No quizzes to display</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Analytics;
