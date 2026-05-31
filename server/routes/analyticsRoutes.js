const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const isSameDay = (dateA, dateB) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

const formatTask = (task) => ({
  id: task._id,
  title: task.title,
  dueDate: task.dueDate,
  priority: task.priority || "medium",
  category: task.category || "other",
  frequency: task.frequency || "once",
  completed: task.completed,
});

const getTaskInsights = (tasks) => {
  const now = new Date();

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const overdueTasks = activeTasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < now,
  );

  const dueTodayTasks = activeTasks.filter(
    (task) => task.dueDate && isSameDay(new Date(task.dueDate), now),
  );

  const highPriorityPending = activeTasks.filter(
    (task) => task.priority === "high",
  );

  const recurringTasks = tasks.filter((task) => task.frequency !== "once");
  const oneTimeTasks = tasks.filter((task) => task.frequency === "once");

  const categories = ["school", "work", "personal", "health", "other"];

  const categoryBreakdown = categories.map((category) => {
    const categoryTasks = tasks.filter((task) => task.category === category);
    const completedCategoryTasks = categoryTasks.filter(
      (task) => task.completed,
    );
    const pendingCategoryTasks = categoryTasks.filter(
      (task) => !task.completed,
    );

    return {
      category,
      total: categoryTasks.length,
      completed: completedCategoryTasks.length,
      pending: pendingCategoryTasks.length,
      completionRate:
        categoryTasks.length === 0
          ? 0
          : Math.round(
              (completedCategoryTasks.length / categoryTasks.length) * 100,
            ),
      tasks: pendingCategoryTasks.map(formatTask).slice(0, 5),
    };
  });

  const weakestCategory = categoryBreakdown
    .filter((item) => item.total > 0)
    .sort((a, b) => a.completionRate - b.completionRate)[0];

  const strongestCategory = categoryBreakdown
    .filter((item) => item.total > 0)
    .sort((a, b) => b.completionRate - a.completionRate)[0];

  return {
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    pendingTasks: activeTasks.length,
    taskCompletionRate:
      tasks.length === 0
        ? 0
        : Math.round((completedTasks.length / tasks.length) * 100),

    overdueTasks: overdueTasks.length,
    dueTodayTasks: dueTodayTasks.length,
    highPriorityPending: highPriorityPending.length,

    overdueTaskList: overdueTasks.map(formatTask).slice(0, 5),
    dueTodayTaskList: dueTodayTasks.map(formatTask).slice(0, 5),
    highPriorityTaskList: highPriorityPending.map(formatTask).slice(0, 5),

    recurringTasks: recurringTasks.length,
    oneTimeTasks: oneTimeTasks.length,
    categoryBreakdown,

    weakestCategory: weakestCategory || null,
    strongestCategory: strongestCategory || null,
    weakestCategoryTasks: weakestCategory?.tasks || [],
    strongestCategoryTasks: strongestCategory?.tasks || [],
  };
};

