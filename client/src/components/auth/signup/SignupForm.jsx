import React from "react";
import { useForm } from "react-hook-form";
import "./SignupForm.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignupForm({ setActive }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleToggle = () => {
    setActive("login");
  };

  const confirmPassword = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/user/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      console.log(response.data);

      if (response.status === 201) {
        toast.success("Account created!");
        handleToggle();
      } else if (response.data.statusCode === 500) {
        toast.warn("Email already exists!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
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
          <div className={`error ${errors.confirmPassword ? "show" : ""}`}>
            {errors.confirmPassword && errors.confirmPassword.message}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Sign-Up
        </button>
      </form>
    </>
  );
}

export default SignupForm;
