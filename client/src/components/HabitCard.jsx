import {
  CheckCircle2,
  Flame,
  Pencil,
  Repeat,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

function HabitCard({ habit, checkInHabit, deleteHabit, openEditHabit }) {
  const completedToday = habit.lastCompletedAt
    ? new Date(habit.lastCompletedAt).toDateString() ===
      new Date().toDateString()
    : false;

  const healthClass =
    habit.healthStatus === "Strong Momentum"
      ? "habit-health-strong"
      : habit.healthStatus === "At Risk"
        ? "habit-health-risk"
        : habit.healthStatus === "Recovering"
          ? "habit-health-recovering"
          : "habit-health-attention";

  return (
    <div className="col-xl-4 col-md-6">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="habit-card-modern"
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex gap-2 flex-wrap">
            <div className="habit-frequency-badge">{habit.frequency}</div>
            <div className={`habit-health-badge ${healthClass}`}>
              {habit.healthStatus || "Needs Attention"}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle"
              onClick={() => openEditHabit(habit)}
            >
              <Pencil size={16} />
            </button>

            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle"
              onClick={() => deleteHabit(habit._id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <h5 className="fw-bold mb-3">{habit.title}</h5>

        <div className="habit-streak-box mb-3">
          <div className="habit-streak-icon">
            <Flame size={20} />
          </div>

          <div>
            <p className="text-muted mb-1 small">Current Streak</p>
            <h4 className="fw-bold mb-0">{habit.streakCount || 0} days</h4>
          </div>
        </div>

        <div className="habit-progress-box mb-3">
          <div className="d-flex justify-content-between mb-2">
            <span className="fw-semibold small">Consistency Score</span>
            <span className="fw-bold small">
              {habit.consistencyScore || 0}%
            </span>
          </div>

          <div className="progress rounded-pill" style={{ height: "10px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${habit.consistencyScore || 0}%` }}
            />
          </div>
        </div>

        <div className="task-meta mb-2">
          <TrendingUp size={16} />
          <span>{habit.momentumStatus || "Building"} Momentum</span>
        </div>

        <div className="task-meta mb-3">
          <Repeat size={16} />
          <span>{habit.category || "other"} habit</span>
        </div>

        <div className="habit-ai-note mb-4">
          {habit.aiInsight ||
            "Complete this habit to build behavioral momentum."}
        </div>

        <button
          type="button"
          className={`btn w-100 rounded-4 ${
            completedToday ? "btn-outline-secondary" : "btn-dark"
          }`}
          onClick={() => checkInHabit(habit._id)}
          disabled={completedToday}
        >
          <CheckCircle2 size={18} className="me-2" />
          {completedToday ? "Checked In Today" : "Check In Today"}
        </button>
      </motion.div>
    </div>
  );
}

export default HabitCard;
