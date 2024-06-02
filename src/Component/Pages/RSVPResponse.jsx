import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { axiosPost } from "../../utils/methods";
import { useSnackbar } from "notistack";

function RSVPResponse() {
  const [response, setResponse] = useState("");
  const { eventId, email } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  console.log(eventId);

  const handleResponse = (res) => {
    setResponse(res);
    sendResponse(res);
  };

  const sendResponse = (res) => {
    axiosPost(`/events/${eventId}/handle-response/${email}/`, { response: res })
      .then((response) => {
        console.log(response.data);
        // alert(response.data.message);
        enqueueSnackbar(response.data.message, {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        // alert('An error occurred while sending the response.');
        enqueueSnackbar("An error occurred while sending the response.", {
          variant: "error",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      });
  };

  return (
    <div>
      <h1>RSVP Response</h1>
      <p>Please share your response:</p>
      <div>
        <button onClick={() => handleResponse("accept")}>Yes</button>
        <button onClick={() => handleResponse("reject")}>No</button>
      </div>
    </div>
  );
}

export default RSVPResponse;
