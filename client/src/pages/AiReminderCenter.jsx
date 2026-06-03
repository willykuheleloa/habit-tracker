import { useEffect, useState } from "react";

import { Bell, TriangleAlert, Brain, Flame } from "lucide-react";

import { getAiReminders } from "../services/api";

function AiReminderCenter() {
  const [reminders, setReminders] = useState([]);

  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const data = await getAiReminders();

      setReminders(data.reminders || []);

      setSummary(data.summary || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityClass = (severity) => {
    if (severity === "high") {
      return "border-danger bg-danger-subtle";
    }

    if (severity === "medium") {
      return "border-warning bg-warning-subtle";
    }

    return "border-primary bg-primary-subtle";
  };

  const getSeverityIcon = (severity) => {
    if (severity === "high") {
      return <TriangleAlert size={22} />;
    }

    if (severity === "medium") {
      return <Bell size={22} />;
    }

    return <Brain size={22} />;
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">AI Reminder Center</h2>

          <p className="text-muted mb-0">
            Smart productivity reminders and focus recommendations.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Flame size={20} />

          <span className="fw-semibold">AI Productivity Assistant</span>
        </div>
      </div>

      {summary && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3">
              <h6 className="text-muted">Total Reminders</h6>

              <h3 className="fw-bold">{summary.totalReminders}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3">
              <h6 className="text-muted">Overdue Tasks</h6>

              <h3 className="fw-bold text-danger">{summary.overdueTasks}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3">
              <h6 className="text-muted">Due Today</h6>

              <h3 className="fw-bold text-warning">{summary.dueTodayTasks}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3">
              <h6 className="text-muted">High Priority</h6>

              <h3 className="fw-bold text-primary">
                {summary.highPriorityTasks}
              </h3>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" />

          <p className="mt-3 text-muted">Generating AI reminders...</p>
        </div>
      ) : (
        <div className="row g-4">
          {reminders.map((reminder, index) => (
            <div className="col-lg-6" key={index}>
              <div
                className={`card border-2 shadow-sm rounded-4 h-100 ${getSeverityClass(
                  reminder.severity,
                )}`}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    {getSeverityIcon(reminder.severity)}

                    <h5 className="fw-bold mb-0">{reminder.title}</h5>
                  </div>

                  <p className="mb-3">{reminder.message}</p>

                  <div className="card border-0 rounded-4 bg-white p-3">
                    <small className="text-muted d-block mb-1">
                      Recommended Action
                    </small>

                    <strong>{reminder.actionStep}</strong>
                  </div>

                  {reminder.relatedTask && (
                    <div className="mt-3">
                      <small className="text-muted">Related Task</small>

                      <div className="fw-semibold">
                        {reminder.relatedTask.title}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AiReminderCenter;
