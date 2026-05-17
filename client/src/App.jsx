import { useEffect, useState } from "react";
import {
  getHabits,
  getAnalytics,
  createHabitRequest,
  completeHabitRequest,
  deleteHabitRequest,
} from "./services/api";
import Login from "./pages/Login";
import Register from "./pages/Register";

const demoAnalytics = {
  totalHabits: 3,
  totalCompletions: 8,
  bestStreak: 5,
  averageStreak: 2.7,
  weeklyCompletions: [
    { day: "Sun", count: 1 },
    { day: "Mon", count: 2 },
    { day: "Tue", count: 1 },
    { day: "Wed", count: 0 },
    { day: "Thu", count: 2 },
    { day: "Fri", count: 1 },
    { day: "Sat", count: 1 },
  ],
};

function App() {
  const [habits, setHabits] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [currentView, setCurrentView] = useState(
    localStorage.getItem("token") ? "home" : "register",
  );
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("Daily");

  const token = localStorage.getItem("token");
  const analytics = analyticsData || demoAnalytics;
  const weeklyCompletions =
    analytics.weeklyCompletions || demoAnalytics.weeklyCompletions;
  const usingDemoAnalytics = !token || !analyticsData;
  const weeklyMax = Math.max(...weeklyCompletions.map((item) => item.count), 1);

  const fetchHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const createHabit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please log in before adding habits.");
      return;
    }

    try {
      const newHabit = await createHabitRequest({ title, frequency });
      setHabits([...habits, newHabit]);
      setTitle("");
      setFrequency("Daily");

      fetchAnalytics();
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  const completeHabit = async (id) => {
    try {
      const updatedHabit = await completeHabitRequest(id);

      setHabits(
        habits.map((habit) => (habit._id === id ? updatedHabit : habit)),
      );

      if (token) {
        fetchAnalytics();
      }
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await deleteHabitRequest(id);

      setHabits(habits.filter((habit) => habit._id !== id));

      if (token) {
        fetchAnalytics();
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHabits();
      fetchAnalytics();
    }
  }, []);

  return (
    <div className="min-vh-100 bg-light w-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 w-100">
        <a className="navbar-brand fw-bold" href="#">
          Smart Task & Habit Tracker
        </a>
        <div className="ms-auto d-flex align-items-center">
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

      {currentView === "home" && (
        <section className="container py-5">
          <div className="row align-items-center">
            <div className="col-md-7">
              <span className="badge bg-primary mb-3">
                Sprint 1 MVP Foundation
              </span>

              <h1 className="display-4 fw-bold mb-3">
                Build better habits. Track smarter tasks.
              </h1>

              <p className="lead text-muted mb-4">
                A productivity dashboard designed to help users manage tasks,
                track habits, monitor progress, and receive simple AI-based
                suggestions over time.
              </p>

              <button className="btn btn-primary btn-lg me-3">
                Get Started
              </button>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  if (!token) {
                    alert("Please log in first.");
                    setCurrentView("login");
                    return;
                  }

                  setCurrentView("dashboard");
                }}
              >
                View Dashboard
              </button>
            </div>

            <div className="col-md-5 mt-4 mt-md-0">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-3">Today’s Preview</h4>

                  <div className="mb-3">
                    <label className="form-label">Task Progress</label>
                    <div className="progress">
                      <div className="progress-bar" style={{ width: "65%" }}>
                        65%
                      </div>
                    </div>
                  </div>

                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      Complete project setup
                      <span className="badge bg-success">Done</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      Track daily habit
                      <span className="badge bg-warning text-dark">
                        Pending
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      Review progress
                      <span className="badge bg-secondary">Planned</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="row text-center mt-5">
            <div className="col-md-3 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold">Authentication</h5>
                  <p className="text-muted">Secure login and registration.</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold">Tasks</h5>
                  <p className="text-muted">
                    Create, edit, and complete tasks.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold">Habits</h5>
                  <p className="text-muted">Track routines and streaks.</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold">AI Suggestions</h5>
                  <p className="text-muted">
                    Simple insights based on progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {currentView === "login" && <Login setCurrentView={setCurrentView} />}

      {currentView === "register" && (
        <Register setCurrentView={setCurrentView} />
      )}

      {currentView === "dashboard" && (
        <section className="container py-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                  <h2 className="fw-bold mb-2">Dashboard & Analytics</h2>
                  <p className="text-muted mb-0">
                    Current dashboard metrics use habit data. Task and overview
                    analytics are structured for integration as those modules
                    are completed.
                  </p>
                </div>
                <div className="d-flex flex-column align-items-md-end gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setCurrentView("home")}
                  >
                    Back to Home
                  </button>
                </div>
              </div>

              {usingDemoAnalytics && (
                <div className="alert alert-info">
                  Demo analytics are shown until a login token is available.
                </div>
              )}

              <div className="bg-light border rounded p-3 mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
                  <h4 className="fw-bold mb-0">Habit Analytics</h4>
                  <span className="badge bg-success align-self-md-start">
                    Live Data
                  </span>
                </div>

                <div className="row text-center">
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h6 className="text-muted">Current Habits</h6>
                        <h3 className="fw-bold mb-0">
                          {analytics.totalHabits}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h6 className="text-muted">Completions</h6>
                        <h3 className="fw-bold mb-0">
                          {analytics.totalCompletions}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h6 className="text-muted">Best Streak</h6>
                        <h3 className="fw-bold mb-0">
                          {analytics.bestStreak} days
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h6 className="text-muted">Average Streak</h6>
                        <h3 className="fw-bold mb-0">
                          {analytics.averageStreak}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-light border rounded p-3 mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
                  <h4 className="fw-bold mb-0">Task Analytics</h4>
                  <span className="badge bg-secondary align-self-md-start">
                    Planned
                  </span>
                </div>

                <div className="row text-center">
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h6 className="text-muted">Completion Rate</h6>
                        <h3 className="fw-bold text-muted mb-0">--</h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h6 className="text-muted">Completed</h6>
                        <h3 className="fw-bold text-muted mb-0">--</h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h6 className="text-muted">Pending</h6>
                        <h3 className="fw-bold text-muted mb-0">--</h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h6 className="text-muted">Overdue</h6>
                        <h3 className="fw-bold text-muted mb-0">--</h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mt-3">
                    <div className="alert alert-secondary mb-0">
                      Task analytics will connect here after Task Management is
                      integrated.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-light border rounded p-3 mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
                  <h4 className="fw-bold mb-0">Activity Trends</h4>
                  <span className="badge bg-success align-self-md-start">
                    Live Data
                  </span>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h5 className="fw-bold mb-1">Weekly Activity</h5>
                        <p className="text-muted mb-3">
                          Currently showing habit completions by day.
                        </p>

                        {weeklyCompletions.map((item) => (
                          <div key={item.day} className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <span>{item.day}</span>
                              <span>{item.count}</span>
                            </div>
                            <div className="progress">
                              <div
                                className="progress-bar"
                                style={{
                                  width: `${(item.count / weeklyMax) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-light border rounded p-3">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
                  <h4 className="fw-bold mb-0">Overview</h4>
                  <span className="badge bg-secondary align-self-md-start">
                    Planned
                  </span>
                </div>

                <div className="row text-center">
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h6 className="text-muted">Today</h6>
                        <h3 className="fw-bold text-muted mb-0">--</h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h6 className="text-muted">This Week</h6>
                        <h3 className="fw-bold text-muted mb-0">--</h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h6 className="text-muted">Streak</h6>
                        <h3 className="fw-bold text-muted mb-0">--</h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h6 className="text-muted">Status</h6>
                        <h3 className="fw-bold text-muted mb-0">--</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {currentView === "home" && (
        <section className="container pb-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="fw-bold mb-2">Habit Tracking</h2>
              <p className="text-muted">
                Create habits, monitor streaks, and track progress over time.
              </p>

              {!token && (
                <div className="alert alert-warning">
                  No login token found. Please log in first so habits can load.
                </div>
              )}

              <form onSubmit={createHabit} className="row g-2 mb-4">
                <div className="col-md-7">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter habit title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>

                <div className="col-md-2 d-grid">
                  <button type="submit" className="btn btn-primary">
                    Add Habit
                  </button>
                </div>
              </form>

              {habits.length === 0 ? (
                <p className="text-muted">No habits yet. Add one above.</p>
              ) : (
                <div className="row">
                  {habits.map((habit) => (
                    <div key={habit._id} className="col-md-6 mb-3">
                      <div className="card h-100 border">
                        <div className="card-body">
                          <h5 className="fw-bold">{habit.title}</h5>
                          <p className="mb-1">Frequency: {habit.frequency}</p>
                          <p className="mb-3">
                            Current Streak:{" "}
                            <span className="badge bg-success">
                              {habit.streakCount}
                            </span>
                          </p>

                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => completeHabit(habit._id)}
                          >
                            Mark Complete
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => deleteHabit(habit._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
