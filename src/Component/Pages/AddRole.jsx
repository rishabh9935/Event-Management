import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Styles/AddRole.css";
import { axiosGet, axiosPost, axiosDelete } from "../../utils/methods";
import Header from "./Header";
import { useSnackbar } from "notistack";

const AddEmailsToRoleForm = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [emails, setEmails] = useState("");
  const [message, setMessage] = useState("");
  const { eventId } = useParams();
  const [users, setUsers] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosGet(`/api/events/${eventId}/addRole/`);
      setUsers(response.data);
      console.log(response.data);
      console.log(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosGet(`/events/${eventId}/role/`);
      setRoles(response.data.roles_available);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPost(`/api/events/${eventId}/addRole/`, {
        role: selectedRole,
        emails: emails.split(",").map((email) => email.trim()),
      });
      setMessage(response.data.message);
      enqueueSnackbar("Role Added Successfully!!", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });

      await fetchUsers();
    } catch (error) {
      console.error(error);
      setMessage("Error occurred while adding emails to role.");
    }
  };

  const handleDeleteUser = async (username) => {
    try {
      await axiosDelete(`/api/events/${eventId}/delRole/${username}/`);
      console.log("users", users);
      const updatedData = Object.fromEntries(
        Object.entries(users).map(([key, value]) => [
          key,
          value.filter((one) => one !== username),
        ])
      );

      setUsers(updatedData);
      console.log("users", users);
      console.log("updatedData", updatedData);
      // alert("Deleted Successful")
      enqueueSnackbar("Deleted Successful", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };


  return (
    <>
      <Header />
      <div className="table-container">
        <h2>User Roles</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Roles</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(users).map(([role, usersInRole]) =>
              usersInRole.map((user, index) => (
                <tr key={index}>
                  <td>{user}</td>
                  <td>{role}</td>
                  <td>
                    {role !== "host" && (
                      <button
                        className="action-btn"
                        onClick={() => handleDeleteUser(user)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="form-container">
        <h2>Add Emails to Role</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Select Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select Role</option>
              {roles.map(
                (role, index) =>
                  role !== "donor" && (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  )
              )}
            </select>
          </div>
          <div>
            <label>Email Addresses (comma-separated):</label>
            <input
              type="text"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </>
  );
};

export default AddEmailsToRoleForm;

