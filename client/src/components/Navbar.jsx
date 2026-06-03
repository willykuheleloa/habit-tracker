import { NavLink, useNavigate } from "react-router-dom";
import toastr from "toastr";
import { logoutUser } from "../services/api";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      localStorage.removeItem("username");

      toastr.success("You have been logged out successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      console.error(error);
      toastr.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <h3 className="text-light m-0">Smart Task & Habit Tracker</h3>

      <div className="ms-auto">
        <NavLink className="btn btn-outline-light me-2" to="/dashboard">
          Home
        </NavLink>

        <NavLink className="btn btn-outline-light me-2" to="/tasks">
          Tasks
        </NavLink>

        <NavLink className="btn btn-outline-light me-2" to="/habits">
          Habits
        </NavLink>

        <NavLink className="btn btn-outline-light me-2" to="/analytics">
          Analytics
        </NavLink>

        <NavLink to="/ai-reminders" className="nav-link">
          AI Reminders
        </NavLink>

        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
