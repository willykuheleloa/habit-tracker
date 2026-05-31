const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getFallbackSuggestion = ({ pendingTasks, totalHabits, totalCompletions, bestStreak }) => {
  if (pendingTasks > 0) {
    const taskLabel = pendingTasks === 1 ? "task" : "tasks";
    return `You have ${pendingTasks} pending ${taskLabel}. Try finishing one small task today.`;
  }

  if (totalHabits === 0) {
    return "Add one simple habit to start building a routine.";
  }

  if (totalCompletions === 0) {
    return "Complete one habit today to start building momentum.";
  }

  const dayLabel = bestStreak === 1 ? "day" : "days";
  return `Your best habit streak is ${bestStreak} ${dayLabel}. Keep that routine going.`;
};

const getAiSuggestion = async (summary, habits, tasks) => {
  if (!process.env.OPENAI_API_KEY) {
    return getFallbackSuggestion(summary);
  }

  try {
    const taskSummary = tasks.map((task) => ({
      title: task.title,
      completed: task.completed,
    }));

    const habitSummary = habits.map((habit) => ({
      title: habit.title,
      frequency: habit.frequency,
      streakCount: habit.streakCount,
      completedDates: habit.completedDates.slice(-10),
    }));

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0,
        input: [
          {
            role: "system",
            content:
              "You are a productivity coach for a student habit tracker app. Give one simple, specific, actionable suggestion. Do not invent information that is not provided.",
          },
          {
            role: "user",
            content: `Return exactly one short productivity suggestion based on this data.\n\nSummary:\n${JSON.stringify(
              summary
            )}\n\nTasks:\n${JSON.stringify(
              taskSummary
            )}\n\nHabits:\n${JSON.stringify(habitSummary)}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "OpenAI request failed");
    }

    const text =
      data.output_text ||
      data.output
        ?.flatMap((item) => item.content || [])
        ?.map((content) => content.text || "")
        ?.join("\n") ||
      "";

    return text.trim() || getFallbackSuggestion(summary);
  } catch (error) {
    console.error("AI suggestion error:", error.message);
    return getFallbackSuggestion(summary);
  }
};

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

router.get("/suggestion", protect, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    const tasks = await Task.find({ userId: req.user.id });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = tasks.filter((task) => !task.completed).length;
    const totalHabits = habits.length;

    const totalCompletions = habits.reduce(
      (total, habit) => total + habit.completedDates.length,
      0
    );

    const bestStreak = habits.reduce(
      (best, habit) => Math.max(best, habit.streakCount),
      0
    );

    const summary = {
      totalTasks,
      completedTasks,
      pendingTasks,
      totalHabits,
      totalCompletions,
      bestStreak,
    };

    const suggestion = await getAiSuggestion(summary, habits, tasks);
    res.status(200).json({ suggestion });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching AI suggestion",
      error: error.message,
    });
  }
});

module.exports = router;
