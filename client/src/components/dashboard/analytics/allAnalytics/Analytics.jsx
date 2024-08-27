import React, { useEffect, useState } from "react";
import "./Analytics.css";
import { Link } from "react-router-dom";
import { Delete, Edit, Share } from "./../../../Icons/CustomIcons";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../../modals/deleteModal/DeleteModal";
import UpdateQuizModal from "../../../modals/editQuizModal/quizNameType/UpdateQuizModal";

function Analytics() {
  const [allQuizList, setAllQuizList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = async (quizId) => {
    try {
      await axios.delete(`/api/quiz/delete/${quizId}`);
      const updatedQuizzes = await axios.get("/api/quiz/getAllQuiz");
      setAllQuizList(updatedQuizzes.data.data);
      toast.success("Quiz deleted successfully");
    } catch (error) {
      console.log(error);
    }
    setShowModal(false);
  };

  const handleShare = (quizLink) => {
    const quizUrl = `http://localhost:5173/publicquiz/${quizLink}`;
    try {
      navigator.clipboard.writeText(quizUrl);
      toast.success("Quiz link copied to clipboard");
    } catch (error) {
      toast.error("Error. Cant copy to clipboard");
    }
  };

  const handleEditClick = (quizId) => {
    setSelectedQuizId(quizId);
    setShowUpdateModal(true);
  };

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

  console.log(allQuizList);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
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
                    <button
                      className="action-button edit"
                      onClick={() => handleEditClick(quiz._id)} // Pass the quiz ID
                    >
                      <Edit />
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => handleDeleteClick()}
                    >
                      <Delete />
                    </button>
                    <button
                      className="action-button share"
                      onClick={() => handleShare(quiz.quizLink)}
                    >
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
                  <DeleteModal
                    show={showModal}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmDelete}
                    quizId={quiz._id}
                  />
                </tr>
              ))}
            </tbody>
          </table>
          {allQuizList.length === 0 && (
            <p className="no-quiz-message">No quizzes to display</p>
          )}
        </div>
      </div>
      <UpdateQuizModal
        show={showUpdateModal}
        setShow={setShowUpdateModal}
        quizId={selectedQuizId} // Pass the selected quiz ID to the modal
      />
    </>
  );
}

export default Analytics;
