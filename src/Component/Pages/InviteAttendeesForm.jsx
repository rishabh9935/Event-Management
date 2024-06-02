import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../Styles/InviteAttendeesForm.css";
import { axiosPost } from "../../utils/methods";
import Header from "./Header";
import { useSnackbar } from "notistack";

function InviteAttendeesForm() {
  const [emailList, setEmailList] = useState("");
  const [message, setMessage] = useState("");
  const { eventId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const handleInviteAttendees = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPost(`/events/${eventId}/invite-attendees/`, {
        emailList: emailList.split("\n").map((email) => email.trim()),
        message: message,
      });
      console.log(response.data);
      enqueueSnackbar("Invitation Sent Successfully", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error) {
      console.error("Error inviting attendees:", error);
      enqueueSnackbar("Error inviting attendees", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  return (
    <>
      <Header />
      <div className="invite-attendees-form">
        <h2>Invite Attendees</h2>
        <form onSubmit={handleInviteAttendees}>
          <textarea
            placeholder="Enter email addresses (one per line)"
            value={emailList}
            onChange={(e) => setEmailList(e.target.value)}
            required
          ></textarea>
          <textarea
            placeholder="Enter message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button type="submit">Send Invitations</button>
        </form>
      </div>
    </>
  );
}

export default InviteAttendeesForm;
