import React from "react";

const UrlOverlay = () => {
  return (
    <div className="question-overlay">
      <div className="numerics">
        <p className="question-num">01/04</p>
        <p className="question-timer">00:10s</p>
      </div>

      <p className="question-text-holder">
        Your question text comes here, its a sample text.
      </p>

      <div className="url-game-container">
        <div className="url-option-holder game-selected">
          <img src="https://picsum.photos/400/500" alt="" />
        </div>
        <div className="url-option-holder">
          <img src="https://picsum.photos/400/500" alt="" />
        </div>
        <div className="url-option-holder">
          <img src="https://picsum.photos/400/500" alt="" />
        </div>
        <div className="url-option-holder">
          <img src="https://picsum.photos/400/500" alt="" />
        </div>
      </div>
      <button className="game-continue-btn game-url-continue-btn">NEXT</button>
    </div>
  );
};

export default UrlOverlay;
