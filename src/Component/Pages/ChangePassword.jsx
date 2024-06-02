import React, { useState } from "react";
import { axiosPost } from "../../utils/methods";
import { useNavigate } from "react-router-dom";
import "../Styles/ChangePassword.css";
import { useSnackbar } from "notistack";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      try {
        const response = await axiosPost("/api/change_password/", {
          old_password: oldPassword,
          new_password: newPassword,
        });
        // alert("Password Changed");
        enqueueSnackbar("Password Changed", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        navigate("/home");
        console.log(response.data.message);
      } catch (error) {
        setError(error.response.data.error);
      }
    } else {
      alert("Confirm Password and New Password is not same");
      enqueueSnackbar("Confirm Password and New Password is not same", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  return (
    <div className="change-password-container">
      <h2 className="change-password-title">Change Password</h2>
      <form className="change-password-form" onSubmit={handleSubmit}>
        <input
          className="change-password-input"
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          className="change-password-input"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          className="change-password-input"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="change-password-button" type="submit">
          Change Password
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default ChangePassword;
