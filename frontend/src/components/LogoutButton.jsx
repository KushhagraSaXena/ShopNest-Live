// components/LogoutButton.jsx
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../redux/features/auth/authSlice"; 

const LogoutButton = ({ className = "" }) => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      dispatch(logout()); // clear Redux state
      // navigate("/login");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      Logout
    </button>
  );
};

export default LogoutButton;
