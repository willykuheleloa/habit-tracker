function Dashboard({
  analytics,
  weeklyCompletions,
  weeklyMax,
  usingDemoAnalytics,
  setCurrentView,
}) {
  return (
    <section className="container py-5">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-2">Dashboard & Analytics</h2>
              <p className="text-muted mb-0">
                Current dashboard metrics use habit data. Task and overview
                analytics are structured for integration as those modules are
                completed.
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
            <h4 className="fw-bold mb-3">Habit Analytics</h4>

            <div className="row text-center">
              <div className="col-md-3 mb-3">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="text-muted">Current Habits</h6>
                    <h3 className="fw-bold mb-0">{analytics.totalHabits}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="text-muted">Completions</h6>
                    <h3 className="fw-bold mb-0">
                      {analytics.totalCompletions}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="text-muted">Best Streak</h6>
                    <h3 className="fw-bold mb-0">
                      {analytics.bestStreak} days
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="text-muted">Average Streak</h6>
                    <h3 className="fw-bold mb-0">{analytics.averageStreak}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-light border rounded p-3 mb-4">
            <h4 className="fw-bold mb-3">Weekly Activity</h4>

            {weeklyCompletions.map((item) => (
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
            ))}
          </div>

          <div className="bg-light border rounded p-3">
            <h4 className="fw-bold mb-3">Task Analytics</h4>

            <div className="alert alert-secondary mb-0">
              Task analytics will connect here after Task Management is
              integrated.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
