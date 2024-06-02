import React, { useState, useEffect } from "react";
import { axiosGet } from "../../utils/methods";
import "../Styles/UserBookings.css";
import Header from "./Header";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const response = await axiosGet("/user-bookings/");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="user-bookings-container">
        <h1 className="user-bookings-heading">Your Bookings</h1>
        <br />
        <br />
        <div className="div-user-booking-items">
          {bookings.map((booking, index) => (
            <div key={index} className="user-booking-item">
              {booking.qr_code && (
                <img
                  src={booking.qr_code}
                  alt="QR Code"
                  className="user-booking-qrcode"
                />
              )}
              <div>
                <h1 className="user-booking-details-name">
                  {booking.event.name}
                </h1>
                <br />
                <h4 className="user-booking-details">
                  Rs.{booking.ticket_type.price} | {booking.ticket_type.name}
                </h4>
                <h5 className="user-booking-details">
                  <span>{booking.event.date} </span>
                </h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserBookings;
