import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../Styles/ResetPasswordPage.css";

const ResetPasswordPage = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(uidb64, token);
    try {
      const response = await axios.post(`/reset-password/`, {
        uidb64: uidb64,
        token: token,
        new_password: newPassword,
      });
      setSuccessMessage(response.data.message);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error resetting password. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-heading">Reset Password</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <label htmlFor="newPassword" className="reset-password-label">
          New Password:
        </label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="reset-password-input"
        />
        <button type="submit" className="reset-password-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
