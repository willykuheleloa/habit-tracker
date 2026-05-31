import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Clock,
  Flame,
  Lightbulb,
  ShieldAlert,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
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

  useEffect(() => {
    loadAnalytics();
    generateSuggestion();
  }, []);

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
  const improvementAreas = analytics?.improvementAreas || [];
  const weeklyCompletions = habitData.weeklyCompletions || [];
  const categoryBreakdown = taskData.categoryBreakdown || [];

  const productivityScore = summary.productivityScore || 0;

  const chartColors = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

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
              Review your productivity trends, improvement areas, habits, and
              AI-generated coaching insights.
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

              <h3
                className={`fw-bold mb-0 ${
                  productivityScore >= 80
                    ? "text-success"
                    : productivityScore >= 50
                      ? "text-warning"
                      : "text-danger"
                }`}
              >
                {productivityScore}%
              </h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card">
              <div className="dashboard-icon bg-danger text-white mb-3">
                <AlertTriangle size={22} />
              </div>
              <p className="text-muted mb-1">Overdue Tasks</p>
              <h3 className="fw-bold mb-0">{taskData.overdueTasks || 0}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card">
              <div className="dashboard-icon bg-warning text-dark mb-3">
                <ShieldAlert size={22} />
              </div>
              <p className="text-muted mb-1">High Priority Pending</p>
              <h3 className="fw-bold mb-0">
                {taskData.highPriorityPending || 0}
              </h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card">
              <div className="dashboard-icon bg-success text-white mb-3">
                <Flame size={22} />
              </div>
              <p className="text-muted mb-1">Best Habit Streak</p>
              <h3 className="fw-bold mb-0">{habitData.bestStreak || 0} days</h3>
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
                  <>
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

                    {weeklyCompletions.every((day) => day.count === 0) && (
                      <p className="text-muted small mt-3 mb-0">
                        Complete habits throughout the week to build trend data.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <TrendingUp size={20} />
                  <h5 className="fw-bold mb-0">Category Breakdown</h5>
                </div>

                {categoryBreakdown.length === 0 ? (
                  <p className="text-muted">No category data available.</p>
                ) : (
                  <>
                    <div style={{ height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryBreakdown}
                            dataKey="total"
                            nameKey="category"
                            outerRadius={90}
                          >
                            {categoryBreakdown.map((_, index) => (
                              <Cell
                                key={index}
                                fill={chartColors[index % chartColors.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-3">
                      {categoryBreakdown.map((category) => (
                        <div
                          key={category.category}
                          className="d-flex justify-content-between mb-2"
                        >
                          <span className="text-capitalize">
                            {category.category}
                          </span>
                          <span className="fw-semibold">
                            {category.completionRate}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4 align-items-start">
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 ai-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Brain size={20} />
                  <h5 className="fw-bold mb-0">AI Productivity Coach</h5>
                </div>

                {suggestion ? (
                  <>
                    <h5 className="fw-bold mb-2">{suggestion.suggestion}</h5>

                    <p className="text-muted small mb-3">{suggestion.reason}</p>

                    <div className="ai-action-box mb-3">
                      <Lightbulb size={18} />
                      <span>{suggestion.actionStep}</span>
                    </div>

                    <div className="small">
                      <p className="mb-2">
                        <span className="fw-bold">Focus Area:</span>{" "}
                        {suggestion.focusArea}
                      </p>

                      <p className="mb-2">
                        <span className="fw-bold">Improvement:</span>{" "}
                        {suggestion.improvementArea}
                      </p>

                      {suggestion.priorityWarning && (
                        <p className="text-danger fw-semibold mb-0">
                          {suggestion.priorityWarning}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-muted">
                    {loadingSuggestion
                      ? "Generating your personalized insight..."
                      : "Generate a personalized AI insight based on your current tasks and habits."}
                  </p>
                )}

                <button
                  className="btn btn-primary rounded-pill w-100 mt-4"
                  onClick={generateSuggestion}
                  disabled={loadingSuggestion}
                >
                  {loadingSuggestion ? "Generating..." : "Refresh AI Insight"}
                </button>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mt-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Productivity Summary</h5>

                <p className="text-muted mb-0">
                  {summary.message ||
                    "Complete more tasks and habits to unlock stronger analytics."}
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <Clock size={20} />
                  <h5 className="fw-bold mb-0">Improvement Areas</h5>
                </div>

                {improvementAreas.length === 0 ? (
                  <p className="text-muted mb-0">
                    No major improvement areas detected. Great work.
                  </p>
                ) : (
                  improvementAreas.map((area) => (
                    <div key={area.title} className="improvement-card">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0">{area.title}</h6>

                        <span className={`severity-badge ${area.severity}`}>
                          {area.severity}
                        </span>
                      </div>

                      <p className="text-muted mb-3">{area.message}</p>

                      {area.tasks && area.tasks.length > 0 && (
                        <div className="d-flex flex-column gap-2">
                          {area.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="improvement-task-item"
                            >
                              <div>
                                <p className="fw-semibold mb-1">{task.title}</p>

                                <div className="d-flex gap-2 flex-wrap">
                                  <span className="mini-pill">
                                    {task.priority}
                                  </span>

                                  <span className="mini-pill">
                                    {task.category}
                                  </span>

                                  {task.dueDate && (
                                    <span className="mini-pill">
                                      Due{" "}
                                      {new Date(
                                        task.dueDate,
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Dashboard;
