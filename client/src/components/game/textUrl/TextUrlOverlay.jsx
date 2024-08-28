import React, { useEffect, useState } from "react";

const TextUrlOverlay = ({
  questionText, // Added to display question text
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
    if (timer > 0) {
      setTimeLeft(timer);
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
      return () => clearInterval(id); // Cleanup on component unmount or when timer changes
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
      <div className="texturl-game-container">
        {options.map((option) => (
          <div
            key={option._id}
            className={`texturl-option-holder ${
              option.selected ? "game-selected" : ""
            }`}
            onClick={() => onOptionClick(option._id)}
          >
            <div className="text-url-text">{option.optionText}</div>
            <div className="texturl-image">
              <img
                src={option.imageURL || "https://picsum.photos/400/500"}
                alt="Option"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        className="game-continue-btn game-url-continue-btn"
        onClick={isLastQuestion ? onSubmit : onNext}
      >
        {isLastQuestion ? "SUBMIT" : "NEXT"}
      </button>
    </div>
  );
};

export default TextUrlOverlay;
