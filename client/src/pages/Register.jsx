import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, CheckCircle2, Lock, Mail, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";
import toastr from "toastr";
import { registerUser } from "../services/api";

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
      }, 600);
    } catch (error) {
      console.error(error);
      toastr.error(error.message || "Registration failed. Please try again.");
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

          <h1 className="fw-bold mb-3">Build better momentum.</h1>

          <p className="auth-muted mb-4">
            Create your account and start tracking priorities, habits, streaks,
            and AI-powered productivity insights.
          </p>

          <div className="auth-feature">
            <CheckCircle2 size={18} />
            <span>Organize tasks by priority and category</span>
          </div>

          <div className="auth-feature">
            <Brain size={18} />
            <span>Discover what to improve with AI coaching</span>
          </div>

          <div className="auth-feature">
            <Sparkles size={18} />
            <span>Turn progress into a repeatable system</span>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="mb-4">
            <p className="text-uppercase fw-semibold text-primary mb-2">
              SmartTrack
            </p>

            <h2 className="fw-bold mb-2">Create Account</h2>

            <p className="text-muted mb-0">
              Set up your account to start tracking progress.
            </p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>

              <div className="auth-input-wrap">
                <User size={18} />
                <input
                  type="text"
                  className="form-control auth-input"
                  placeholder="Your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
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
              Create Account
            </button>

            <p className="text-center text-muted mt-4 mb-0">
              Already have an account?{" "}
              <Link className="fw-bold auth-link" to="/login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </section>
  );
}

export default Register;
