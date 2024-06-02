import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import Header from "./Header";
import "../Styles/HomePage.css";
import { useNavigate } from "react-router-dom";
import { axiosGet } from "../../utils/methods";
import { useSelector } from "react-redux";

function HomePage() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuth } = useSelector((store) => store.user);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axiosGet(`/events/`)
      .then((response) => {
        console.log(response);
        const allEvents = response.data.events;
        setEvents(allEvents);
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axiosGet(`/events/search/?q=${searchQuery}`);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error searching events:", error);
      setLoading(false);
    }
  };

  const addEvent = () => {
    navigate("/addEvent");
  };
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  // const pastEvents = events.filter(event => new Date(event.date) < currentDate);
  // const upcomingEvents = events.filter(event => new Date(event.date) > currentDate);
  // const ongoingEvents = events.filter(event => new Date(event.date).toDateString() === currentDate.toDateString());

  const pastEvents = events?.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < currentDate;
  });

  console.log(pastEvents);

  const upcomingEvents = events?.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate > currentDate;
  });

  const ongoingEvents = events?.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === currentDate.getTime();
  });

  return (
    <div>
      <Header />
      <div id="header">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>
        {isAuth && <button onClick={addEvent}>Add Event</button>}
      </div>
      <div>
        {ongoingEvents.length !== 0 && (
          <div className="time-heading">
            <h1>Ongoing Events</h1>
          </div>
        )}
        <div id="events">
          {ongoingEvents.map((event) => (
            <EventCard key={event.id} eventId={event.id} />
          ))}
        </div>
        {upcomingEvents.length !== 0 && (
          <div className="time-heading">
            <h1>Upcoming Events</h1>
          </div>
        )}
        <div id="events">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} eventId={event.id} />
          ))}
        </div>
        {pastEvents.length !== 0 && (
          <div className="time-heading">
            <h1>Past Events</h1>
          </div>
        )}
        <div id="events">
          {pastEvents.map((event) => (
            <EventCard key={event.id} eventId={event.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default HomePage;
