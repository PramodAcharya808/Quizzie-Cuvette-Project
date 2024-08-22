import React, { useState } from "react";
import "./App.css";

function App() {
  const [isSignup, setIsSignup] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = isSignup && !form.name ? "Invalid name" : "";
    tempErrors.email = !/\S+@\S+\.\S+/.test(form.email) ? "Invalid email" : "";
    tempErrors.password = form.password.length < 6 ? "Weak password" : "";
    tempErrors.confirmPassword =
      form.password !== form.confirmPassword ? "Password doesn't match" : "";
    setErrors(tempErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validate();
    if (Object.values(errors).every((x) => x === "")) {
      console.log("Form is valid");
      // Proceed with submitting form data
    }
  };

  return (
    <div className="App">
      <div>
        <button onClick={() => setIsSignup(true)}>Sign Up</button>
        <button onClick={() => setIsSignup(false)}>Log In</button>
      </div>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />
        {errors.email && <div className="error">{errors.email}</div>}
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />
        {errors.password && <div className="error">{errors.password}</div>}
        {isSignup && (
          <>
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className="error">{errors.confirmPassword}</div>
            )}
          </>
        )}
        <button type="submit">{isSignup ? "Sign-Up" : "Log In"}</button>
      </form>
    </div>
  );
}

export default App;
