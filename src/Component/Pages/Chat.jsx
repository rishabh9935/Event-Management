import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useParams } from "react-router-dom";
import { axiosPost, axiosGet } from "../../utils/methods";
import "../Styles/Chat.css";
import Header from "./Header";

function Chat() {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  // const [role, setRole] = useState('');
  const { eventId } = useParams();

  useEffect(() => {
    Pusher.logToConsole = true;
    const pusher = new Pusher("c705b179d62560cfc934", {
      cluster: "ap2",
    });
    const channel = pusher.subscribe("chat");
    channel.bind("message", function (data) {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    fetchUser();
    fetchMessages();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axiosGet("/api/getUser/");
      const data = await response.json();
      setUsername(data.username);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axiosGet(`/events/${eventId}/messages/`);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch message:", error.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    await axiosPost(`/events/${eventId}/messages/`, {
      message,
    });
    setMessage("");
  };

  return (
    <>
      <Header />
      <div className="messaging-container">
        <h2 className="announcement-heading">Announcement</h2>
        <div
          className="list-group list-group-flush border-bottom message-list"
          style={{ minHeight: "500px" }}
        >
          {messages
            .sort((a, b) => a.id - b.id)
            .map((message, index) => (
              <div
                key={index}
                className="list-group-item list-group-item-action py-3 lh-tight message-item"
              >
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <strong className="mb-1 message-username">
                    {message.username}
                  </strong>
                </div>
                <div className="col-10 mb-1 small">{message.message}</div>
              </div>
            ))}
        </div>
        <form onSubmit={submit} className="message-input">
          <input
            className="form-control"
            placeholder="Write a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="submit-button"
            disabled={!message.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}

export default Chat;
