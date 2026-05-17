import { useState } from "react";
import { loginUser } from "../services/api";

function Login({ setCurrentView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({ email, password });

      localStorage.setItem("token", data.token);

      alert("Login successful!");

      setCurrentView("home");

      // window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <section className="container py-5">
      <div
        className="card shadow-sm border-0 mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <div className="card-body p-4">
          <h2 className="fw-bold mb-4 text-center">Login</h2>

          <form onSubmit={handleLogin}>
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
              Login
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary w-100 mt-2"
              onClick={() => setCurrentView("home")}
            >
              Back
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
