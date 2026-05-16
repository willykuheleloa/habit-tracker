import { useEffect, useState } from "react";

function App() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("Daily");

  const token = localStorage.getItem("token");

  const fetchHabits = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/habits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const createHabit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, frequency }),
      });

      const newHabit = await response.json();
      setHabits([...habits, newHabit]);
      setTitle("");
      setFrequency("Daily");
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  const completeHabit = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/habits/${id}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedHabit = await response.json();

      setHabits(
        habits.map((habit) => (habit._id === id ? updatedHabit : habit))
      );
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/habits/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHabits(habits.filter((habit) => habit._id !== id));
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHabits();
    }
  }, []);

  return (
    <div className="min-vh-100 bg-light w-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 w-100">
        <a className="navbar-brand fw-bold" href="#">
          Smart Task & Habit Tracker
        </a>
        <div className="ms-auto">
          <button className="btn btn-outline-light me-2">Login</button>
          <button className="btn btn-primary">Register</button>
        </div>
      </nav>

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

            <button className="btn btn-primary btn-lg me-3">Get Started</button>
            <button className="btn btn-outline-secondary btn-lg">
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
                    <span className="badge bg-warning text-dark">Pending</span>
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
                <p className="text-muted">Create, edit, and complete tasks.</p>
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
                <p className="text-muted">Simple insights based on progress.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
}

export default App;