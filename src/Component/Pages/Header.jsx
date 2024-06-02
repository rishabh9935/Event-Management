import { React, useEffect, useState } from "react";
import "../Styles/Header.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, setUser } from "../../slices/user";
import { axiosGet } from "../../utils/methods";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});

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

  const handleProfile = () => {
    navigate("/profile");
  };

  const renderButton = () => {
    if (location.pathname === "/" || location.pathname === "/register") {
      return (
        <button>
          {location.pathname === "/" ? (
            <Link to="/register">Register</Link>
          ) : (
            <Link to="/">Log in</Link>
          )}
        </button>
      );
    }
    console.log(isAuth);
    return isAuth ? (
      <div>
        {" "}
        <li>
          <a href="#" onClick={handleBookings}>
            My Bookings
          </a>
        </li>
        <li>
          <a href="#" onClick={handleDonor}>
            Add Donor
          </a>
        </li>
        <li>
          <FaUser className="user-icon" onClick={handleProfile} />
          <span className="user-icon" onClick={handleProfile}>
            {userData.username}
          </span>
        </li>
      </div>
    ) : (
      <button>
        <Link to="/">Login</Link>
      </button>
    );
  };

  const handleBookings = () => {
    navigate("/user_bookings");
  };

  const handleDonor = () => {
    navigate("/add-donor");
  };

  const naviHome = () => {
    navigate(`/home`);
  };

  return (
    <div className="header">
      <div className="left">
        <h1 onClick={naviHome} className="appName">
          The Event Hub
        </h1>
      </div>
      <div className="right">
        <ul>
          <li>{renderButton()}</li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
