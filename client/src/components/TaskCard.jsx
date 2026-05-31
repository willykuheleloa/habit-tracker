function TaskCard({ task, completeTask, deleteTask }) {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <div className="col-md-6 mb-4 px-2">
      <div className="card h-100 border shadow-sm rounded-4">
        <div className="card-body p-4">
          <h5
            className={
              task.completed
                ? "fw-bold text-decoration-line-through text-muted"
                : "fw-bold"
            }
          >
            {task.title}
          </h5>

          <p className="text-muted mb-2">Due Date: {formattedDate}</p>
          <p className="text-muted mb-2">
            Repeats: {task.frequency || "daily"}
          </p>

          <p className="mb-3">
            Status:{" "}
            <span
              className={
                task.completed
                  ? "badge bg-success"
                  : "badge bg-warning text-dark"
              }
            >
              {task.completed ? "Completed" : "Pending"}
            </span>
          </p>

          <button
            className="btn btn-success btn-sm me-2"
            onClick={() => completeTask(task._id)}
          >
            {task.completed ? "Mark Pending" : "Mark Complete"}
          </button>

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
