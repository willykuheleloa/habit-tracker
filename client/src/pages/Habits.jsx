import { useEffect, useState } from "react";
import toastr from "toastr";
import HabitForm from "../components/HabitForm";
import HabitCard from "../components/HabitCard";
import {
  checkInHabitRequest,
  createHabitRequest,
  deleteHabitRequest,
  editHabitRequest,
  getHabits,
} from "../services/api";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [habitTitle, setHabitTitle] = useState("");
  const [habitFrequency, setHabitFrequency] = useState("daily");
  const [habitCategory, setHabitCategory] = useState("health");
  const [editingHabit, setEditingHabit] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (error) {
      console.error(error);
      toastr.error("Unable to load habits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const createHabit = async (e) => {
    e.preventDefault();

    try {
      const newHabit = await createHabitRequest({
        title: habitTitle,
        frequency: habitFrequency,
        category: habitCategory,
      });

      setHabits([newHabit, ...habits]);
      setHabitTitle("");
      setHabitFrequency("daily");
      setHabitCategory("health");
      toastr.success("Habit created.");
    } catch (error) {
      console.error(error);
      toastr.error("Unable to create habit.");
    }
  };

  const checkInHabit = async (id) => {
    try {
      const updatedHabit = await checkInHabitRequest(id);

      setHabits((currentHabits) =>
        currentHabits.map((habit) => (habit._id === id ? updatedHabit : habit)),
      );

      toastr.success("Habit checked in.");
    } catch (error) {
      console.error(error);
      toastr.error(error.message || "Unable to check in habit.");
    }
  };

  const deleteHabit = async (id) => {
    try {
      await deleteHabitRequest(id);
      setHabits(habits.filter((habit) => habit._id !== id));
      toastr.success("Habit deleted.");
    } catch (error) {
      console.error(error);
      toastr.error("Unable to delete habit.");
    }
  };

  const saveHabitEdit = async (e) => {
    e.preventDefault();

    try {
      const updatedHabit = await editHabitRequest(editingHabit._id, {
        title: editingHabit.title,
        frequency: editingHabit.frequency,
        category: editingHabit.category,
      });

      setHabits((currentHabits) =>
        currentHabits.map((habit) =>
          habit._id === updatedHabit._id ? updatedHabit : habit,
        ),
      );

      setEditingHabit(null);
      toastr.success("Habit updated.");
    } catch (error) {
      console.error(error);
      toastr.error("Unable to update habit.");
    }
  };

  const totalHabits = habits.length;
  const bestStreak = habits.reduce(
    (best, habit) => Math.max(best, habit.bestStreak || habit.streakCount || 0),
    0,
  );
  const completedToday = habits.filter((habit) =>
    habit.lastCompletedAt
      ? new Date(habit.lastCompletedAt).toDateString() ===
        new Date().toDateString()
      : false,
  ).length;
  const averageConsistency =
    totalHabits === 0
      ? 0
      : Math.round(
          habits.reduce(
            (total, habit) => total + (habit.consistencyScore || 0),
            0,
          ) / totalHabits,
        );

  return (
    <section className="container py-5 px-4">
      <div className="dashboard-hero mb-4">
        <div>
          <p className="text-uppercase fw-semibold text-primary mb-2">
            Behavioral Tracking
          </p>

          <h1 className="fw-bold mb-2">Habit Intelligence</h1>

          <p className="text-muted mb-0">
            Track consistency, momentum, streaks, and behavior patterns that
            power AI coaching.
          </p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <p className="text-muted mb-1">Total Habits</p>
            <h3 className="fw-bold mb-0">{totalHabits}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="stat-card">
            <p className="text-muted mb-1">Completed Today</p>
            <h3 className="fw-bold mb-0">{completedToday}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="stat-card">
            <p className="text-muted mb-1">Best Streak</p>
            <h3 className="fw-bold mb-0">{bestStreak} days</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="stat-card">
            <p className="text-muted mb-1">Avg. Consistency</p>
            <h3 className="fw-bold mb-0">{averageConsistency}%</h3>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4 p-md-5">
          <HabitForm
            habitTitle={habitTitle}
            setHabitTitle={setHabitTitle}
            habitFrequency={habitFrequency}
            setHabitFrequency={setHabitFrequency}
            habitCategory={habitCategory}
            setHabitCategory={setHabitCategory}
            createHabit={createHabit}
          />

          {loading ? (
            <p className="text-muted">Loading habits...</p>
          ) : habits.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="fw-bold">No habits yet</h4>
              <p className="text-muted mb-0">
                Add your first habit to begin tracking behavioral consistency.
              </p>
            </div>
          ) : (
            <div className="row g-4 mt-2">
              {habits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  checkInHabit={checkInHabit}
                  deleteHabit={deleteHabit}
                  openEditHabit={setEditingHabit}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {editingHabit && (
        <div className="modal-backdrop-custom">
          <div className="modal-content-custom">
            <h4 className="fw-bold mb-4">Edit Habit</h4>

            <form onSubmit={saveHabitEdit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Habit Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingHabit.title}
                  onChange={(e) =>
                    setEditingHabit({ ...editingHabit, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select
                  className="form-select"
                  value={editingHabit.category || "other"}
                  onChange={(e) =>
                    setEditingHabit({
                      ...editingHabit,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="health">Health</option>
                  <option value="focus">Focus</option>
                  <option value="discipline">Discipline</option>
                  <option value="learning">Learning</option>
                  <option value="wellness">Wellness</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Frequency</label>
                <select
                  className="form-select"
                  value={editingHabit.frequency || "daily"}
                  onChange={(e) =>
                    setEditingHabit({
                      ...editingHabit,
                      frequency: e.target.value,
                    })
                  }
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-dark rounded-4 flex-fill"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-4 flex-fill"
                  onClick={() => setEditingHabit(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Habits;
