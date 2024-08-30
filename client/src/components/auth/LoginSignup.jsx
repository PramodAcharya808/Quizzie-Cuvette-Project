import React, { useState } from "react";
import "./LoginSignup.css";
import "../../styles/global.style.css";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import Loader from "../loader/Loader";
import toastr from "toastr";
import { useNavigate } from "react-router-dom"; // Make sure to import useNavigate

const LoginSignup = () => {
  const [isActive, setActive] = useState("signup");
  const handleToggle = (tab) => {
    setActive(tab);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const confirmPassword = watch("password");
  const { login, setLoadingState, loading } = useAuth();
  const navigate = useNavigate(); // Use useNavigate to navigate after login

  const onSignup = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/signup",
        {
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }
      );
      console.log(response.data);

      if (response.status === 201) {
        toastr.success("Account created!");
      } else if (response.data.statusCode === 500) {
        toastr.error("Email already exists!");
      }
    } catch (error) {
      console.log(error);
      toastr.error(error.message);
    }
  };

  const onLogin = async (data) => {
    try {
      setLoadingState(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        {
          email: data.email,
          password: data.password,
        }
      );
      console.log(response.data.data.accessToken);

      setLoadingState(false);

      if (response.status === 200) {
        toastr.success("Login successful!");
        login(response.data.data); // Pass the entire data object to the login function
        navigate("/dashboard"); // Redirect to the dashboard after successful login
      } else if (response.data.data.status > 400) {
        if (response.data.data.status == 404) {
          toastr.error(response.data.data.message);
        }
        if (response.data.data.status === 401) {
          toastr.error(response.data.data.message);
        }
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    }
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

        {isActive === "signup" && (
          <>
            <form onSubmit={handleSubmit(onSignup)} className="signup-form">
              <div className="input-group">
                <div className="input-field">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    style={{ borderColor: errors.name ? "red" : "" }}
                    {...register("name", { required: "Invalid Name" })}
                  />
                </div>
                <div className={`error ${errors.name ? "show" : ""}`}>
                  {errors.name && errors.name.message}
                </div>
              </div>

              <div className="input-group">
                <div className="input-field">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    style={{ borderColor: errors.email ? "red" : "" }}
                    {...register("email", { required: "Invalid Email" })}
                  />
                </div>
                <div className={`error ${errors.email ? "show" : ""}`}>
                  {errors.email && errors.email.message}
                </div>
              </div>

              <div className="input-group">
                <div className="input-field">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    style={{ borderColor: errors.password ? "red" : "" }}
                    {...register("password", {
                      required: "Password must be 6 to 24 characters",
                      minLength: {
                        value: 6,
                        message: "Must be at least 6 characters",
                      },
                      maxLength: {
                        value: 24,
                        message: "Cannot exceed 24 characters",
                      },
                    })}
                  />
                </div>
                <div className={`error ${errors.password ? "show" : ""}`}>
                  {errors.password && errors.password.message}
                </div>
              </div>

              <div className="input-group">
                <div className="input-field">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    style={{ borderColor: errors.confirmPassword ? "red" : "" }}
                    {...register("confirmPassword", {
                      validate: (value) =>
                        value === confirmPassword || "Passwords don't match",
                    })}
                  />
                </div>
                <div
                  className={`error ${errors.confirmPassword ? "show" : ""}`}
                >
                  {errors.confirmPassword && errors.confirmPassword.message}
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Sign-Up
              </button>
            </form>
          </>
        )}

        {isActive === "login" && (
          <>
            {loading && <Loader />}
            <form onSubmit={handleSubmit(onLogin)} className="signup-form">
              <div className="input-group">
                <div className="input-field">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    style={{ borderColor: errors.email ? "red" : "" }}
                    {...register("email", { required: "Please enter email" })}
                  />
                </div>
                <div className={`error ${errors.email ? "show" : ""}`}>
                  {errors.email && errors.email.message}
                </div>
              </div>

              <div className="input-group">
                <div className="input-field">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    style={{ borderColor: errors.password ? "red" : "" }}
                    {...register("password", {
                      required: "Please enter password",
                    })}
                  />
                </div>
                <div className={`error ${errors.password ? "show" : ""}`}>
                  {errors.password && errors.password.message}
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Log In
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
