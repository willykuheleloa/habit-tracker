const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");

const getResetTime = (frequency) => {
  if (frequency === "daily") return 24 * 60 * 60 * 1000;
  if (frequency === "weekly") return 7 * 24 * 60 * 60 * 1000;
  if (frequency === "monthly") return 30 * 24 * 60 * 60 * 1000;

  return null;
};

const resetExpiredTasks = async (tasks) => {
  const now = new Date();

  const updatedTasks = await Promise.all(
    tasks.map(async (task) => {
      if (!task.completed || !task.completedAt) {
        return task;
      }

      const resetTime = getResetTime(task.frequency);

      if (!resetTime) {
        return task;
      }

      const completedAt = new Date(task.completedAt);
      const timePassed = now - completedAt;

      if (timePassed >= resetTime) {
        task.completed = false;
        task.completedAt = null;
        return await task.save();
      }

      return task;
    }),
  );

  return updatedTasks;
};

router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({
      completed: 1,
      dueDate: 1,
      createdAt: -1,
    });

    const updatedTasks = await resetExpiredTasks(tasks);

    res.status(200).json(updatedTasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title, notes, dueDate, frequency, priority, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      notes: notes || "",
      dueDate: dueDate || null,
      frequency: frequency || "once",
      priority: priority || "medium",
      category: category || "other",
      completed: false,
      completedAt: null,
      userId: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error creating task",
      error: error.message,
    });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting task",
      error: error.message,
    });
  }
});

module.exports = router;
