import { useState } from "react";
import { X } from "lucide-react";

function EditTaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: task.title || "",
    notes: task.notes || "",
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : "",
    frequency: task.frequency || "once",
    priority: task.priority || "medium",
    category: task.category || "other",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return alert("Task title is required");
    }

    onSave(formData);
  };

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-content-custom">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">Edit Task</h4>

          <button className="btn btn-light rounded-circle" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Task Title</label>

            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Notes</label>

            <textarea
              name="notes"
              className="form-control"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Due Date</label>

              <input
                type="date"
                name="dueDate"
                className="form-control"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Frequency</label>

              <select
                name="frequency"
                className="form-select"
                value={formData.frequency}
                onChange={handleChange}
              >
                <option value="once">One Time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Priority</label>

              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label">Category</label>

              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="work">Work</option>
                <option value="school">School</option>
                <option value="health">Health</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100 rounded-4">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;
