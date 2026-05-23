function Navbar({ token, setCurrentView }) {
  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <h3 className="text-light m-0">Smart Task & Habit Tracker</h3>

      <div className="ms-auto">
        {token ? (
          <button
            className="btn btn-danger"
            onClick={() => {
              localStorage.removeItem("token");
              setCurrentView("login");
              window.location.reload();
            }}
          >
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
