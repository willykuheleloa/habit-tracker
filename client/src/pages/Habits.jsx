import HabitForm from "../components/HabitForm";
import HabitCard from "../components/HabitCard";

function Habits({
  token,
  habits,
  title,
  setTitle,
  frequency,
  setFrequency,
  createHabit,
  completeHabit,
  deleteHabit,
}) {
  return (
    <section className="container py-5 px-4">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-5">
          <h2 className="fw-bold mb-2">Habit Tracking</h2>

          <p className="text-muted">
            Create habits, monitor streaks, and track progress over time.
          </p>

          {!token && (
            <div className="alert alert-warning">
              No login token found. Please log in first so habits can load.
            </div>
          )}

          <HabitForm
            title={title}
            setTitle={setTitle}
            frequency={frequency}
            setFrequency={setFrequency}
            createHabit={createHabit}
          />

          {habits.length === 0 ? (
            <p className="text-muted">No habits yet. Add one above.</p>
          ) : (
            <div className="row">
              {habits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  completeHabit={completeHabit}
                  deleteHabit={deleteHabit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Habits;
