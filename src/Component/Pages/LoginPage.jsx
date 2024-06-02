import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Login.css";
import Header from "./Header";
import { useSnackbar } from "notistack";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login/", {
        username,
        password,
      });
      console.log(response.data);
      enqueueSnackbar("Login Successfull", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      navigate("/home");
    } catch (error) {
      enqueueSnackbar("Invalid Credentials", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      console.error("Login failed:", error.response.data);
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" id="login-button">
            Login
          </button>
        </form>
        <Link to="/register" id="create-account-link">
          Create Account
        </Link>
        <Link to="/forgot-password" id="forgot-password-link">
          Forgot Password
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
