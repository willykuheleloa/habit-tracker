import { Plus } from "lucide-react";

function TaskForm({
  taskTitle,
  setTaskTitle,
  taskDueDate,
  setTaskDueDate,
  taskFrequency,
  setTaskFrequency,
  taskPriority,
  setTaskPriority,
  taskCategory,
  setTaskCategory,
  taskNotes,
  setTaskNotes,
  createTask,
}) {
  return (
    <form onSubmit={createTask} className="task-form-card mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-lg-4">
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

        <div className="col-lg-2">
          <label className="form-label fw-semibold">Due Date</label>
          <input
            type="date"
            className="form-control form-control-lg rounded-4"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
        </div>

        <div className="col-lg-2">
          <label className="form-label fw-semibold">Priority</label>
          <select
            className="form-select form-select-lg rounded-4"
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="col-lg-2">
          <label className="form-label fw-semibold">Category</label>
          <select
            className="form-select form-select-lg rounded-4"
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value)}
          >
            <option value="school">School</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="col-lg-2">
          <label className="form-label fw-semibold">Repeat</label>
          <select
            className="form-select form-select-lg rounded-4"
            value={taskFrequency}
            onChange={(e) => setTaskFrequency(e.target.value)}
          >
            <option value="once">One-time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="col-lg-10">
          <label className="form-label fw-semibold">Notes</label>
          <input
            type="text"
            className="form-control form-control-lg rounded-4"
            placeholder="Optional notes or context"
            value={taskNotes}
            onChange={(e) => setTaskNotes(e.target.value)}
          />
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
