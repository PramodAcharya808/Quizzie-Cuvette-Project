import React, { useState } from "react";
import "./LoginSignup.css";
import "../../styles/global.style.css";
import SignupForm from "./signup/SignupForm";
import LoginForm from "./login/LoginForm";

const LoginSignup = () => {
  const [isActive, setActive] = useState("signup");
  const handleToggle = (tab) => {
    setActive(tab);
  };
  return (
    <div className="container bg-primary">
      <div className="inner-container bg-secondary box-shadow-2">
        <h1 className="logo secondary-font">QUIZZIE</h1>
        <div className="selector">
          <button
            className={`tab ${
              isActive === `signup` ? `box-shadow-1` : ``
            } text-primary`}
            onClick={() => {
              handleToggle(`signup`);
            }}
          >
            Sign Up
          </button>
          <button
            className={`tab ${
              isActive === `login` ? `box-shadow-1` : ``
            } text-primary`}
            onClick={() => {
              handleToggle(`login`);
            }}
          >
            Log In
          </button>
        </div>
        {isActive === "signup" ? <SignupForm /> : <LoginForm />}
      </div>
    </div>
  );
};

export default LoginSignup;
