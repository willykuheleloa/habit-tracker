const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

router.get("/", protect, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    const tasks = await Task.find({ userId: req.user.id });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = tasks.filter((task) => !task.completed).length;

    const taskCompletionRate =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

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

    const habitCompletionRate =
      totalHabits === 0
        ? 0
        : Math.min(100, Math.round((totalCompletions / totalHabits) * 100));

    const productivityScore = Math.round(
      (habitCompletionRate + taskCompletionRate + Math.min(bestStreak * 10, 100)) / 3
    );

    res.status(200).json({
      tasks: {
        totalTasks,
        completedTasks,
        pendingTasks,
        taskCompletionRate,
      },
      habits: {
        totalHabits,
        totalCompletions,
        bestStreak,
        averageStreak,
        habitCompletionRate,
        weeklyCompletions,
      },
      summary: {
        productivityScore,
        message:
          productivityScore >= 75
            ? "Strong productivity progress this week."
            : productivityScore >= 40
            ? "Good start. Keep completing tasks and habits to improve your score."
            : "Add and complete tasks and habits to build stronger productivity trends.",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching analytics",
      error: error.message,
    });
  }
});

module.exports = router;