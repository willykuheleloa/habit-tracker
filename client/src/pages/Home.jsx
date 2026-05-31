function Home({ token, setCurrentView, tasks = [], habits = [], analytics }) {
  const upcomingTasks = tasks.slice(0, 3);
  const currentHabits = habits.slice(0, 3);
  const username = localStorage.getItem("username");

  return (
    <section className="container py-5 px-4">
      <div className="mb-4">
        <h1 className="fw-bold">Hello{username ? `, ${username}` : ""}</h1>
        <p className="text-muted">
          Quick overview of your tasks, habits, and progress.
        </p>
      </div>

      {!token && (
        <div className="alert alert-warning">
          Please log in to view your dashboard.
        </div>
      )}

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Tasks</h5>

              {upcomingTasks.length === 0 ? (
                <p className="text-muted">No tasks yet.</p>
              ) : (
                upcomingTasks.map((task) => (
                  <div key={task._id} className="mb-3">
                    <p className="mb-1 fw-semibold">{task.title}</p>
                    <small className="text-muted">
                      Due:{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No due date"}
                    </small>
                  </div>
                ))
              )}

              <button
                className="btn btn-primary btn-sm mt-2"
                onClick={() => setCurrentView("tasks")}
              >
                View Tasks
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Habits</h5>

              {currentHabits.length === 0 ? (
                <p className="text-muted">No habits yet.</p>
              ) : (
                currentHabits.map((habit) => (
                  <div key={habit._id} className="mb-3">
                    <p className="mb-1 fw-semibold">{habit.title}</p>
                    <small className="text-muted">
                      Frequency: {habit.frequency}
                    </small>
                  </div>
                ))
              )}

              <button
                className="btn btn-success btn-sm mt-2"
                onClick={() => setCurrentView("habits")}
              >
                View Habits
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Progress</h5>

              <p className="mb-2">
                Total Habits:{" "}
                <span className="fw-bold">{analytics?.totalHabits || 0}</span>
              </p>

              <p className="mb-2">
                Best Streak:{" "}
                <span className="fw-bold">{analytics?.bestStreak || 0}</span>
              </p>

              <p className="mb-2">
                Total Completions:{" "}
                <span className="fw-bold">
                  {analytics?.totalCompletions || 0}
                </span>
              </p>

              <button
                className="btn btn-dark btn-sm mt-2"
                onClick={() => setCurrentView("dashboard")}
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mt-4">
        <div className="card-body p-4">
          <h5 className="fw-bold">AI Suggestion</h5>
          <p className="text-muted mb-0">
            Smart productivity suggestions will appear here based on your tasks
            and habits.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Home;
