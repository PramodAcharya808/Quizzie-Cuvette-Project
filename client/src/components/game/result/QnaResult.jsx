import React from "react";

const QnaResult = () => {
  return (
    <div className="qna-result-container">
      <p className="congrats">Congrats Quiz is completed</p>
      <img src="/congrats-trophy.png" alt="" />
      <p className="score-display">
        Your score is <span>03/04</span>
      </p>
    </div>
  );
};

export default QnaResult;
