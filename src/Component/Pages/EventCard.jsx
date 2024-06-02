import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/EventCard.css";
import { axiosDelete, axiosGet } from "../../utils/methods";

function EventCard({ eventId }) {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [host, setHost] = useState();

  useEffect(() => {
    fetchEvent();
    fetchHost();
  }, [eventId]);

  const fetchHost = async () => {
    try {
      const response = await axiosGet(`/events/${eventId}/host/`);
      setHost(response.data.username);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchEvent = () => {
    axios
      .get(`/events/${eventId}/`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
      });
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  const imageUrl = event.photo
    ? event.photo
    : "https://via.placeholder.com/150";
  console.log(imageUrl);

  const handleUpdate = async () => {
    navigate(`/UpdateEvent/${eventId}`);
  };

  const handleDelete = async () => {
    try {
      await axiosDelete(`/events/${event.id}/delete/`);

      // Optionally, add logic to update UI after deletion
    } catch (error) {
      console.error(error);
    }
  };
  console.log(event.is_private, "sndabkd");

  return (
    <div className="card">
      <img src={imageUrl} className="card-img-top" alt={event.name} />
      <div className="card-body">
        <h5 className="card-title">
          <a href={`/event_details/${event.id}`} className="card-link">
            {event.name}
          </a>
        </h5>
        <p className="card-text">
          <span className="Headings">Description : </span> {event.description}
        </p>
        <p className="card-text">
          <span className="Headings">Date: </span> {event.date}
        </p>
        <p className="card-text">
          <span className="Headings">Created By: </span> {host}
        </p>
        {event.is_private ? (
          <p className="card-text">
            <span className="Headings">Type: </span> Private
          </p>
        ) : (
          <p className="card-text">
            <span className="Headings">Type: </span>Public
          </p>
        )}
      </div>
    </div>
  );
}

export default EventCard;
