import toastr from "toastr";
import { logoutUser } from "../services/api";

function Navbar({ token, setCurrentView }) {
  const handleLogout = async () => {
    try {
      await logoutUser();

      localStorage.removeItem("token");
      toastr.success("You have been logged out successfully.");

      setTimeout(() => {
        setCurrentView("login");
      }, 1200);
    } catch (error) {
      console.error(error);
      toastr.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <h3 className="text-light m-0">Smart Task & Habit Tracker</h3>

      <div className="ms-auto">
        {token ? (
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <button
              className="btn btn-outline-light me-2"
              onClick={() => setCurrentView("login")}
            >
              Login
            </button>

            <button
              className="btn btn-primary"
              onClick={() => setCurrentView("register")}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;