import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/DetailedEventPage.css";
import { axiosDelete, axiosGet, axiosPost } from "../../utils/methods";
import Header from "./Header";
import { useSnackbar } from "notistack";

function DetailedEventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState();
  const navigate = useNavigate();
  const [myRole, setMyRole] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [ticketBooked, setTicketBooked] = useState(false);
  const [highestBid, setHighestBid] = useState(null);
  const [isEventOver, setIsEventOver] = useState(false);
  const [raffleWinner, setRaffleWinner] = useState(null);
  const [host, setHost] = useState();
  const { enqueueSnackbar } = useSnackbar();

  async function getRole() {
    const resp = await axiosGet(`/events/${eventId}/role/`);
    setMyRole(resp.data.role);
  }

  useEffect(() => {
    getRole();
  }, []);

  useEffect(() => {
    fetchTicketTypes();
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

  const fetchTicketTypes = async () => {
    try {
      const response = await axiosGet(`/events/${eventId}/ticket-types/`);
      setTicketTypes(response.data);
    } catch (error) {
      console.log("Failed to fetch ticket types.");
    }
  };

  useEffect(() => {
    fetchEvent();
    fetchUserBid();
  }, []);

  const fetchEvent = () => {
    axiosGet(`/events/${eventId}/`)
      .then((response) => {
        setEvent(response.data);
        const eventDate = new Date(response.data.date);
        const eventYear = eventDate.getFullYear();
        const eventMonth = eventDate.getMonth();
        const eventDay = eventDate.getDate();

        const eventDateTime = new Date(eventYear, eventMonth, eventDay);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();

        const currentDateTime = new Date(currentYear, currentMonth, currentDay);

        if (eventDateTime < currentDateTime) {
          setIsEventOver(true);
          fetchHighestBid();
          fetchRaffleWinner();
        }
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
      });
  };

  const fetchRaffleWinner = async () => {
    try {
      const response = await axiosGet(`/events/${eventId}/raffle/`);
      setRaffleWinner(response.data.user_name);
    } catch (error) {
      console.error("Error fetching raffle winner:", error);
    }
  };

  const fetchUserBid = async () => {
    const response = await axiosGet(`/events/${eventId}/bid/`)
      .then((response) => {
        if (response.data && response.data.bid) {
          setBidAmount(response.data.bid);
          setBidSubmitted(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching user bid:", error);
      });
  };

  const fetchHighestBid = () => {
    axiosGet(`/events/${eventId}/highestbid/`)
      .then((response) => {
        setHighestBid(response.data);
        console.log("Yooooooooo");
        console.log(response.data);
        console.log("Yooooooooo");
      })
      .catch((error) => {
        console.error("Error fetching highest bid:", error);
      });
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  const handleUpdate = async () => {
    navigate(`/UpdateEvent/${eventId}`);
  };

  const handleDelete = async () => {
    try {
      await axiosDelete(`/api/events/${event.id}/delete/`);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookTicket = (ticketTypeId) => {
    axiosPost(`/events/${eventId}/ticket-types/${ticketTypeId}/book/`)
      .then((response) => {
        console.log("Ticket booked successfully");
        setTicketBooked(true);
        // alert("Ticket booked successfully");
        enqueueSnackbar("Ticket booked successfully!", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      })
      .catch((error) => {
        console.error("Error booking ticket:", error);
        // alert("Failed to book ticket");
        enqueueSnackbar("Failed to book ticket!", {
          variant: "error",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      });
  };

  const handleAddTicketType = () => {
    navigate(`/ticket_type/${eventId}`);
  };

  const handleRole = () => {
    navigate(`/addRole/${eventId}`);
  };
  const inviteAttendees = () => {
    navigate(`/invite_attendees/${eventId}`);
  };

  const imageUrl = event.photo
    ? event.photo
    : "https://via.placeholder.com/150";

  const handleFeedback = () => {
    navigate(`/feedback/${eventId}`);
  };
  const handleAnnouncement = () => {
    navigate(`/chat/${eventId}`);
  };

  const handleInviteDonor = () => {
    navigate(`/donor-list/${eventId}`);
  };

  const handleBidChange = (event) => {
    setBidAmount(event.target.value);
  };

  const handleBidSubmit = async () => {
    try {
      await axiosPost(`/events/${eventId}/bid/`, { bid: bidAmount });
      // alert('Bid submitted successfully!');
      enqueueSnackbar("Bid submitted successfully!", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });

      setBidSubmitted(true);
    } catch (error) {
      console.error("Error submitting bid:", error);
      // alert('Failed to submit bid. Please try again.');
      enqueueSnackbar("Failed to submit bid. Please try again.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  return (
    <div>
      <Header />
      <div className="detailed-event">
        <img src={imageUrl} className="detailed-event-img" alt={event.name} />
        <div className="detailed-event-info">
          <h3>Event Name : {event.name}</h3>
          <p></p>
          <p>
            <span className="Headings">Description : </span>
            {event.description}
          </p>
          <p>
            <span className="Headings">Date : </span>
            {event.date}
          </p>
          {event.is_private ? (
            <p>
              <span className="Headings">Type: </span> Private
            </p>
          ) : (
            <p>
              <span className="Headings">Type: </span>Public
            </p>
          )}
          <p>
            <span className="Headings">Created By : </span>
            {host}
          </p>
          <p>
            <span className="Headings">Details : </span>
            {event.details}
          </p>
          <p>
            <span className="Headings">Bidding Item : </span>
            {event.bidItem}
          </p>

          <br />
          <br />
          {bidAmount && bidAmount !== null && (
            <div className="user-bid">
              <p>Your last bid: ${bidAmount}</p>
            </div>
          )}
          {/* Display highest bid and winner's username */}
          {highestBid && (
            <div className="highest-bid">
              <p>
                Highest Bid: ${highestBid.bid} (Winner: {highestBid.user_name})
              </p>
            </div>
          )}
          {myRole === "Attendees" && !bidSubmitted && !isEventOver && (
            <div className="add-bid-input">
              <input
                type="number"
                value={bidAmount}
                onChange={handleBidChange}
                placeholder="Enter bid amount"
              />
              <button onClick={handleBidSubmit}>Submit Bid</button>
            </div>
          )}
          <br />
          <br />
          <br />
          <br />
          {event.is_raffle && (
            <div>
              {raffleWinner ? (
                <p>The raffle winner is: {raffleWinner}</p>
              ) : (
                <p>Waiting to select raffle winner...</p>
              )}
            </div>
          )}
          <br />
          <div>
            {ticketTypes && ticketTypes.length !== 0 && <h2>Ticket Types</h2>}
            <div className="ticket-types">
              {ticketTypes &&
                ticketTypes.map((ticket) => (
                  <div key={ticket.id} className="ticket-card">
                    <h3>{ticket.name}</h3>
                    <p>
                      <strong>Price:</strong> {ticket.price}
                    </p>
                    <div className="book-now">
                      {!ticketBooked &&
                        !isEventOver &&
                        myRole != "Host" &&
                        myRole != "Organiser" &&
                        myRole != "Attendees" &&
                        myRole != "Volunteer" && (
                          <button
                            className="btn btn-success"
                            onClick={() => handleBookTicket(ticket.id)}
                          >
                            Book Now
                          </button>
                        )}
                    </div>
                  </div>
                ))}
            </div>
            <br />
            <br />
            <br />
            <div className="event-actions">
              {!isEventOver &&
                (myRole === "Host" || myRole === "Organiser") && (
                  <button onClick={handleDelete}>Delete Event</button>
                )}
              {!isEventOver &&
                (myRole === "Host" || myRole === "Organiser") && (
                  <button onClick={handleUpdate}>Update Event</button>
                )}
            </div>
            <div className="add-ticket-type">
              {((!event.is_private && !isEventOver && myRole === "Host") ||
                myRole === "Organiser") && (
                <button
                  className="btn btn-primary"
                  onClick={handleAddTicketType}
                >
                  Add Ticket Type
                </button>
              )}
              {((!isEventOver && myRole === "Host") ||
                myRole === "Organiser") && (
                <button onClick={handleRole}>Add Roles</button>
              )}
              {!isEventOver &&
                event.is_private &&
                (myRole === "Host" || myRole === "Organiser") && (
                  <button onClick={inviteAttendees}>Invite</button>
                )}
              {!isEventOver &&
                (myRole === "Host" ||
                  myRole === "Organiser" ||
                  myRole === "Attendees" ||
                  myRole === "Attending" ||
                  myRole === "Not Attending" ||
                  myRole === "Donor") && (
                  <button onClick={handleAnnouncement}>Announcement</button>
                )}
              {isEventOver &&
                (myRole === "Host" ||
                  myRole === "Organiser" ||
                  myRole === "Attendees" ||
                  myRole === "Attending" ||
                  myRole === "Not Attending" ||
                  myRole === "Donor") && (
                  <button button onClick={handleFeedback}>
                    Give Feedback
                  </button>
                )}
              {!isEventOver &&
                (myRole === "Host" || myRole === "Organiser") && (
                  <button button onClick={handleInviteDonor}>
                    Invite Donor
                  </button>
                )}
            </div>

            <div>
              {event.image_urls &&
                JSON.parse(event.image_urls).map((imageUrl, index) => (
                  <img
                    className="image-gallery"
                    key={index}
                    src={imageUrl}
                    alt={`Image ${index}`}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedEventPage;
