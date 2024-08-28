import React, { useEffect, useState } from "react";

const UrlOverlay = ({
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
    // Reset the timer only if it's greater than 0 and the timer value has changed
    if (timer > 0) {
      setTimeLeft(timer); // Initialize the timer with the new value
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

      // Cleanup function to clear the interval on component unmount or when timer changes
      return () => clearInterval(id);
    }
  }, [timer, onNext]);

  // Effect to handle updates when question changes
  useEffect(() => {
    setTimeLeft(timer); // Reset timer when question changes
  }, [timer, currentQuestionNumber]);

  return (
    <div className="question-overlay">
      <div className="numerics">
        <p className="question-num">{`${currentQuestionNumber
          .toString()
          .padStart(2, "0")}/${totalQuestions.toString().padStart(2, "0")}`}</p>
        {timeLeft > 0 && <p className="question-timer">{`00:${timeLeft}s`}</p>}
      </div>
      <p className="question-text-holder">{questionText}</p>
      <div className="url-game-container">
        {options.map((option) => (
          <div
            key={option._id}
            className={`url-option-holder ${
              option.selected ? "game-selected" : ""
            }`}
            onClick={() => onOptionClick(option._id)}
          >
            <img
              src={option.imageURL || "https://picsum.photos/400/500"}
              alt="Option"
            />
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

export default UrlOverlay;
