import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, CheckCircle2, Lock, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import toastr from "toastr";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({ email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.name);

      toastr.success("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch (error) {
      console.error(error);
      toastr.error(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <section className="auth-page">
      <motion.div
        className="auth-shell"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="auth-brand-panel">
          <div className="sidebar-logo mb-4">
            <Sparkles size={24} />
          </div>

          <h1 className="fw-bold mb-3">Welcome back.</h1>

          <p className="auth-muted mb-4">
            Sign in to manage your tasks, habits, AI suggestions, and
            productivity insights.
          </p>

          <div className="auth-feature">
            <CheckCircle2 size={18} />
            <span>Track recurring and one-time tasks</span>
          </div>

          <div className="auth-feature">
            <Brain size={18} />
            <span>Get AI-powered improvement suggestions</span>
          </div>

          <div className="auth-feature">
            <Sparkles size={18} />
            <span>Build smarter productivity habits</span>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="mb-4">
            <p className="text-uppercase fw-semibold text-primary mb-2">
              SmartTrack
            </p>

            <h2 className="fw-bold mb-2">Login</h2>

            <p className="text-muted mb-0">
              Enter your account details to continue.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>

              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  className="form-control auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>

              <div className="auth-input-wrap">
                <Lock size={18} />
                <input
                  type="password"
                  className="form-control auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-dark btn-lg rounded-4 w-100"
            >
              Login
            </button>

            <p className="text-center text-muted mt-4 mb-0">
              No account?{" "}
              <Link className="fw-bold auth-link" to="/register">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </section>
  );
}

export default Login;