const getHabitInsights = (habits) => {
  const totalHabits = habits.length;

  const totalCompletions = habits.reduce(
    (total, habit) => total + habit.completedDates.length,
    0,
  );

  const bestStreak = habits.reduce(
    (best, habit) => Math.max(best, habit.streakCount || 0),
    0,
  );

  const averageStreak =
    totalHabits === 0
      ? 0
      : Number(
          (
            habits.reduce(
              (total, habit) => total + (habit.streakCount || 0),
              0,
            ) / totalHabits
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

  const strongestHabit =
    habits.length === 0
      ? null
      : [...habits].sort(
          (a, b) => (b.streakCount || 0) - (a.streakCount || 0),
        )[0];

  const weakestHabit =
    habits.length === 0
      ? null
      : [...habits].sort(
          (a, b) => (a.streakCount || 0) - (b.streakCount || 0),
        )[0];

  const habitCompletionRate =
    totalHabits === 0
      ? 0
      : Math.min(100, Math.round((totalCompletions / totalHabits) * 100));

  return {
    totalHabits,
    totalCompletions,
    bestStreak,
    averageStreak,
    habitCompletionRate,
    weeklyCompletions,
    strongestHabit: strongestHabit
      ? {
          title: strongestHabit.title,
          streakCount: strongestHabit.streakCount || 0,
        }
      : null,
    weakestHabit: weakestHabit
      ? {
          title: weakestHabit.title,
          streakCount: weakestHabit.streakCount || 0,
        }
      : null,
  };
};

const getImprovementAreas = (taskInsights, habitInsights) => {
  const areas = [];

  if (taskInsights.overdueTasks > 0) {
    areas.push({
      title: "Overdue Tasks",
      message: `You have ${taskInsights.overdueTasks} overdue task${
        taskInsights.overdueTasks === 1 ? "" : "s"
      }. Clear these first to reduce stress.`,
      severity: "high",
      tasks: taskInsights.overdueTaskList,
    });
  }

  if (taskInsights.highPriorityPending > 0) {
    areas.push({
      title: "High Priority Focus",
      message: `${taskInsights.highPriorityPending} high-priority task${
        taskInsights.highPriorityPending === 1 ? " needs" : "s need"
      } attention.`,
      severity: "medium",
      tasks: taskInsights.highPriorityTaskList,
    });
  }

  if (taskInsights.weakestCategory) {
    areas.push({
      title: "Weakest Category",
      message: `${taskInsights.weakestCategory.category} has your lowest task completion rate at ${taskInsights.weakestCategory.completionRate}%.`,
      severity: "medium",
      tasks: taskInsights.weakestCategoryTasks,
    });
  }

  if (habitInsights.totalHabits > 0 && habitInsights.bestStreak < 3) {
    areas.push({
      title: "Habit Consistency",
      message:
        "Your habit streaks are still building. Focus on one habit for the next 3 days.",
      severity: "low",
      tasks: [],
    });
  }

  return areas.slice(0, 3);
};

const buildSummaryMessage = (
  productivityScore,
  taskInsights,
  habitInsights,
) => {
  if (taskInsights.overdueTasks > 0) {
    return "Your first priority should be clearing overdue tasks before starting new work.";
  }

  if (taskInsights.highPriorityPending > 0) {
    return "You have important work waiting. Focus on high-priority tasks first.";
  }

  if (productivityScore >= 80) {
    return "Strong productivity momentum. Keep protecting your habits and top priorities.";
  }

  if (productivityScore >= 50) {
    return "Good progress. A little more consistency with tasks and habits will raise your score.";
  }

  if (habitInsights.totalHabits === 0 && taskInsights.totalTasks === 0) {
    return "Add your first tasks and habits to start building productivity data.";
  }

  return "You have a foundation started. Focus on one task and one habit today.";
};

const getFallbackSuggestion = (summary) => {
  const firstOverdue = summary.tasks.overdueTaskList?.[0];
  const firstHighPriority = summary.tasks.highPriorityTaskList?.[0];

  if (firstOverdue) {
    return {
      suggestion: `Start with "${firstOverdue.title}".`,
      reason:
        "This task is overdue, so completing or rescheduling it should reduce pressure first.",
      focusArea: "Overdue Work",
      actionStep: `Open "${firstOverdue.title}" and either complete it or update the due date.`,
      improvementArea: "Time management",
      priorityWarning: "You have overdue tasks that need attention.",
    };
  }

  if (firstHighPriority) {
    return {
      suggestion: `Focus on "${firstHighPriority.title}" next.`,
      reason: "It is marked high priority and still pending.",
      focusArea: "Priority Tasks",
      actionStep: `Work on "${firstHighPriority.title}" before lower-priority tasks.`,
      improvementArea: "Prioritization",
      priorityWarning: "High-priority tasks are still pending.",
    };
  }

  return {
    suggestion: "Keep your momentum going with one task and one habit today.",
    reason:
      "Small wins across both tasks and habits improve your overall productivity score.",
    focusArea: "Daily Momentum",
    actionStep: "Complete one pending task, then mark one habit complete.",
    improvementArea: "Consistency",
    priorityWarning: "",
  };
};

const getAiSuggestion = async (summary, habits, tasks) => {
  if (!process.env.OPENAI_API_KEY) {
    return getFallbackSuggestion(summary);
  }

  try {
    const taskSummary = tasks.map(formatTask);

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
        temperature: 0.7,
        input: [
          {
            role: "system",
            content:
              "You are an AI productivity coach inside a task and habit tracker. Return only valid JSON with these exact keys: suggestion, reason, focusArea, actionStep, improvementArea, priorityWarning. Use specific task names when helpful. Keep each value short, specific, and based only on the data provided.",
          },
          {
            role: "user",
            content: `Create one useful productivity insight for this user. Vary the wording and focus area when possible so repeated refreshes do not feel identical.

Return only JSON in this format:
{
  "suggestion": "",
  "reason": "",
  "focusArea": "",
  "actionStep": "",
  "improvementArea": "",
  "priorityWarning": ""
}

Analytics Summary:
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

    const taskInsights = getTaskInsights(tasks);
    const habitInsights = getHabitInsights(habits);

    const productivityScore = Math.round(
      (taskInsights.taskCompletionRate +
        habitInsights.habitCompletionRate +
        Math.min(habitInsights.bestStreak * 10, 100) -
        Math.min(taskInsights.overdueTasks * 10, 30)) /
        3,
    );

    const safeProductivityScore = Math.max(0, Math.min(100, productivityScore));
    const improvementAreas = getImprovementAreas(taskInsights, habitInsights);

    res.status(200).json({
      tasks: taskInsights,
      habits: habitInsights,
      improvementAreas,
      summary: {
        productivityScore: safeProductivityScore,
        message: buildSummaryMessage(
          safeProductivityScore,
          taskInsights,
          habitInsights,
        ),
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

    const taskInsights = getTaskInsights(tasks);
    const habitInsights = getHabitInsights(habits);

    const productivityScore = Math.round(
      (taskInsights.taskCompletionRate +
        habitInsights.habitCompletionRate +
        Math.min(habitInsights.bestStreak * 10, 100) -
        Math.min(taskInsights.overdueTasks * 10, 30)) /
        3,
    );

    const summary = {
      tasks: taskInsights,
      habits: habitInsights,
      improvementAreas: getImprovementAreas(taskInsights, habitInsights),
      productivityScore: Math.max(0, Math.min(100, productivityScore)),
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
