import React from "react";

const TextUrlOverlay = () => {
  return (
    <div className="question-overlay">
      <div className="numerics">
        <p className="question-num">01/04</p>
        <p className="question-timer">00:10s</p>
      </div>

      <p className="question-text-holder">
        Your question text comes here, its a sample text.
      </p>

      <div className="texturl-game-container">
        <div className="texturl-option-holder game-selected">
          <div className="text-url-text">Option 1</div>
          <div className="texturl-image">
            <img src="https://picsum.photos/400/500" alt="No Image" />
          </div>
        </div>
        <div className="texturl-option-holder">
          <div className="text-url-text">Option 1</div>
          <div className="texturl-image">
            <img src="https://picsum.photos/400/500" alt="" />
          </div>
        </div>{" "}
        <div className="texturl-option-holder ">
          <div className="text-url-text">Option 1</div>
          <div className="texturl-image">
            <img src="https://picsum.photos/400/500" alt="" />
          </div>
        </div>{" "}
        <div className="texturl-option-holder ">
          <div className="text-url-text">Option 1</div>
          <div className="texturl-image">
            <img src="https://picsum.photos/400/500" alt="" />
          </div>
        </div>
      </div>
      <button className="game-continue-btn game-url-continue-btn">NEXT</button>
    </div>
  );
};

export default TextUrlOverlay;
