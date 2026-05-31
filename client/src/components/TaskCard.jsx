import { Calendar, CheckCircle2, Clock3, Repeat, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

function TaskCard({ task, completeTask, deleteTask }) {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <div className="col-xl-4 col-md-6">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="task-card-modern"
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div
            className={`task-status-badge ${
              task.completed ? "completed" : "pending"
            }`}
          >
            {task.completed ? "Completed" : "Pending"}
          </div>

          <button
            className="btn btn-sm btn-light rounded-circle"
            onClick={() => deleteTask(task._id)}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <h5
          className={`fw-bold mb-3 ${
            task.completed ? "text-decoration-line-through text-muted" : ""
          }`}
        >
          {task.title}
        </h5>

        <div className="task-meta mb-2">
          <Calendar size={16} />
          <span>{formattedDate}</span>
        </div>

        <div className="task-meta mb-4">
          <Repeat size={16} />
          <span>{task.frequency || "daily"}</span>
        </div>

        <button
          className={`btn w-100 rounded-4 ${
            task.completed ? "btn-outline-secondary" : "btn-dark"
          }`}
          onClick={() => completeTask(task._id)}
        >
          <CheckCircle2 size={18} className="me-2" />

          {task.completed ? "Mark Pending" : "Mark Complete"}
        </button>
      </motion.div>
    </div>
  );
}

export default TaskCard;
