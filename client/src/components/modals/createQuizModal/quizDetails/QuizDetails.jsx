import React, { useState } from "react";
import "./QuizDetails.css";
import { toast, ToastContainer } from "react-toastify";
import { Delete } from "../../../Icons/CustomIcons";

const QuizDetails = ({
  setShow,
  setNext,
  resetForm1,
  quizInfo,
  setQuizInfo,
}) => {
  const handleCancel = () => {
    setShow(false);
    setNext(false);
    resetForm1();
    setQuizInfo({});
  };

  const [questions, setQuestions] = useState([
    {
      text: "",
      options: [
        { text: "", imageUrl: "" },
        { text: "", imageUrl: "" },
      ],
    },
  ]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptionType, setSelectedOptionType] = useState("Text");
  const [selectedTimer, setSelectedTimer] = useState("OFF");
  const [correctAnswers, setCorrectAnswers] = useState([null]); // Track correct answers

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        {
          text: "",
          options: [
            { text: "", imageUrl: "" },
            { text: "", imageUrl: "" },
          ],
        },
      ]);
      setCorrectAnswers([...correctAnswers, null]); // Add null to correct answers for new question
      setSelectedQuestionIndex(questions.length);
    } else {
      toast.error("You can only add up to 5 questions.");
    }
  };

  const handleDeleteQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
      setCorrectAnswers(correctAnswers.filter((_, i) => i !== index)); // Update correct answers
      setSelectedQuestionIndex(Math.max(0, selectedQuestionIndex - 1));
    }
  };

  const handleAddOption = (questionIndex) => {
    if (questions[questionIndex].options.length < 4) {
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex].options.push({ text: "", imageUrl: "" });
      setQuestions(updatedQuestions);
    } else {
      toast.error("You can only add up to 4 options.");
    }
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    if (questions[questionIndex].options.length > 2) {
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setQuestions(updatedQuestions);
      if (correctAnswers[questionIndex] === optionIndex) {
        // Reset correct answer if the selected one is deleted
        const updatedCorrectAnswers = [...correctAnswers];
        updatedCorrectAnswers[questionIndex] = null;
        setCorrectAnswers(updatedCorrectAnswers);
      }
    }
  };

  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (e, questionIndex, optionIndex, field) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex][field] =
      e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const updatedCorrectAnswers = [...correctAnswers];
    updatedCorrectAnswers[questionIndex] = optionIndex;
    setCorrectAnswers(updatedCorrectAnswers);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
      <div className="poll-form">
        <div className="question-tabs">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`question-tab ${
                index === selectedQuestionIndex ? "active" : ""
              }`}
            >
              <span
                onClick={() => setSelectedQuestionIndex(index)}
                className="question-tab-span"
              >
                {index + 1}
              </span>
              {questions.length > 1 && (
                <button
                  className="delete-question-btn"
                  onClick={() => handleDeleteQuestion(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button className="add-question-btn" onClick={handleAddQuestion}>
            +
          </button>
          <p>Max 5 questions</p>
        </div>

        {questions.length > 0 && (
          <div className="question-block">
            <div className="question-header">
              <input
                type="text"
                placeholder="Q & A Question"
                className="question-input"
                value={questions[selectedQuestionIndex].text}
                onChange={(e) => handleQuestionChange(e, selectedQuestionIndex)}
              />
            </div>

            <div className="option-type-selector">
              <label>Option Type</label>
              <div>
                <input
                  type="radio"
                  id={`text-${selectedQuestionIndex}`}
                  name={`optionType${selectedQuestionIndex}`}
                  value="Text"
                  checked={selectedOptionType === "Text"}
                  onChange={(e) => setSelectedOptionType(e.target.value)}
                />
                <label htmlFor={`text-${selectedQuestionIndex}`}>Text</label>

                <input
                  type="radio"
                  id={`image-${selectedQuestionIndex}`}
                  name={`optionType${selectedQuestionIndex}`}
                  value="Image URL"
                  checked={selectedOptionType === "Image URL"}
                  onChange={(e) => setSelectedOptionType(e.target.value)}
                />
                <label htmlFor={`image-${selectedQuestionIndex}`}>
                  Image URL
                </label>

                <input
                  type="radio"
                  id={`textImage-${selectedQuestionIndex}`}
                  name={`optionType${selectedQuestionIndex}`}
                  value="Text & Image URL"
                  checked={selectedOptionType === "Text & Image URL"}
                  onChange={(e) => setSelectedOptionType(e.target.value)}
                />
                <label htmlFor={`textImage-${selectedQuestionIndex}`}>
                  Text & Image URL
                </label>
              </div>
            </div>

            <div className="options-selector">
              {questions[selectedQuestionIndex].options.map(
                (option, optIndex) => (
                  <div key={optIndex} className="option">
                    <input
                      type="radio"
                      name={`correctAnswer${selectedQuestionIndex}`}
                      checked={
                        correctAnswers[selectedQuestionIndex] === optIndex
                      }
                      onChange={() =>
                        handleCorrectAnswerChange(
                          selectedQuestionIndex,
                          optIndex
                        )
                      }
                    />
                    {selectedOptionType === "Text & Image URL" ? (
                      <>
                        <input
                          type="text"
                          id="textInput"
                          placeholder="Text"
                          className="option-input"
                          value={option.text}
                          onChange={(e) =>
                            handleOptionChange(
                              e,
                              selectedQuestionIndex,
                              optIndex,
                              "text"
                            )
                          }
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          id="imageUrlInput"
                          className="option-input"
                          value={option.imageUrl}
                          onChange={(e) =>
                            handleOptionChange(
                              e,
                              selectedQuestionIndex,
                              optIndex,
                              "imageUrl"
                            )
                          }
                        />
                      </>
                    ) : (
                      <input
                        type="text"
                        placeholder={
                          selectedOptionType === "Image URL"
                            ? "Image URL"
                            : "Text"
                        }
                        className="option-input"
                        value={
                          selectedOptionType === "Image URL"
                            ? option.imageUrl
                            : option.text
                        }
                        onChange={(e) =>
                          handleOptionChange(
                            e,
                            selectedQuestionIndex,
                            optIndex,
                            selectedOptionType === "Image URL"
                              ? "imageUrl"
                              : "text"
                          )
                        }
                      />
                    )}
                    {questions[selectedQuestionIndex].options.length > 2 && (
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteOption(selectedQuestionIndex, optIndex)
                        }
                      >
                        <Delete />
                      </button>
                    )}
                  </div>
                )
              )}
              <button
                className="add-option-btn"
                onClick={() => handleAddOption(selectedQuestionIndex)}
              >
                Add option
              </button>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="create-quiz-btn">Create Quiz</button>
        </div>

        <div className="timer-section">
          <label>Timer</label>
          <div className="timer-options">
            <button
              className={`timer-btn ${
                selectedTimer === "OFF" ? "selected" : ""
              }`}
              onClick={() => setSelectedTimer("OFF")}
            >
              OFF
            </button>
            <button
              className={`timer-btn ${
                selectedTimer === "5 sec" ? "selected" : ""
              }`}
              onClick={() => setSelectedTimer("5 sec")}
            >
              5 sec
            </button>
            <button
              className={`timer-btn ${
                selectedTimer === "10 sec" ? "selected" : ""
              }`}
              onClick={() => setSelectedTimer("10 sec")}
            >
              10 sec
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizDetails;
