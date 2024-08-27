import React from "react";
import "./GameView.css";
import "./GameViewMediaQuery.css";
import { v4 as uuidv4 } from "uuid";
import TextOverlay from "./text/TextOverlay";
import TextUrlOverlay from "./textUrl/TextUrlOverlay";
import UrlOverlay from "./url/UrlOverlay";

const GameView = () => {
  const sessionId = uuidv4();
  console.log(sessionId);

  return (
    <div className="game-view-container">
      {/* <TextOverlay /> */}
      {/* <UrlOverlay /> */}
      <TextUrlOverlay />
    </div>
  );
};

export default GameView;
