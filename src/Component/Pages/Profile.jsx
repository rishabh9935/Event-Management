import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { logout, setUser } from "../../slices/user";
import { axiosGet, axiosPost } from "../../utils/methods";
import { useNavigate } from "react-router-dom";
import "../Styles/Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const { isAuth } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axiosGet("/check-auth");
        if (response.data.isAuthenticated) {
          dispatch(setUser(response.data.user));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }
    };

    checkAuthStatus();
  }, [dispatch]);
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axiosGet("/api/getUser/");
      const data = await response.data;
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosPost("/api/logout/");
      console.log(isAuth, "------");
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      dispatch(logout);
      navigate("/");
    } catch (error) {
      console.error("error:", error);
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <p>
        <strong>Username:</strong> {userData.username}
      </p>
      <p>
        <strong>Email:</strong> {userData.email}
      </p>
      <button onClick={handleLogout}>Logout</button>
      <br />
      <button onClick={handleChangePassword}>Change Password</button>
    </div>
  );
};

export default Profile;
