import { useEffect, useState } from "react";
import {
  getHabits,
  getAnalytics,
  createHabitRequest,
  completeHabitRequest,
  deleteHabitRequest,
} from "./services/api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Habits from "./pages/Habits";

function App() {
  const [habits, setHabits] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [currentView, setCurrentView] = useState(
    localStorage.getItem("token") ? "home" : "register",
  );
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("Daily");

  const token = localStorage.getItem("token");
  const analytics = analyticsData || {
    totalHabits: 0,
    totalCompletions: 0,
    bestStreak: 0,
    averageStreak: 0,
    weeklyCompletions: [],
  };
  const weeklyCompletions = analytics.weeklyCompletions || [];
  const usingDemoAnalytics = false;
  const weeklyMax = Math.max(...weeklyCompletions.map((item) => item.count), 1);

  const fetchHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const createHabit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please log in before adding habits.");
      return;
    }

    try {
      const newHabit = await createHabitRequest({ title, frequency });
      setHabits([...habits, newHabit]);
      setTitle("");
      setFrequency("Daily");

      fetchAnalytics();
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  const completeHabit = async (id) => {
    try {
      const updatedHabit = await completeHabitRequest(id);

      setHabits(
        habits.map((habit) => (habit._id === id ? updatedHabit : habit)),
      );

      if (token) {
        fetchAnalytics();
      }
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await deleteHabitRequest(id);

      setHabits(habits.filter((habit) => habit._id !== id));

      if (token) {
        fetchAnalytics();
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHabits();
      fetchAnalytics();
    }
  }, []);

  return (
    <div className="min-vh-100 bg-light w-100">
      <Navbar token={token} setCurrentView={setCurrentView} />
      {currentView === "home" && (
        <>
          <Home token={token} setCurrentView={setCurrentView} />

          <Habits
            token={token}
            habits={habits}
            title={title}
            setTitle={setTitle}
            frequency={frequency}
            setFrequency={setFrequency}
            createHabit={createHabit}
            completeHabit={completeHabit}
            deleteHabit={deleteHabit}
          />
        </>
      )}

      {currentView === "login" && <Login setCurrentView={setCurrentView} />}

      {currentView === "register" && (
        <Register setCurrentView={setCurrentView} />
      )}

      {currentView === "dashboard" && (
        <Dashboard
          analytics={analytics}
          weeklyCompletions={weeklyCompletions}
          weeklyMax={weeklyMax}
          usingDemoAnalytics={usingDemoAnalytics}
          setCurrentView={setCurrentView}
        />
      )}
    </div>
  );
}

export default App;
