import React from "react";

const TextOverlay = () => {
  return (
    <div className="question-overlay">
      <div className="numerics">
        <p className="question-num">01/04</p>
        <p className="question-timer">00:10s</p>
      </div>

      <p className="question-text-holder">
        Your question text comes here, its a sample text.
      </p>

      <div className="game-options-container">
        <div className="text-option-holder selected">Option 1</div>
        <div className="text-option-holder">Option 2</div>
        <div className="text-option-holder">Option 3</div>
        <div className="text-option-holder">Option 4</div>
      </div>
      <button className="game-continue-btn">NEXT</button>
    </div>
  );
};

export default TextOverlay;
