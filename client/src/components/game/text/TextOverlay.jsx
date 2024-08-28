import React, { useEffect, useState } from "react";

const TextOverlay = ({
  questionText,
  options,
  onOptionClick,
  timer,
  currentQuestionNumber,
  totalQuestions,
  onNext,
  onSubmit,
}) => {
  const [timeLeft, setTimeLeft] = useState(timer);
  const isLastQuestion = currentQuestionNumber === totalQuestions;

  useEffect(() => {
    // Start timer only if timer value is greater than 0
    if (timer > 0) {
      // Clear existing interval on component unmount or when timer changes
      const id = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(id);
            if (onNext) onNext(); // Automatically move to the next question when timer runs out
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      // Cleanup function
      return () => clearInterval(id);
    }
  }, [timer, onNext]);

  useEffect(() => {
    setTimeLeft(timer); // Reset timeLeft when timer changes
  }, [timer]);

  return (
    <div className="question-overlay">
      <div className="numerics">
        <p className="question-num">{`${currentQuestionNumber
          .toString()
          .padStart(2, "0")}/${totalQuestions.toString().padStart(2, "0")}`}</p>
        {timeLeft > 0 && <p className="question-timer">{`00:${timeLeft}s`}</p>}
      </div>
      <p className="question-text-holder">
        {questionText} {/* Display the question text */}
      </p>
      <div className="game-options-container">
        {options.map((option) => (
          <div
            key={option._id}
            className={`text-option-holder ${
              option.selected ? "selected" : ""
            }`}
            onClick={() => onOptionClick(option._id)}
          >
            {option.optionText}
          </div>
        ))}
      </div>
      <button
        className="text-game-continue-btn"
        onClick={isLastQuestion ? onSubmit : onNext}
      >
        {isLastQuestion ? "SUBMIT" : "NEXT"}
      </button>
    </div>
  );
};

export default TextOverlay;
