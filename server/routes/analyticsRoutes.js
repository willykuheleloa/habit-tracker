const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const isTaskOverdue = (task) => {
  if (!task.dueDate || task.completed) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
};

const isDailyHabitMissedToday = (habit) => {
  if (habit.frequency?.toLowerCase() !== "daily") {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return !habit.completedDates.some((completedDate) => {
    const date = new Date(completedDate);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  });
};

const getFallbackSuggestion = ({
  overdueTasks,
  missedHabits,
  pendingTasks,
  totalHabits,
  totalCompletions,
  bestStreak,
}) => {
  if (overdueTasks > 0) {
    return {
      suggestion: `You have ${overdueTasks} overdue task${overdueTasks === 1 ? "" : "s"}.`,
      reason: "Tasks past their due date can build up quickly if they are not handled.",
      focusArea: "Missed Tasks",
      actionStep: "Start with the oldest overdue task today.",
    };
  }

  if (missedHabits > 0) {
    return {
      suggestion: `You have ${missedHabits} daily habit${missedHabits === 1 ? "" : "s"} not completed today.`,
      reason: "Completing daily habits consistently helps build stronger routines.",
      focusArea: "Missed Habits",
      actionStep: "Pick one daily habit and complete it before the day ends.",
    };
  }

  if (pendingTasks > 0) {
    return {
      suggestion: `You have ${pendingTasks} pending task${pendingTasks === 1 ? "" : "s"}.`,
      reason: "Finishing one small task can help you build momentum today.",
      focusArea: "Tasks",
      actionStep: "Pick the easiest pending task and complete it first.",
    };
  }

  if (totalHabits === 0) {
    return {
      suggestion: "Add one simple habit to start building a routine.",
      reason: "Small habits make your progress easier to track over time.",
      focusArea: "Habits",
      actionStep: "Create one habit you can complete daily.",
    };
  }

  if (totalCompletions === 0) {
    return {
      suggestion: "Complete one habit today to start building momentum.",
      reason: "Your habit tracker needs completed days to show progress.",
      focusArea: "Habits",
      actionStep: "Mark one habit as complete today.",
    };
  }

  return {
    suggestion: `Your best habit streak is ${bestStreak} day${bestStreak === 1 ? "" : "s"}. Keep it going.`,
    reason: "Consistency is one of the strongest signs of long-term progress.",
    focusArea: "Consistency",
    actionStep: "Complete the same habit again today.",
  };
};

const getAiSuggestion = async (summary, habits, tasks) => {
  if (!process.env.OPENAI_API_KEY) {
    return getFallbackSuggestion(summary);
  }

  try {
    const taskSummary = tasks.map((task) => ({
      title: task.title,
      completed: task.completed,
      dueDate: task.dueDate,
      isOverdue: isTaskOverdue(task),
    }));

    const habitSummary = habits.map((habit) => ({
      title: habit.title,
      frequency: habit.frequency,
      streakCount: habit.streakCount,
      isMissedToday: isDailyHabitMissedToday(habit),
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
              "You are a productivity coach for a student task and habit tracker app. Return only valid JSON with these exact keys: suggestion, reason, focusArea, actionStep. Prioritize overdue tasks, missed daily habits, pending tasks, then habit consistency. Keep each value short, specific, and helpful. Do not invent data.",
          },
          {
            role: "user",
            content: `Based on this user's task and habit data, create one helpful AI productivity suggestion.

              Return only JSON in this format:
              {
                "suggestion": "",
                "reason": "",
                "focusArea": "",
                "actionStep": ""
              }

              Summary:
              ${JSON.stringify(summary)}

              Tasks:
              ${JSON.stringify(taskSummary)}

              Habits:
              ${JSON.stringify(habitSummary)}`,
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

    try {
      return JSON.parse(text);
    } catch {
      return getFallbackSuggestion(summary);
    }
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
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const totalHabits = habits.length;

    const totalCompletions = habits.reduce(
      (total, habit) => total + habit.completedDates.length,
      0,
    );

    const bestStreak = habits.reduce(
      (best, habit) => Math.max(best, habit.streakCount),
      0,
    );

    const averageStreak =
      totalHabits === 0
        ? 0
        : Number(
            (
              habits.reduce((total, habit) => total + habit.streakCount, 0) /
              totalHabits
            ).toFixed(1),
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
      (habitCompletionRate +
        taskCompletionRate +
        Math.min(bestStreak * 10, 100)) /
        3,
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
    const overdueTasks = tasks.filter((task) => isTaskOverdue(task)).length;
    const totalHabits = habits.length;
    const missedHabits = habits.filter((habit) =>
      isDailyHabitMissedToday(habit),
    ).length;

    const totalCompletions = habits.reduce(
      (total, habit) => total + habit.completedDates.length,
      0,
    );

    const bestStreak = habits.reduce(
      (best, habit) => Math.max(best, habit.streakCount),
      0,
    );

    const summary = {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      totalHabits,
      missedHabits,
      totalCompletions,
      bestStreak,
    };

    const suggestion = await getAiSuggestion(summary, habits, tasks);
    res.status(200).json(suggestion);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching AI suggestion",
      error: error.message,
    });
  }
});

module.exports = router;
