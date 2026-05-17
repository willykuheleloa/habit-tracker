const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const { protect } = require("../middleware/authMiddleware");

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

router.get("/", protect, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });

    const totalHabits = habits.length;
    const totalCompletions = habits.reduce(
      (total, habit) => total + habit.completedDates.length,
      0
    );
    const bestStreak = habits.reduce(
      (best, habit) => Math.max(best, habit.streakCount),
      0
    );
    const averageStreak =
      totalHabits === 0
        ? 0
        : Number(
            (
              habits.reduce((total, habit) => total + habit.streakCount, 0) /
              totalHabits
            ).toFixed(1)
          );

    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const weeklyCompletions = dayLabels.map((day, index) => ({
      day,
      count: habits.reduce((total, habit) => {
        const matchesDay = habit.completedDates.filter((completedDate) => {
          const date = new Date(completedDate);
          return date >= startOfWeek && date.getDay() === index;
        });

        return total + matchesDay.length;
      }, 0),
    }));

    res.status(200).json({
      totalHabits,
      totalCompletions,
      bestStreak,
      averageStreak,
      weeklyCompletions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching analytics",
      error: error.message,
    });
  }
});

module.exports = router;
