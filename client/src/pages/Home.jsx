import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckSquare,
  Flame,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import toastr from "toastr";
import {
  getAnalytics,
  getAiSuggestion,
  getHabits,
  getTasks,
} from "../services/api";

function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const upcomingTasks = tasks.slice(0, 3);
  const currentHabits = habits.slice(0, 3);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [tasksData, habitsData, analyticsData, suggestionData] =
          await Promise.all([
            getTasks(),
            getHabits(),
            getAnalytics(),
            getAiSuggestion(),
          ]);

        setTasks(tasksData);
        setHabits(habitsData);
        setAnalytics(analyticsData);
        setAiSuggestion(suggestionData);
      } catch (error) {
        console.error(error);
        toastr.error("Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="container py-5 px-4">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-5">
            <p className="text-muted mb-0">Loading your dashboard...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="dashboard-hero mb-4">
          <div>
            <p className="text-uppercase fw-semibold text-primary mb-2">
              Productivity Dashboard
            </p>

            <h1 className="fw-bold mb-2">
              Hello{username ? `, ${username}` : ""}
            </h1>

            <p className="text-muted mb-0">
              Track your tasks, habits, AI insights, and weekly progress in one
              place.
            </p>
          </div>

          <div className="dashboard-score">
            <span className="score-label">Score</span>
            <span className="score-value">
              {analytics?.summary?.productivityScore || 0}
            </span>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="card border-0 shadow-sm rounded-4 h-100 dashboard-action-card"
              onClick={() => navigate("/tasks")}
            >
              <div className="card-body p-4">
                <div className="dashboard-icon bg-dark text-white mb-3">
                  <CheckSquare size={22} />
                </div>

                <h4 className="fw-bold">Tasks</h4>

                <p className="text-muted mb-3">
                  Manage priorities, due dates, and pending work.
                </p>

                <span className="dashboard-link">View Tasks →</span>
              </div>
            </motion.div>
          </div>

          <div className="col-md-4">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="card border-0 shadow-sm rounded-4 h-100 dashboard-action-card"
              onClick={() => navigate("/habits")}
            >
              <div className="card-body p-4">
                <div className="dashboard-icon bg-primary text-white mb-3">
                  <Flame size={22} />
                </div>

                <h4 className="fw-bold">Habits</h4>

                <p className="text-muted mb-3">
                  Track streaks and stay consistent every day.
                </p>

                <span className="dashboard-link">View Habits →</span>
              </div>
            </motion.div>
          </div>

          <div className="col-md-4">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="card border-0 shadow-sm rounded-4 h-100 dashboard-action-card"
              onClick={() => navigate("/analytics")}
            >
              <div className="card-body p-4">
                <div className="dashboard-icon bg-success text-white mb-3">
                  <BarChart3 size={22} />
                </div>

                <h4 className="fw-bold">Analytics</h4>

                <p className="text-muted mb-3">
                  View progress insights and productivity trends.
                </p>

                <span className="dashboard-link">View Analytics →</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Upcoming Tasks</h5>

                {upcomingTasks.length === 0 ? (
                  <p className="text-muted mb-0">No tasks yet.</p>
                ) : (
                  upcomingTasks.map((task) => (
                    <div key={task._id} className="dashboard-list-item">
                      <p className="fw-semibold mb-1">{task.title}</p>
                      <small className="text-muted">
                        Due:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </small>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Active Habits</h5>

                {currentHabits.length === 0 ? (
                  <p className="text-muted mb-0">No habits yet.</p>
                ) : (
                  currentHabits.map((habit) => (
                    <div key={habit._id} className="dashboard-list-item">
                      <p className="fw-semibold mb-1">{habit.title}</p>
                      <small className="text-muted">
                        {habit.frequency} · {habit.streakCount || 0} day streak
                      </small>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 ai-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Sparkles size={20} />
                  <h5 className="fw-bold mb-0">AI Suggestion</h5>
                </div>

                <p className="fw-semibold mb-2">
                  {aiSuggestion?.suggestion || "No suggestion available yet."}
                </p>

                <p className="text-muted small mb-3">
                  {aiSuggestion?.reason ||
                    "Complete more tasks and habits to unlock better insights."}
                </p>

                <div className="ai-action-box">
                  <Lightbulb size={18} />
                  <span>
                    {aiSuggestion?.actionStep ||
                      "Add a task or habit to get started."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Home;
