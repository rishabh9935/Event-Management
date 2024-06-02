import React, { useState, useEffect } from "react";
import "../Styles/FeedbackForm.css";
import { useParams } from "react-router-dom";
import { axiosPost, axiosGet } from "../../utils/methods";
import Header from "./Header";
import { useSnackbar } from "notistack";

function FeedbackForm() {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [userId, setUserId] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { eventId } = useParams();

  useEffect(() => {
    fetchFeedbacks();
    fetchUser();
  }, []);

  useEffect(() => {
    feedbacks.map((feedback) => {
      if (feedback.user == userId) setFeedbackSubmitted(true);
    });
  }, [userId]);
  const fetchFeedbacks = async () => {
    try {
      const response = await axiosGet(`/events/${eventId}/feedback/`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axiosGet("/api/getUser/");
      const data = await response.data;
      setUserId(data.id);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPost(`/events/${eventId}/feedback/`, { rating, comment });
      console.log("Feedback submitted successfully");
      // alert('Feedback Submitted');
      enqueueSnackbar("Feedback Submitted", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });

      setFeedbackSubmitted(true);
      fetchFeedbacks();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  console.log(feedbacks);

  return (
    <>
      <Header />
      <div className="feedback-form">
        <div className="feedback-list">
          {feedbacks && feedbacks.length !== 0 && <h2>Feedbacks</h2>}
          <ul>
            {feedbacks.map((feedback) => (
              <li key={feedback.id}>
                <p>{feedback.username}</p>
                <p>Rating: {feedback.rating}</p>
                <p>Comment: {feedback.comment}</p>
              </li>
            ))}
          </ul>
        </div>
        <h2>Leave Feedback</h2>
        {!feedbackSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="rating">Rating:</label>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <span
                    key={value}
                    className={value <= rating ? "star filled" : "star"}
                    onClick={() => setRating(value)}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="comment">Comment:</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button type="submit">Submit Feedback</button>
          </form>
        ) : (
          <div>Feedback submitted</div>
        )}
      </div>
    </>
  );
}

export default FeedbackForm;
