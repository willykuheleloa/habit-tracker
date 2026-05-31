import { Plus } from "lucide-react";

function HabitForm({
  habitTitle,
  setHabitTitle,
  habitFrequency,
  setHabitFrequency,
  createHabit,
}) {
  return (
    <form onSubmit={createHabit} className="task-form-card mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-lg-7">
          <label className="form-label fw-semibold">Habit Name</label>

          <input
            type="text"
            className="form-control form-control-lg rounded-4"
            placeholder="Enter a habit to build"
            value={habitTitle}
            onChange={(e) => setHabitTitle(e.target.value)}
            required
          />
        </div>

        <div className="col-lg-3">
          <label className="form-label fw-semibold">Frequency</label>

          <select
            className="form-select form-select-lg rounded-4"
            value={habitFrequency}
            onChange={(e) => setHabitFrequency(e.target.value)}
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

export default HabitForm;
