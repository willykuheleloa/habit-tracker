import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import toastr from "toastr";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerUser({
        name: username,
        email,
        password,
      });

      toastr.success("Registration successful! Please log in.");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      console.error(error);
      toastr.error(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <section className="container py-5">
      <div
        className="card shadow-sm border-0 mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <div className="card-body p-4">
          <h2 className="fw-bold mb-4 text-center">Register</h2>

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Username</label>

              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>

              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>

              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Create Account
            </button>

            <Link className="btn btn-outline-secondary w-100 mt-2" to="/login">
              Already have an account? Login
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
