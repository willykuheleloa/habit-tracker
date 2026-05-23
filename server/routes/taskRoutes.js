const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title } = req.body;

    const task = await Task.create({
      title,
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
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.completed = !task.completed;

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
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await task.deleteOne();

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