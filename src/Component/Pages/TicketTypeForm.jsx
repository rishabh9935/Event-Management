import React, { useState, useEffect } from "react";
import "../Styles/TicketTypeForm.css";
import { axiosPost, axiosGet } from "../../utils/methods";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useSnackbar } from "notistack";

function TicketTypeForm() {
  const { eventId } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [myRole, setMyRole] = useState("");

  async function getRole() {
    const resp = await axiosGet(`/events/${eventId}/role/`);
    setMyRole(resp.data.role);
  }

  useEffect(() => {
    getRole();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPost(
        `/events/${eventId}/create-ticket-type/`,
        {
          name: name,
          price: price,
        }
      );
      // alert('Ticket created');
      enqueueSnackbar("Ticket created", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      navigate(`/event_details/${eventId}`);
      console.log(response.data);
    } catch (error) {
      console.error("Error creating ticket type:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="main-container">
        <div className="ticket-type-form">
          <h2>Add Ticket Type</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            {myRole == "Host" && <button type="submit">Add Ticket Type</button>}
          </form>
        </div>
      </div>
    </>
  );
}

export default TicketTypeForm;
