import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  CheckCircle2,
  Clock,
  Flame,
  Lightbulb,
  Target,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import toastr from "toastr";
import { getAiSuggestion, getAnalytics } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error(error);
      toastr.error("Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const generateSuggestion = async () => {
    setLoadingSuggestion(true);

    try {
      const data = await getAiSuggestion();
      setSuggestion(data);
    } catch (error) {
      console.error(error);
      toastr.error("Unable to generate suggestion.");
    } finally {
      setLoadingSuggestion(false);
    }
  };

  if (loading) {
    return (
      <section className="container py-5 px-4">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-5">
            <p className="text-muted mb-0">Loading analytics...</p>
          </div>
        </div>
      </section>
    );
  }

  const taskData = analytics?.tasks || {};
  const habitData = analytics?.habits || {};
  const summary = analytics?.summary || {};
  const weeklyCompletions = habitData.weeklyCompletions || [];

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
              Analytics Center
            </p>

            <h1 className="fw-bold mb-2">Progress & AI Insights</h1>

            <p className="text-muted mb-0">
              Review your task completion, habit consistency, and AI-powered
              productivity recommendations.
            </p>
          </div>

          <button
            className="btn btn-dark rounded-pill px-4"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="stat-card">
              <div className="dashboard-icon bg-dark text-white mb-3">
                <Target size={22} />
              </div>
              <p className="text-muted mb-1">Productivity Score</p>
              <h3 className="fw-bold mb-0">
                {summary.productivityScore || 0}%
              </h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card">
              <div className="dashboard-icon bg-primary text-white mb-3">
                <CheckCircle2 size={22} />
              </div>
              <p className="text-muted mb-1">Tasks Completed</p>
              <h3 className="fw-bold mb-0">
                {taskData.completedTasks || 0}/{taskData.totalTasks || 0}
              </h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card">
              <div className="dashboard-icon bg-success text-white mb-3">
                <Flame size={22} />
              </div>
              <p className="text-muted mb-1">Best Streak</p>
              <h3 className="fw-bold mb-0">{habitData.bestStreak || 0} days</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card">
              <div className="dashboard-icon bg-warning text-dark mb-3">
                <Clock size={22} />
              </div>
              <p className="text-muted mb-1">Pending Tasks</p>
              <h3 className="fw-bold mb-0">{taskData.pendingTasks || 0}</h3>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <BarChart3 size={20} />
                  <h5 className="fw-bold mb-0">Weekly Habit Activity</h5>
                </div>

                {weeklyCompletions.length === 0 ? (
                  <p className="text-muted mb-0">
                    No weekly completion data available yet.
                  </p>
                ) : (
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyCompletions}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 ai-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Brain size={20} />
                  <h5 className="fw-bold mb-0">AI Productivity Coach</h5>
                </div>

                {suggestion ? (
                  <>
                    <p className="fw-semibold mb-2">{suggestion.suggestion}</p>

                    <p className="text-muted small mb-3">{suggestion.reason}</p>

                    <div className="ai-action-box">
                      <Lightbulb size={18} />
                      <span>{suggestion.actionStep}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted">
                    Generate a personalized suggestion based on your current
                    tasks and habits.
                  </p>
                )}

                <button
                  className="btn btn-primary rounded-pill w-100 mt-4"
                  onClick={generateSuggestion}
                  disabled={loadingSuggestion}
                >
                  {loadingSuggestion ? "Generating..." : "Generate AI Insight"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">Summary</h5>
            <p className="text-muted mb-0">
              {summary.message ||
                "Complete more tasks and habits to unlock stronger analytics."}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Dashboard;
