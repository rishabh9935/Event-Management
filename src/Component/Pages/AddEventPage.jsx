import React, { useState, useEffect, useRef } from "react";
import "../Styles/AddEventPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { axiosPost, axiosPut, axiosGet } from "../../utils/methods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import { useSnackbar } from "notistack";

function AddEventPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    details: "",
    is_private: false,
    is_raffle: false,
    photo: null,
  });

  const imagesRef = useRef(null);

  const [imagesArray, setImagesArray] = useState([]);

  const handleUploadClick = () => {
    imagesRef.current.click();
  };

  const handlePhotosChange = (e) => {
    const files = e.target.files;
    setImagesArray([...imagesArray, ...Object.values(files)]);
  };

  const fetchEventDetails = async (eventId) => {
    try {
      const response = await axiosGet(`/api/events/${eventId}/`);
      const event = response.data;
      console.log(event);
      setFormData({
        name: event.name,
        date: event.date,
        location: event.location,
        description: event.description,
        is_private: event.is_private,
        is_raffle: event.is_raffle,
        bidItem: event.bidItem,
        details: event.details,
      });
      console.log(formData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (eventId) {
      console.log(eventId);
      fetchEventDetails(eventId);
    }
  }, [eventId]);

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    const newValue =
      type === "checkbox" ? checked : type === "file" ? files[0] : value;
    console.log(newValue);
    setFormData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(formData.date);

    const currentDate = new Date();

    if (selectedDate < currentDate) {
      // alert("Cannot create an event with a past date.");
      enqueueSnackbar("Cannot create an event with a past date.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      return;
    }
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) =>
        formDataToSend.append(key, formData[key])
      );
      imagesArray.forEach((image) => {
        formDataToSend.append("images", image);
      });
      let response;
      if (eventId) {
        // Update the event
        response = await axiosPut(
          `/api/events/${eventId}/update/`,
          formDataToSend
        );
        console.log("Event updated successfully:", response.data);
        // alert("Event Updated successfully");
        enqueueSnackbar("Event Updated successfully", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      } else {
        // Create a new event
        response = await axiosPost("/api/events/post/", formDataToSend);
        console.log("Event created successfully:", response.data);
        // alert("Event created successfully");
        enqueueSnackbar("Event created successfully", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      }
      navigate(`/home`);
    } catch (error) {
      console.error("Error saving event:", error);
      // alert("You don't have permissions to do this task");
      enqueueSnackbar("Error Saving Event", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="image-list">
          {imagesArray.map((ele) => {
            const url = URL.createObjectURL(ele);
            return <img className="image-gallery" src={url} />;
          })}
        </div>
        <div className="upload" onClick={handleUploadClick}>
          <FontAwesomeIcon
            style={{ fontSize: 90, color: "green" }}
            icon={faUpload}
          />
          <p className="newp">
            <center>
              <b>Add More Images</b>{" "}
            </center>{" "}
          </p>
        </div>
        <input
          type="file"
          multiple
          ref={imagesRef}
          style={{ display: "none" }}
          onChange={handlePhotosChange}
        />

        <div className="form">
          <h1>{eventId ? "Update Event" : "Add Event"}</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Details:</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Bidding Item:</label>
              <input
                type="text"
                name="bidItem"
                value={formData.bidItem}
                onChange={handleChange}
                required
              />
            </div>
            <div className="isPrivate">
              <label>Is Private ? </label>
              <input
                className="isPrivateCheckbox"
                type="checkbox"
                name="is_private"
                checked={formData.is_private}
                onChange={handleChange}
              />
            </div>
            <div className="isPrivate">
              <label>Is Raffle ? </label>
              <input
                className="isPrivateCheckbox"
                type="checkbox"
                name="is_raffle"
                checked={formData.is_raffle}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Image:</label>
              <input type="file" name="photo" onChange={handleChange} />
            </div>
            <br />
            <button type="submit">
              {eventId ? "Update Event" : "Add Event"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddEventPage;
