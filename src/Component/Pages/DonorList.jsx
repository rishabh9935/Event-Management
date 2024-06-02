import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosGet, axiosPost } from "../../utils/methods";
import "../Styles/DonorList.css";
import { useSnackbar } from "notistack";

function DonorList() {
  const [donors, setDonors] = useState([]);
  const { eventId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await axiosGet("/donorsInvite/");
      setDonors(response.data);
    } catch (error) {
      console.error("Error fetching donors:", error);
    }
  };

  const handleInvite = async (email) => {
    try {
      await axiosPost("/donorsInvite/", { eventId, email });
      // alert('Invitation sent successfully!');
      enqueueSnackbar("Invitation sent successfully!", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error) {
      console.error("Error inviting donor:", error);
      // alert('Failed to send invitation. Please try again.');
      enqueueSnackbar("Failed to send invitation. Please try again.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  return (
    <div className="donor-list-container">
      <h2 className="donor-list-heading">Donors</h2>
      <hr style={{ backgroundColor: "white" }} />
      <ul className="donor-list-ul">
        {donors.map((donor) => (
          <li key={donor.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                {donor.donor_name}
              </div>
              <button
                className="invite-button"
                onClick={() => handleInvite(donor.email)}
              >
                Invite
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DonorList;
