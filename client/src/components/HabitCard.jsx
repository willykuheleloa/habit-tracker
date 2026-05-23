function HabitCard({ habit, completeHabit, deleteHabit }) {
  return (
    <div className="col-md-6 mb-3">
      <div className="card h-100 border">
        <div className="card-body">
          <h5 className="fw-bold">{habit.title}</h5>
          <p className="mb-1">Frequency: {habit.frequency}</p>
          <p className="mb-3">
            Current Streak:{" "}
            <span className="badge bg-success">{habit.streakCount}</span>
          </p>

          <button
            className="btn btn-success btn-sm me-2"
            onClick={() => completeHabit(habit._id)}
          >
            Mark Complete
          </button>

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => deleteHabit(habit._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default HabitCard;
