import {
  Calendar,
  CheckCircle2,
  Repeat,
  Tag,
  Trash2,
  Pencil,
} from "lucide-react";

import { motion } from "framer-motion";

function TaskCard({ task, completeTask, deleteTask, openEditModal }) {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  const priority = task.priority || "medium";
  const category = task.category || "other";

  return (
    <div className="col-xl-4 col-md-6">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="task-card-modern"
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex gap-2 flex-wrap">
            <div
              className={`task-status-badge ${
                task.completed ? "completed" : "pending"
              }`}
            >
              {task.completed ? "Completed" : "Pending"}
            </div>

            <div className={`task-priority-badge ${priority}`}>{priority}</div>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle"
              onClick={() => openEditModal(task)}
            >
              <Pencil size={16} />
            </button>

            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle"
              onClick={() => deleteTask(task._id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <h5
          className={`fw-bold mb-3 ${
            task.completed ? "text-decoration-line-through text-muted" : ""
          }`}
        >
          {task.title}
        </h5>

        {task.notes && <p className="text-muted small mb-3">{task.notes}</p>}

        <div className="task-meta mb-2">
          <Calendar size={16} />
          <span>{formattedDate}</span>
        </div>

        <div className="task-meta mb-2">
          <Repeat size={16} />
          <span>{task.frequency === "once" ? "One Time" : task.frequency}</span>
        </div>

        <div className="task-meta mb-4">
          <Tag size={16} />
          <span>{category}</span>
        </div>

        <button
          type="button"
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
