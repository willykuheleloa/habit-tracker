import { useEffect, useState } from "react";
import toastr from "toastr";
import HabitForm from "../components/HabitForm";
import HabitCard from "../components/HabitCard";
import {
  completeHabitRequest,
  createHabitRequest,
  deleteHabitRequest,
  getHabits,
} from "../services/api";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [habitTitle, setHabitTitle] = useState("");
  const [habitFrequency, setHabitFrequency] = useState("daily");
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
      });

      setHabits([newHabit, ...habits]);
      setHabitTitle("");
      setHabitFrequency("daily");
      toastr.success("Habit created.");
    } catch (error) {
      console.error(error);
      toastr.error("Unable to create habit.");
    }
  };

  const completeHabit = async (id) => {
    try {
      const updatedHabit = await completeHabitRequest(id);

      setHabits(
        habits.map((habit) => (habit._id === id ? updatedHabit : habit)),
      );

      toastr.success("Habit completed.");
    } catch (error) {
      console.error(error);
      toastr.error("Unable to complete habit.");
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

  return (
    <section className="container py-5 px-4">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-5">
          <h2 className="fw-bold mb-2">Habit Tracker</h2>

          <p className="text-muted">
            Build consistency by tracking daily, weekly, and monthly habits.
          </p>

          <HabitForm
            habitTitle={habitTitle}
            setHabitTitle={setHabitTitle}
            habitFrequency={habitFrequency}
            setHabitFrequency={setHabitFrequency}
            createHabit={createHabit}
          />

          {loading ? (
            <p className="text-muted">Loading habits...</p>
          ) : habits.length === 0 ? (
            <p className="text-muted">No habits yet. Add one above.</p>
          ) : (
            <div className="row g-4 mt-2">
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
