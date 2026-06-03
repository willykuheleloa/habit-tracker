const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Habit = require("../models/Habit");
const { protect } = require("../middleware/authMiddleware");

const isToday = (date) => {
  const today = new Date();
  const targetDate = new Date(date);

  return (
    today.getFullYear() === targetDate.getFullYear() &&
    today.getMonth() === targetDate.getMonth() &&
    today.getDate() === targetDate.getDate()
  );
};

const formatTask = (task) => ({
  id: task._id,
  title: task.title,
  dueDate: task.dueDate,
  priority: task.priority || "medium",
  category: task.category || "other",
  frequency: task.frequency || "once",
});

router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    const habits = await Habit.find({ userId: req.user.id });

    const now = new Date();

    const activeTasks = tasks.filter((task) => !task.completed);

    const overdueTasks = activeTasks.filter(
      (task) => task.dueDate && new Date(task.dueDate) < now,
    );

    const dueTodayTasks = activeTasks.filter(
      (task) => task.dueDate && isToday(task.dueDate),
    );

    const highPriorityTasks = activeTasks.filter(
      (task) => task.priority === "high",
    );

    const lowStreakHabits = habits.filter(
      (habit) => (habit.streakCount || 0) < 3,
    );

    const reminders = [];

    if (overdueTasks.length > 0) {
      const firstTask = overdueTasks[0];

      reminders.push({
        type: "overdue",
        severity: "high",
        title: "Overdue Task Reminder",
        message: `You have ${overdueTasks.length} overdue task${
          overdueTasks.length === 1 ? "" : "s"
        }. Start with "${firstTask.title}" first.`,
        actionStep: `Complete or reschedule "${firstTask.title}" before starting new work.`,
        relatedTask: formatTask(firstTask),
      });
    }

    if (highPriorityTasks.length > 0) {
      const firstTask = highPriorityTasks[0];

      reminders.push({
        type: "priority",
        severity: "medium",
        title: "High Priority Focus",
        message: `"${firstTask.title}" is marked high priority and still needs attention.`,
        actionStep:
          "Work on one high-priority task before lower-priority tasks.",
        relatedTask: formatTask(firstTask),
      });
    }

    if (dueTodayTasks.length > 0) {
      const firstTask = dueTodayTasks[0];

      reminders.push({
        type: "dueToday",
        severity: "medium",
        title: "Due Today",
        message: `You have ${dueTodayTasks.length} task${
          dueTodayTasks.length === 1 ? "" : "s"
        } due today.`,
        actionStep: `Start with "${firstTask.title}" to stay on schedule.`,
        relatedTask: formatTask(firstTask),
      });
    }

    if (lowStreakHabits.length > 0) {
      const firstHabit = lowStreakHabits[0];

      reminders.push({
        type: "habit",
        severity: "low",
        title: "Habit Consistency Reminder",
        message: `"${firstHabit.title}" has a low streak right now.`,
        actionStep: "Complete one habit today to rebuild momentum.",
        relatedHabit: {
          id: firstHabit._id,
          title: firstHabit.title,
          frequency: firstHabit.frequency,
          streakCount: firstHabit.streakCount || 0,
        },
      });
    }

    if (reminders.length === 0) {
      reminders.push({
        type: "momentum",
        severity: "low",
        title: "Momentum Reminder",
        message:
          "No major issues detected. Keep your productivity streak going.",
        actionStep: "Complete one task or habit today to maintain progress.",
        relatedTask: null,
      });
    }

    res.status(200).json({
      reminders,
      summary: {
        totalReminders: reminders.length,
        overdueTasks: overdueTasks.length,
        dueTodayTasks: dueTodayTasks.length,
        highPriorityTasks: highPriorityTasks.length,
        lowStreakHabits: lowStreakHabits.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating AI reminders",
      error: error.message,
    });
  }
});

module.exports = router;
