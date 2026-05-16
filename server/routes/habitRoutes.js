const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const { protect } = require("../middleware/authMiddleware");

// Create a habit
router.post("/", protect, async (req, res) => {
  try {
    const { title, frequency } = req.body;

    const habit = await Habit.create({
      title,
      frequency,
      userId: req.user.id,
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: "Error creating habit", error: error.message });
  }
});

// Get all habits for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: "Error fetching habits", error: error.message });
  }
});

// Update a habit
router.put("/:id", protect, async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: "Error updating habit", error: error.message });
  }
});

// Delete a habit
router.delete("/:id", protect, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting habit", error: error.message });
  }
});

// Mark habit complete
router.patch("/:id/complete", protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    habit.completedDates.push(new Date());
    habit.streakCount += 1;

    await habit.save();

    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: "Error completing habit", error: error.message });
  }
});

module.exports = router;