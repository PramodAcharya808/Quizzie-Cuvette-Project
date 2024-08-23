import React from "react";
import { useForm } from "react-hook-form";
import "./LoginForm.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/user/login", {
        email: data.email,
        password: data.password,
      });
      console.log(response.data.data.accessToken);

      if (response.data.status === 200) {
        toast.success("Login successful!");
        console.log(response.data.data);

        login(response.data.data);
        navigate("/dashboard");
      } else if (response.data.data.status > 400) {
        if (response.data.data.status == 404) {
          toast.error(response.data.data.message);
        }
        if (response.data.data.status === 401) {
          toast.error(response.data.data.message);
        }
      }
    } catch (error) {
      toast.error(
        "Login failed: " + error.response?.data?.message || error.message
      );
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <div className="input-group">
          <div className="input-field">
            <label className="form-label">Email:</label>
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
            <label className="form-label">Password:</label>
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
  );
}

export default LoginForm;
