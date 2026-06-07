const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["health", "focus", "discipline", "learning", "wellness", "other"],
      default: "other",
    },

    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },

    streakCount: {
      type: Number,
      default: 0,
    },

    bestStreak: {
      type: Number,
      default: 0,
    },

    completedDates: {
      type: [Date],
      default: [],
    },

    lastCompletedAt: {
      type: Date,
      default: null,
    },

    consistencyScore: {
      type: Number,
      default: 0,
    },

    momentumStatus: {
      type: String,
      enum: ["Building", "Stable", "At Risk", "Recovering"],
      default: "Building",
    },

    healthStatus: {
      type: String,
      enum: ["Strong Momentum", "Needs Attention", "At Risk", "Recovering"],
      default: "Needs Attention",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Habit", habitSchema);
