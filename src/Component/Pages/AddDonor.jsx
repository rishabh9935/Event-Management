import React, { useState } from "react";
import { axiosPost } from "../../utils/methods";
import "../Styles/AddDonor.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

function AddDonor() {
  const [formData, setFormData] = useState({
    donor_name: "",
    email: "",
  });

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosPost("/donor/", formData);
      // alert('Donor added successfully!');
      enqueueSnackbar("Donor added successfully!", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      navigate("/home");
      setFormData({
        donor_name: "",
        email: "",
      });
    } catch (error) {
      console.error("Error adding donor:", error);
      // alert('Failed to add donor. Please try again.');
      enqueueSnackbar("Failed to add donor.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  return (
    <>
      <Header />
      <div className="add-donor-container">
        <h1 className="add-donor-heading">Add Donor</h1>
        <form className="add-donor-form" onSubmit={handleSubmit}>
          <div>
            <label>Donor Name:</label>
            <input
              type="text"
              name="donor_name"
              value={formData.donor_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Add Donor</button>
        </form>
      </div>
    </>
  );
}

export default AddDonor;
