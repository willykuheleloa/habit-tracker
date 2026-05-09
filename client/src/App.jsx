function App() {
  return (
    <div className="min-vh-100 bg-light w-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 w-100">
        {" "}
        <a className="navbar-brand fw-bold" href="#">
          Smart Task & Habit Tracker
        </a>
        <div className="ms-auto">
          <button className="btn btn-outline-light me-2">Login</button>
          <button className="btn btn-primary">Register</button>
        </div>
      </nav>

      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-7">
            <span className="badge bg-primary mb-3">
              Sprint 1 MVP Foundation
            </span>

            <h1 className="display-4 fw-bold mb-3">
              Build better habits. Track smarter tasks.
            </h1>

            <p className="lead text-muted mb-4">
              A productivity dashboard designed to help users manage tasks,
              track habits, monitor progress, and receive simple AI-based
              suggestions over time.
            </p>

            <button className="btn btn-primary btn-lg me-3">Get Started</button>
            <button className="btn btn-outline-secondary btn-lg">
              View Dashboard
            </button>
          </div>

          <div className="col-md-5 mt-4 mt-md-0">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">Today’s Preview</h4>

                <div className="mb-3">
                  <label className="form-label">Task Progress</label>
                  <div className="progress">
                    <div className="progress-bar" style={{ width: "65%" }}>
                      65%
                    </div>
                  </div>
                </div>

                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    Complete project setup
                    <span className="badge bg-success">Done</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    Track daily habit
                    <span className="badge bg-warning text-dark">Pending</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    Review progress
                    <span className="badge bg-secondary">Planned</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row text-center mt-5">
          <div className="col-md-3 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold">Authentication</h5>
                <p className="text-muted">Secure login and registration.</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold">Tasks</h5>
                <p className="text-muted">Create, edit, and complete tasks.</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold">Habits</h5>
                <p className="text-muted">Track routines and streaks.</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold">AI Suggestions</h5>
                <p className="text-muted">Simple insights based on progress.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
