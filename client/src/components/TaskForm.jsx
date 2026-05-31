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
    <form onSubmit={createTask} className="row g-2 mb-4">
      <div className="col-md-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
        />
      </div>

      <div className="col-md-3">
        <input
          type="date"
          className="form-control"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
        />
      </div>

      <div className="col-md-2">
        <select
          className="form-select"
          value={taskFrequency}
          onChange={(e) => setTaskFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="col-md-2 d-grid">
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
