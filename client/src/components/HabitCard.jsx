import { CheckCircle2, Flame, Repeat, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

function HabitCard({ habit, completeHabit, deleteHabit }) {
  return (
    <div className="col-xl-4 col-md-6">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="habit-card-modern"
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="habit-frequency-badge">{habit.frequency}</div>

          <button
            className="btn btn-sm btn-light rounded-circle"
            onClick={() => deleteHabit(habit._id)}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <h5 className="fw-bold mb-4">{habit.title}</h5>

        <div className="habit-streak-box mb-4">
          <div className="habit-streak-icon">
            <Flame size={20} />
          </div>

          <div>
            <p className="text-muted mb-1 small">Current Streak</p>

            <h4 className="fw-bold mb-0">{habit.streakCount || 0} days</h4>
          </div>
        </div>

        <div className="task-meta mb-4">
          <Repeat size={16} />
          <span>Repeats {habit.frequency}</span>
        </div>

        <button
          className="btn btn-dark w-100 rounded-4"
          onClick={() => completeHabit(habit._id)}
        >
          <CheckCircle2 size={18} className="me-2" />
          Complete Habit
        </button>
      </motion.div>
    </div>
  );
}

export default HabitCard;
