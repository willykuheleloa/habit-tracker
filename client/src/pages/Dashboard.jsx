function Dashboard({
  analytics,
  weeklyCompletions,
  weeklyMax,
  usingDemoAnalytics,
  setCurrentView,
}) {
  const taskData = analytics.tasks || {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    taskCompletionRate: 0,
    status: "Task analytics will populate once task data is available.",
  };

  const habitData = analytics.habits || {
    totalHabits: 0,
    totalCompletions: 0,
    bestStreak: 0,
    averageStreak: 0,
    habitCompletionRate: 0,
    weeklyCompletions: [],
  };

  const summary = analytics.summary || {
    productivityScore: 0,
    message: "Dashboard analytics will appear after activity is recorded.",
  };

  return (
    <section className="container py-5">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-2">Dashboard & Analytics</h2>
              <p className="text-muted mb-0">
                View task statistics, habit streaks, completion percentages,
                and productivity summaries.
              </p>
            </div>

            <button
              className="btn btn-outline-secondary btn-sm align-self-md-start"
              onClick={() => setCurrentView("home")}
            >
              Back to Home
            </button>
          </div>

          {usingDemoAnalytics && (
            <div className="alert alert-info">
              Demo analytics are shown until a login token is available.
            </div>
          )}

          <div className="bg-light border rounded p-3 mb-4">
            <h4 className="fw-bold mb-3">Productivity Summary</h4>

            <div className="row text-center">
              <div className="col-md-4 mb-3">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="text-muted">Productivity Score</h6>
                    <h3 className="fw-bold mb-0">
                      {summary.productivityScore}%
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-8 mb-3">
                <div className="card h-100 border">
                  <div className="card-body text-start">
                    <h6 className="text-muted">Summary</h6>
                    <p className="mb-0">{summary.message}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-light border rounded p-3 mb-4">
            <h4 className="fw-bold mb-3">Task Analytics</h4>

            <div className="row text-center">
              <div className="col-md-3 mb-3">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="text-muted">Total Tasks</h6>
                    <h3 className="fw-bold mb-0">{taskData.totalTasks}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="text-muted">Completed</h6>
                    <h3 className="fw-bold mb-0">
                      {taskData.completedTasks}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="text-muted">Pending</h6>
                    <h3 className="fw-bold mb-0">{taskData.pendingTasks}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="text-muted">Completion Rate</h6>
                    <h3 className="fw-bold mb-0">
                      {taskData.taskCompletionRate}%
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {taskData.status && (
              <div className="alert alert-secondary mb-0">
                {taskData.status}
              </div>
            )}
          </div>

          <div className="bg-light border rounded p-3 mb-4">
            <h4 className="fw-bold mb-3">Habit Analytics</h4>

            <div className="row text-center">
              <div className="col-md-3 mb-3">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="text-muted">Current Habits</h6>
                    <h3 className="fw-bold mb-0">{habitData.totalHabits}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="text-muted">Completions</h6>
                    <h3 className="fw-bold mb-0">
                      {habitData.totalCompletions}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="text-muted">Best Streak</h6>
                    <h3 className="fw-bold mb-0">
                      {habitData.bestStreak} days
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="text-muted">Habit Rate</h6>
                    <h3 className="fw-bold mb-0">
                      {habitData.habitCompletionRate}%
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-light border rounded p-3">
            <h4 className="fw-bold mb-3">Weekly Habit Activity</h4>

            {weeklyCompletions.length === 0 ? (
              <p className="text-muted mb-0">
                No weekly completion data available yet.
              </p>
            ) : (
              weeklyCompletions.map((item) => (
                <div key={item.day} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{item.day}</span>
                    <span>{item.count}</span>
                  </div>

                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(item.count / weeklyMax) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;