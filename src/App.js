import HomePage from "./Component/Pages/HomePage";
import LoginPage from "./Component/Pages/LoginPage";
import RegisterPage from "./Component/Pages/RegisterPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddEventPage from "./Component/Pages/AddEventPage";
import ForgotPasswordForm from "./Component/Pages/ForgotPasswordForm";
import ResetPasswordPage from "./Component/Pages/ResetPasswordPage";
import AddRole from "./Component/Pages/AddRole";
import DetailedEventPage from "./Component/Pages/DetailedEventPage";
import TicketTypeForm from "./Component/Pages/TicketTypeForm";
import InviteAttendeesForm from "./Component/Pages/InviteAttendeesForm";
import UserBookings from "./Component/Pages/UserBookings";
import FeedbackForm from "./Component/Pages/FeedbackForm";
import RSVPResponse from "./Component/Pages/RSVPResponse";
import AddDonor from "./Component/Pages/AddDonor";
import DonorList from "./Component/Pages/DonorList";
import Profile from "./Component/Pages/Profile";
import ChangePassword from "./Component/Pages/ChangePassword";
import Chat from "./Component/Pages/Chat";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/addEvent" element={<AddEventPage />} />
        <Route path="/UpdateEvent/:eventId" element={<AddEventPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route
          path="/reset-password/:uidb64/:token"
          element={<ResetPasswordPage />}
        />
        <Route path="/addRole/:eventId" element={<AddRole />} />
        <Route path="/event_details/:eventId" element={<DetailedEventPage />} />
        <Route path="/ticket_type/:eventId" element={<TicketTypeForm />} />
        <Route
          path="/invite_attendees/:eventId"
          element={<InviteAttendeesForm />}
        />
        <Route path="/user_bookings" element={<UserBookings />} />
        <Route path="/feedback/:eventId" element={<FeedbackForm />} />
        <Route path="/choices/:eventId/:email" element={<RSVPResponse />} />
        <Route path="/chat/:eventId" element={<Chat/>} />
        <Route path="/add-donor" element={<AddDonor />} />
        <Route path="/donor-list/:eventId" element={<DonorList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
