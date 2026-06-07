const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const { protect } = require("../middleware/authMiddleware");

const isSameDay = (dateA, dateB) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

const getDaysAgo = (date) => {
  if (!date) return null;

  const now = new Date();
  const past = new Date(date);
  const difference = now - past;

  return Math.floor(difference / (1000 * 60 * 60 * 24));
};

const calculateConsistencyScore = (completedDates) => {
  if (!completedDates || completedDates.length === 0) {
    return 0;
  }

  const now = new Date();

  const last30Days = completedDates.filter((date) => {
    const completedDate = new Date(date);
    const difference = now - completedDate;
    const daysAgo = difference / (1000 * 60 * 60 * 24);

    return daysAgo <= 30;
  });

  return Math.min(100, Math.round((last30Days.length / 30) * 100));
};

const getMomentumStatus = (
  streakCount,
  consistencyScore,
  daysSinceLastCheckIn,
) => {
  if (daysSinceLastCheckIn === null) {
    return "Building";
  }

  if (daysSinceLastCheckIn > 3) {
    return "At Risk";
  }

  if (streakCount >= 7 && consistencyScore >= 60) {
    return "Stable";
  }

  if (streakCount >= 3) {
    return "Recovering";
  }

  return "Building";
};

const getHealthStatus = (
  streakCount,
  consistencyScore,
  daysSinceLastCheckIn,
) => {
  if (daysSinceLastCheckIn !== null && daysSinceLastCheckIn > 3) {
    return "At Risk";
  }

  if (streakCount >= 7 && consistencyScore >= 60) {
    return "Strong Momentum";
  }

  if (streakCount >= 3 || consistencyScore >= 30) {
    return "Recovering";
  }

  return "Needs Attention";
};

const getAiInsight = (habit) => {
  if (habit.healthStatus === "Strong Momentum") {
    return "This habit is showing strong consistency. Keep protecting this routine.";
  }

  if (habit.healthStatus === "At Risk") {
    return "This habit has not been checked in recently. Complete it today to rebuild momentum.";
  }

  if (habit.healthStatus === "Recovering") {
    return "This habit is rebuilding consistency. Try to complete it again today.";
  }

  return "This habit is still developing. Focus on one simple check-in today.";
};

router.get("/", protect, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({
      streakCount: -1,
      updatedAt: -1,
    });

    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching habits",
      error: error.message,
    });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title, frequency, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Habit title is required",
      });
    }

    const habit = await Habit.create({
      title: title.trim(),
      frequency: frequency || "daily",
      category: category || "other",
      streakCount: 0,
      bestStreak: 0,
      completedDates: [],
      lastCompletedAt: null,
      consistencyScore: 0,
      momentumStatus: "Building",
      healthStatus: "Needs Attention",
      aiInsight:
        "This habit is still developing. Focus on one simple check-in today.",
      userId: req.user.id,
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({
      message: "Error creating habit",
      error: error.message,
    });
  }
});

router.patch("/:id/check-in", protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    const now = new Date();

    const alreadyCompletedToday = habit.completedDates.some((date) =>
      isSameDay(new Date(date), now),
    );

    if (alreadyCompletedToday) {
      return res.status(400).json({
        message: "Habit already checked in today",
      });
    }

    const daysSinceLastCheckIn = getDaysAgo(habit.lastCompletedAt);

    if (daysSinceLastCheckIn === 1 || daysSinceLastCheckIn === null) {
      habit.streakCount += 1;
    } else if (daysSinceLastCheckIn > 1) {
      habit.streakCount = 1;
    }

    habit.bestStreak = Math.max(habit.bestStreak || 0, habit.streakCount);
    habit.completedDates.push(now);
    habit.lastCompletedAt = now;

    habit.consistencyScore = calculateConsistencyScore(habit.completedDates);

    const updatedDaysSinceLastCheckIn = getDaysAgo(habit.lastCompletedAt);

    habit.momentumStatus = getMomentumStatus(
      habit.streakCount,
      habit.consistencyScore,
      updatedDaysSinceLastCheckIn,
    );

    habit.healthStatus = getHealthStatus(
      habit.streakCount,
      habit.consistencyScore,
      updatedDaysSinceLastCheckIn,
    );

    habit.aiInsight = getAiInsight(habit);

    const updatedHabit = await habit.save();

    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({
      message: "Error checking in habit",
      error: error.message,
    });
  }
});

router.patch("/:id/edit", protect, async (req, res) => {
  try {
    const { title, frequency, category } = req.body;

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    habit.title = title || habit.title;
    habit.frequency = frequency || habit.frequency;
    habit.category = category || habit.category;

    habit.aiInsight = getAiInsight(habit);

    const updatedHabit = await habit.save();

    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({
      message: "Error editing habit",
      error: error.message,
    });
  }
});

router.put("/:id/complete", protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    const now = new Date();

    const alreadyCompletedToday = habit.completedDates.some((date) =>
      isSameDay(new Date(date), now),
    );

    if (!alreadyCompletedToday) {
      habit.completedDates.push(now);
      habit.streakCount += 1;
      habit.bestStreak = Math.max(habit.bestStreak || 0, habit.streakCount);
      habit.lastCompletedAt = now;
    }

    habit.consistencyScore = calculateConsistencyScore(habit.completedDates);

    const daysSinceLastCheckIn = getDaysAgo(habit.lastCompletedAt);

    habit.momentumStatus = getMomentumStatus(
      habit.streakCount,
      habit.consistencyScore,
      daysSinceLastCheckIn,
    );

    habit.healthStatus = getHealthStatus(
      habit.streakCount,
      habit.consistencyScore,
      daysSinceLastCheckIn,
    );

    habit.aiInsight = getAiInsight(habit);

    const updatedHabit = await habit.save();

    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({
      message: "Error completing habit",
      error: error.message,
    });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    res.status(200).json({
      message: "Habit deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting habit",
      error: error.message,
    });
  }
});

module.exports = router;
