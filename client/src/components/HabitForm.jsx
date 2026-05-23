function HabitForm({ title, setTitle, frequency, setFrequency, createHabit }) {
  return (
    <form onSubmit={createHabit} className="row g-2 mb-4">
      <div className="col-md-7">
        <input
          type="text"
          className="form-control"
          placeholder="Enter habit title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="col-md-3">
        <select
          className="form-select"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      <div className="col-md-2 d-grid">
        <button type="submit" className="btn btn-primary">
          Add Habit
        </button>
      </div>
    </form>
  );
}

export default HabitForm;
