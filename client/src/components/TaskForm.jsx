import { Plus } from "lucide-react";

function TaskForm({
  taskTitle,
  setTaskTitle,
  taskDueDate,
  setTaskDueDate,
  taskFrequency,
  setTaskFrequency,
  createTask,
}) {
  return (
    <form onSubmit={createTask} className="task-form-card mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-lg-5">
          <label className="form-label fw-semibold">Task Name</label>
          <input
            type="text"
            className="form-control form-control-lg rounded-4"
            placeholder="What do you need to get done?"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />
        </div>

        <div className="col-lg-3">
          <label className="form-label fw-semibold">Due Date</label>
          <input
            type="date"
            className="form-control form-control-lg rounded-4"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
        </div>

        <div className="col-lg-2">
          <label className="form-label fw-semibold">Repeat</label>
          <select
            className="form-select form-select-lg rounded-4"
            value={taskFrequency}
            onChange={(e) => setTaskFrequency(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="col-lg-2 d-grid">
          <button type="submit" className="btn btn-dark btn-lg rounded-4">
            <Plus size={18} className="me-1" />
            Add
          </button>
        </div>
      </div>
    </form>
  );
}

export default TaskForm;
